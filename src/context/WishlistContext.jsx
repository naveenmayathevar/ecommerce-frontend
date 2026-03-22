import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);

  // STATE
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist on startup
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Check if product is already wishlisted
  const isWishlisted = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    if (!user) {
      alert("Login required to wishlist items");
      return;
    }

    if (isWishlisted(product._id)) return;

    setWishlist([...wishlist, product]);
  };

  // Remove item
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item._id !== id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
