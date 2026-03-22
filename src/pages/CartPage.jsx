import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const items = cart || [];

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, it) => sum + (it.qty || 0), 0);
    const total = items.reduce(
      (sum, it) => sum + (it.qty || 0) * (it.product?.price || 0),
      0
    );
    return { itemCount, total };
  }, [items]);

  if (!items.length) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>🛒 Your cart is empty</h2>
          <p>Add products to your cart and they’ll show up here.</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1">Shopping Cart</h1>
        <p className="p-muted">Review your items and proceed to checkout.</p>
      </div>

      <div className="cart-grid">
        {/* LEFT: Items */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--border-color)" }}>
            <div style={{ fontWeight: 900 }}>
              Items ({totals.itemCount})
              <span className="muted" style={{ marginLeft: 8, fontWeight: 600 }}>
                • {items.length} product(s)
              </span>
            </div>
          </div>

          {items.map((item) => {
            const p = item.product;
            const price = p?.price || 0;
            const qty = item.qty || 1;
            const lineTotal = (price * qty).toFixed(2);

            return (
              <div key={p?._id} className="cart-row">
                {/* Image */}
                <div className="cart-thumb">
                  <img src={p?.image} alt={p?.name} />
                </div>

                {/* Title */}
                <div>
                  <Link
                    to={`/product/${p?._id}`}
                    style={{ textDecoration: "none", fontWeight: 900 }}
                  >
                    {p?.name}
                  </Link>
                  <div className="muted" style={{ marginTop: 4 }}>
                    ${price.toFixed(2)}
                  </div>
                </div>

                {/* Qty */}
                <div className="qty">
                  <button
                    onClick={() => updateQuantity(p._id, Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => updateQuantity(p._id, qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ fontWeight: 900, textAlign: "right" }}>
                  ${lineTotal}
                </div>

                {/* Remove */}
                <button
                  className="icon-btn"
                  onClick={() => removeFromCart(p._id)}
                  title="Remove item"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Summary */}
        <div className="card card-pad">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Order Summary</div>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Items</span>
            <span style={{ fontWeight: 800 }}>{totals.itemCount}</span>
          </div>

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Subtotal</span>
            <span style={{ fontWeight: 900 }}>${totals.total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Shipping</span>
            <span style={{ fontWeight: 800 }}>Free</span>
          </div>

          <div style={{ marginTop: 14, borderTop: "1px solid var(--border-color)", paddingTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 900 }}>Total</span>
              <span style={{ fontWeight: 950, color: "var(--primary-dark)", fontSize: 18 }}>
                ${totals.total.toFixed(2)}
              </span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 14 }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="btn btn-outline"
              style={{ width: "100%", marginTop: 10, textDecoration: "none" }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
