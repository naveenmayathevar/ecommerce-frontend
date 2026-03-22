import API_URL from "../api";
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isWishlisted } = useContext(WishlistContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return (
      <div className="container">
        <div className="card card-pad">Loading product...</div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    addToCart(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 14 }}>
        <Link to="/" className="btn btn-outline" style={{ textDecoration: "none", fontSize: 13 }}>
          ← Back to Products
        </Link>
      </div>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, overflow: "hidden" }}>
        {/* Image */}
        <div style={{
          background: "#f8f8f8", display: "flex", alignItems: "center",
          justifyContent: "center", padding: 40, minHeight: 360,
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ maxWidth: "100%", maxHeight: 320, objectFit: "contain" }}
          />
        </div>

        {/* Details */}
        <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 32 }}>
          <div>
            <span className="badge" style={{ marginBottom: 10 }}>{product.category}</span>
            {product.brand && (
              <span className="muted" style={{ marginLeft: 8, fontSize: 13 }}>{product.brand}</span>
            )}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{product.name}</h1>

          <div style={{ fontSize: 28, fontWeight: 900, color: "var(--primary-dark)" }}>
            ${Number(product.price).toFixed(2)}
          </div>

          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
            {product.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="muted" style={{ fontSize: 13 }}>
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : "Out of stock"}
            </span>
          </div>

          {/* Qty picker */}
          {product.countInStock > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="label">Qty:</span>
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))} aria-label="Increase">+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, minWidth: 140 }}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              {added ? "✓ Added!" : product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              className="btn btn-outline"
              style={{ flex: 1, minWidth: 140 }}
              onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)}
            >
              {wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
