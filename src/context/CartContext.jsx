import API_URL from "../api";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Load cart from backend
  const loadCart = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data.items || []);
    } catch (err) {
      console.log("Load cart error:", err);
    }
  };

  // Load on login
  useEffect(() => {
    loadCart();
  }, [token]);

  // Add item
  const addToCart = async (productId, qty = 1) => {
    try {
      await axios.post(
        `${API_URL}/api/cart",
        { productId, qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadCart();
    } catch (err) {
      console.log("Add to cart error:", err);
    }
  };
const updateQuantity = async (productId, qty) => {
  try {
    await axios.put(
      `${API_URL}/api/cart/${productId}`,
      { qty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadCart();
  } catch (err) {
    console.log("Update quantity error:", err);
  }
};

  // Remove item
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `${API_URL}/api/cart/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadCart();
    } catch (err) {
      console.log("Remove cart error:", err);
    }
  };

  // Clear cart fully (backend + frontend)
  const clearCart = async () => {
    try {
      for (let item of cart) {
        await axios.delete(
          `${API_URL}/api/cart/${item.productId._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setCart([]);
    } catch (err) {
      console.log("Clear cart error:", err);
    }
  };

  return (
   <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>

      {children}
    </CartContext.Provider>
  );
}
