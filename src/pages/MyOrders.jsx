import API_URL from "../api";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const { token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/orders/myorders`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
        if (!mounted) return;
        setOrders(data);
      } catch (err) {
        console.error("Load orders:", err);
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [token]);

  if (loading) {
    return (
      <div className="container">
        <div className="card card-pad">Loading your order history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card card-pad" style={{ color: "var(--danger)" }}>{error}</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-state card card-pad">
          <h2>No orders yet</h2>
          <p className="p-muted">You haven't placed any orders. Browse products to start an order history.</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: "none", marginTop: 12 }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 16 }}>
        <h1 className="h1">Order History</h1>
        <p className="p-muted">All your past orders (read-only).</p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((order) => {
          const created = new Date(order.createdAt).toLocaleDateString();
          const itemCount = (order.orderItems || []).reduce((s, it) => s + (it.qty || 0), 0);
          const firstImage = order.orderItems?.[0]?.product?.image || "/placeholder.png";

          return (
            <div key={order._id} className="card card-pad" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                <div style={{
                  width: 84,
                  height: 84,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fafafa"
                }}>
                  <img src={firstImage} alt="order item" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Order #{order._id}
                  </div>
                  <div className="p-muted" style={{ fontSize: 13 }}>{created} • {itemCount} item{itemCount !== 1 ? "s" : ""}</div>
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: 140 }}>
                <div style={{ fontWeight: 900, color: "var(--primary-dark)" }}>${Number(order.totalPrice || 0).toFixed(2)}</div>
                <div className="p-muted" style={{ fontSize: 13 }}>
                  {order.isPaid ? `Paid` : `Unpaid`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
