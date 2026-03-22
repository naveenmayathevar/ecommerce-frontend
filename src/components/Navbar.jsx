import { Link, NavLink } from "react-router-dom";
import { useContext, useMemo, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const cartCount = useMemo(() => cart?.length || 0, [cart]);
  const wishCount = useMemo(() => wishlist?.length || 0, [wishlist]);

  // Close menus on route change-like behavior (simple: close when user changes auth)
  useEffect(() => {
    setUserOpen(false);
  }, [user]);

  const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left */}
        <div className="nav-left">
          <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
            MyShop
          </Link>

          {/* Desktop links */}
          <nav className="nav-links">
            <NavLink to="/" className={navClass} end>Home</NavLink>
            <NavLink to="/wishlist" className={navClass}>Wishlist</NavLink>
            {user && <NavLink to="/orders" className={navClass}>My Orders</NavLink>}
            {user?.isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
          </nav>
        </div>

        {/* Right */}
        <div className="nav-right">
          {/* Always visible pills */}
          <Link to="/cart" className="pill-link" onClick={() => setMobileOpen(false)}>
            Cart <span className="badge-count">{cartCount}</span>
          </Link>

          <Link to="/wishlist" className="pill-link" onClick={() => setMobileOpen(false)}>
            Wishlist <span className="badge-count">{wishCount}</span>
          </Link>

          {/* Desktop auth buttons */}
          <div className="nav-links">
            {!user ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link active">Register</Link>
              </>
            ) : (
              <div style={{ position: "relative" }}>
                <button
                  className="icon-btn"
                  onClick={() => setUserOpen((v) => !v)}
                  aria-label="User menu"
                  title="User"
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </button>

                {userOpen && (
                  <div
                    className="card card-pad"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 48,
                      minWidth: 220,
                      zIndex: 3000,
                    }}
                    onMouseLeave={() => setUserOpen(false)}
                  >
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
                      Signed in as <b style={{ color: "var(--text-main)" }}>{user.name}</b>
                    </div>

                    <Link to="/orders" style={{ display: "block", padding: "10px 0", textDecoration: "none" }}>
                      My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link to="/admin" style={{ display: "block", padding: "10px 0", textDecoration: "none" }}>
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      className="btn btn-outline"
                      style={{ width: "100%", borderColor: "rgba(239,68,68,0.35)", color: "var(--danger)" }}
                      onClick={() => { setUserOpen(false); logout(); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="icon-btn hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            title="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={mobileOpen ? "mobile-drawer open" : "mobile-drawer"}>
        <div className="mobile-drawer-inner">
          <NavLink to="/" className={navClass} end onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/wishlist" className={navClass} onClick={() => setMobileOpen(false)}>Wishlist</NavLink>

          {user && (
            <NavLink to="/orders" className={navClass} onClick={() => setMobileOpen(false)}>
              My Orders
            </NavLink>
          )}

          {user?.isAdmin && (
            <NavLink to="/admin" className={navClass} onClick={() => setMobileOpen(false)}>
              Admin
            </NavLink>
          )}

          <div className="mobile-row">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  Register
                </Link>
              </>
            ) : (
              <button
                className="btn btn-outline"
                style={{ borderColor: "rgba(239,68,68,0.35)", color: "var(--danger)" }}
                onClick={() => { setMobileOpen(false); logout(); }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
