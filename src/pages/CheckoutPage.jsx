import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

function CheckoutPage() {
  const { cart } = useContext(CartContext);
  const { token, user } = useContext(AuthContext);
  const items = cart || [];

  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, it) => sum + (it.qty || 0) * (it.product?.price || 0),
      0
    );
    return { subtotal, shipping: 0, total: subtotal };
  }, [items]);

  if (!items.length) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Checkout</h2>
          <p>Your cart is empty. Add products first.</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const placeOrder = async () => {
    setError("");

    if (!form.fullName || !form.email || !form.address || !form.city || !form.zip) {
      setError("Please fill required fields: Name, Email, Address, City, ZIP.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in backend
      const orderPayload = {
        orderItems: items.map((it) => ({
          name: it.product.name,
          qty: it.qty,
          image: it.product.image,
          price: it.product.price,
          product: it.product._id,
        })),
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.zip,
          country: form.state || "US",
        },
        paymentMethod: "Stripe",
        itemsPrice: totals.subtotal,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: totals.total,
      };

      await axios.post("http://localhost:5000/api/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Create Stripe Checkout Session and redirect
      const { data } = await axios.post(
        "http://localhost:5000/api/stripe/create-checkout-session",
        {
          items: items.map((it) => ({
            name: it.product.name,
            image: it.product.image,
            price: it.product.price,
            qty: it.qty,
          })),
          customer: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            notes: form.notes,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Redirect to Stripe-hosted payment page
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1">Checkout</h1>
        <p className="p-muted">Enter your details and confirm your order.</p>
      </div>

      {error && (
        <div className="card card-pad" style={{ marginBottom: 14, color: "var(--danger)" }}>
          {error}
        </div>
      )}

      <div className="checkout-grid">
        {/* LEFT: Form */}
        <div className="card card-pad">
          <h2 className="h2" style={{ marginBottom: 12 }}>Shipping & Contact</h2>
          <p className="small">Fields marked * are required.</p>
          <div className="hr" />

          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Full Name *</label>
              <input className="input" value={form.fullName} onChange={onChange("fullName")} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label className="label">Email *</label>
              <input className="input" type="email" value={form.email} onChange={onChange("email")} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={onChange("phone")} placeholder="+1 (xxx) xxx-xxxx" />
            </div>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Address *</label>
              <input className="input" value={form.address} onChange={onChange("address")} placeholder="Street, apartment, etc." />
            </div>
            <div className="form-group">
              <label className="label">City *</label>
              <input className="input" value={form.city} onChange={onChange("city")} placeholder="Phoenix" />
            </div>
            <div className="form-group">
              <label className="label">State</label>
              <input className="input" value={form.state} onChange={onChange("state")} placeholder="AZ" />
            </div>
            <div className="form-group">
              <label className="label">ZIP Code *</label>
              <input className="input" value={form.zip} onChange={onChange("zip")} placeholder="85001" />
            </div>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Order Notes</label>
              <textarea
                className="input"
                value={form.notes}
                onChange={onChange("notes")}
                placeholder="Any delivery instructions?"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="hr" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/cart" className="btn btn-outline" style={{ textDecoration: "none" }}>Back to Cart</Link>
            <button className="btn btn-primary" onClick={placeOrder} disabled={loading}>
              {loading ? "Redirecting to payment..." : "Pay with Stripe →"}
            </button>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="card card-pad">
          <h2 className="h2">Order Summary</h2>
          <p className="small" style={{ marginTop: 6 }}>
            {items.length} product(s) • You'll be redirected to Stripe to pay
          </p>
          <div className="hr" />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((it) => (
              <div key={it.product?._id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, border: "1px solid var(--border-color)",
                  background: "#f3f4f6", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <img src={it.product?.image} alt={it.product?.name} style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, lineHeight: 1.2 }}>{it.product?.name}</div>
                  <div className="small">Qty: <b>{it.qty}</b> • ${it.product?.price?.toFixed(2)}</div>
                </div>
                <div style={{ fontWeight: 900 }}>${(Number(it.qty) * Number(it.product?.price || 0)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="hr" />
          <div className="summary-row"><span className="muted">Subtotal</span><b>${totals.subtotal.toFixed(2)}</b></div>
          <div className="summary-row"><span className="muted">Shipping</span><b>Free</b></div>
          <div className="hr" />
          <div className="summary-row">
            <span style={{ fontWeight: 900 }}>Total</span>
            <span style={{ fontWeight: 950, color: "var(--primary-dark)", fontSize: 18 }}>${totals.total.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={placeOrder} disabled={loading}>
            {loading ? "Redirecting..." : "Confirm & Pay with Stripe →"}
          </button>
          <p className="small" style={{ marginTop: 10, color: "var(--text-muted)" }}>
            🔒 Secure payment via Stripe. You'll complete payment on Stripe's hosted page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
