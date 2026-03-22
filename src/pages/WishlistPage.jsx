import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>💔 Your wishlist is empty</h2>
          <p>Looks like you haven’t added anything yet.</p>

          <Link to="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 20 }}>
        <h1 className="h1">My Wishlist</h1>
        <p className="p-muted">
          Items you love — add them to your cart anytime.
        </p>
      </div>

      <div className="grid-products">
        {wishlist.map((p) => (
          <div key={p._id} className="card" style={{ overflow: "hidden" }}>
            
            {/* Image */}
            <div className="product-img">
              <img src={p.image} alt={p.name} />
            </div>

            {/* Content */}
            <div className="card-pad">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span className="badge">{p.category}</span>

                <button
                  onClick={() => removeFromWishlist(p._id)}
                  title="Remove from wishlist"
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </div>

              <div style={{ marginTop: 10, fontWeight: 800 }}>
                {p.name}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 18,
                  fontWeight: 900,
                  color: "var(--primary-dark)",
                }}
              >
                ${p.price}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => addToCart(p._id, 1)}
                >
                  Add to Cart
                </button>

                <Link
                  to={`/product/${p._id}`}
                  className="btn btn-outline"
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
