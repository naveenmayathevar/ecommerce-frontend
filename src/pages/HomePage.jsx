import API_URL from "../api";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist, isWishlisted } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // GRID STYLE
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
    padding: "20px",
  };

  // CARD
  const card = {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #eee",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
    transition: "0.25s ease",
    position: "relative",
    cursor: "pointer",
  };

  const cardHover = {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
  };

  // IMAGE CONTAINER
  const imgWrapper = {
    width: "100%",
    height: "240px",
    background: "#f8f8f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const imgStyle = {
    width: "90%",
    height: "90%",
    objectFit: "contain",
  };

  // HEART BUTTON
  const heartStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    fontSize: "26px",
    cursor: "pointer",
    userSelect: "none",
    transition: "0.2s ease",
  };

  // LABEL / CATEGORY TAG (OPTIONAL)
  const tag = {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "4px 10px",
    background: "var(--primary)",
    color: "white",
    fontSize: "12px",
    borderRadius: "6px",
  };

  // CONTENT SECTION
  const content = {
    padding: "18px",
    textAlign: "left",
  };

  const nameStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "var(--text-main)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const priceStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--primary-dark)",
    margin: "8px 0",
  };

  const btnWrapper = {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  };

  const primaryBtn = {
    flex: 1,
    padding: "10px 0",
    background: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const secondaryBtn = {
    flex: 1,
    padding: "10px 0",
    background: "white",
    color: "var(--primary-dark)",
    border: "2px solid var(--primary-dark)",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
  <div className="container">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 18 }}>
      <div>
        <h1 className="h1">Featured Products</h1>
        <p className="p-muted">Browse our latest items and add them to your cart.</p>
      </div>
    </div>

    <div className="grid-products">
      {products.map((p) => (
        <div key={p._id} className="card" style={{ overflow: "hidden" }}>
          <div className="product-img">
            <img src={p.image} alt={p.name} />
          </div>

          <div className="card-pad">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span className="badge">{p.category}</span>

              <span
                style={{ fontSize: 20, cursor: "pointer", userSelect: "none" }}
                onClick={() => (isWishlisted(p._id) ? removeFromWishlist(p._id) : addToWishlist(p))}
                title="Wishlist"
              >
                {isWishlisted(p._id) ? "❤️" : "🤍"}
              </span>
            </div>

            <div style={{ marginTop: 10, fontWeight: 800 }}>{p.name}</div>
            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900, color: "var(--primary-dark)" }}>${p.price}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => addToCart(p._id, 1)}>
                Add to Cart
              </button>

              <Link className="btn btn-outline" style={{ flex: 1, textDecoration: "none" }} to={`/product/${p._id}`}>
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

export default HomePage;
