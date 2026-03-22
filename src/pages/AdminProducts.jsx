import API_URL from "../api";
import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminProducts() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest"); // newest | price_asc | price_desc
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        if (!mounted) return;
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (err) {
        console.error("Load products:", err);
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      // optimistic update locally
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // filter + sort
  const processed = useMemo(() => {
    let list = products.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else list.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));

    return list;
  }, [products, query, sort]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]); // reset if out of range

  const visible = processed.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container">
      <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 className="h1">Manage Products</h1>
          <p className="p-muted">Search, edit, or remove products. Only admins can perform these actions.</p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/admin/products/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
            + Add Product
          </Link>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            className="input"
            placeholder="Search by name, category or brand..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            style={{ minWidth: 260 }}
          />

          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180 }}>
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Sort: Price ↑</option>
            <option value="price_desc">Sort: Price ↓</option>
          </select>

          <div style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
            {processed.length} result{processed.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card card-pad">Loading products...</div>
      ) : error ? (
        <div className="card card-pad" style={{ color: "var(--danger)" }}>{error}</div>
      ) : (
        <>
          {/* product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {visible.map((p) => (
              <div key={p._id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
                  <img src={p.image || "/placeholder.png"} alt={p.name} style={{ maxWidth: "88%", maxHeight: "88%", objectFit: "contain" }} />
                </div>

                <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div className="p-muted" style={{ fontSize: 13 }}>{p.brand} • {p.category}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900, color: "var(--primary-dark)", fontSize: 18 }}>${Number(p.price || 0).toFixed(2)}</div>
                      <div className="p-muted" style={{ fontSize: 13 }}>{p.countInStock} in stock</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <Link to={`/admin/products/${p._id}/edit`} className="btn btn-outline" style={{ textDecoration: "none", flex: 1 }}>
                      Edit
                    </Link>

                    <button className="btn" style={{ borderColor: "rgba(239,68,68,0.35)", color: "var(--danger)", flex: 1 }} onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>

            {/* show page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const active = p === page;
              return (
                <button
                  key={p}
                  className="btn"
                  style={{
                    borderColor: active ? "transparent" : undefined,
                    background: active ? "var(--primary)" : undefined,
                    color: active ? "white" : undefined,
                    fontWeight: active ? 900 : 700,
                    minWidth: 40,
                  }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}

            <button className="btn btn-outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
