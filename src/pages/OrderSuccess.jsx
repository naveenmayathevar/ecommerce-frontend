import { useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useContext(CartContext);

  // Clear cart on successful payment
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="container">
      <div className="empty-state card card-pad" style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h1 className="h1" style={{ marginBottom: 8 }}>Payment Successful!</h1>
        <p className="p-muted" style={{ marginBottom: 6 }}>
          Your order has been placed and payment confirmed.
        </p>
        {sessionId && (
          <p className="small" style={{ marginBottom: 24, color: "var(--text-muted)" }}>
            Stripe session: <code style={{ fontSize: 11 }}>{sessionId.slice(0, 24)}…</code>
          </p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/orders" className="btn btn-primary" style={{ textDecoration: "none" }}>
            View My Orders
          </Link>
          <Link to="/" className="btn btn-outline" style={{ textDecoration: "none" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
