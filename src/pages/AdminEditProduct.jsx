import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ImageUploader from "../components/ImageUploader";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (!mounted) return;
        const p = res.data;
        setForm({
          name: p.name || "",
          description: p.description || "",
          image: p.image || "",
          brand: p.brand || "",
          category: p.category || "",
          price: p.price ?? "",
          countInStock: p.countInStock ?? "",
        });
      } catch (err) {
        console.error("Load product error:", err);
        alert("Failed to load product. It may not exist.");
        navigate("/admin/products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProduct();
    return () => { mounted = false; };
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onImageUpload = (url) => {
    setForm((s) => ({ ...s, image: url }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.image) return "Image is required.";
    if (!form.price || Number(form.price) <= 0) return "Price must be > 0.";
    if (form.countInStock === "" || Number(form.countInStock) < 0) return "Invalid stock count.";
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        image: form.image,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
      };

      const res = await axios.put(`http://localhost:5000/api/products/${id}`, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      alert("Product updated");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });

      alert("Product deleted");
      navigate("/admin/products");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ padding: 40 }} className="card card-pad">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1">Edit Product</h1>
        <p className="p-muted">Change details or replace the product image.</p>
      </div>

      <div className="card card-pad admin-form-card">
        <form onSubmit={handleSave}>
          <div className="admin-form-grid">
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Product Name *</label>
              <input className="input" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="label">Brand</label>
              <input className="input" name="brand" value={form.brand} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="label">Category</label>
              <input className="input" name="category" value={form.category} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="label">Price *</label>
              <input className="input" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="label">Stock Count *</label>
              <input className="input" name="countInStock" type="number" min="0" step="1" value={form.countInStock} onChange={handleChange} required />
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Product Image *</label>
              <ImageUploader onUpload={onImageUpload} />
              {form.image && (
                <div style={{ marginTop: 10 }}>
                  <div className="image-preview">
                    <img src={form.image} alt="preview" />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Description *</label>
              <textarea className="input" name="description" rows={5} value={form.description} onChange={handleChange} required />
            </div>
          </div>

          <div className="admin-form-actions" style={{ marginTop: 18 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link to="/admin/products" className="btn btn-outline" style={{ textDecoration: "none" }}>
              Cancel
            </Link>

            <button
              type="button"
              className="btn"
              style={{ borderColor: "rgba(239,68,68,0.35)", color: "var(--danger)" }}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
