import API_URL from "../api";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";

/**
 * AdminAddProduct (drop-in)
 *
 * - Uses AuthContext.token for authorized requests.
 * - Uses ImageUploader which will call /api/upload and return a URL back via onUpload.
 * - Basic client-side validation, preview and disabled submit while uploading.
 */
export default function AdminAddProduct() {
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

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onImageUpload = (url) => {
    // called by ImageUploader after successful upload
    setForm((s) => ({ ...s, image: url }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.image) return "You must upload an image.";
    if (!form.price || Number(form.price) <= 0) return "Price must be > 0.";
    if (!form.countInStock || Number(form.countInStock) < 0) return "Invalid stock count.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setLoading(true);

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

      const res = await axios.post(`${API_URL}/api/products", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      alert("Product created");
      navigate("/admin/products");
    } catch (err) {
      console.error("Create product error:", err);
      alert(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1">Add New Product</h1>
        <p className="p-muted">Upload product image and fill in details.</p>
      </div>

      <div className="card card-pad admin-form-card">
        <form onSubmit={submit}>
          <div className="admin-form-grid">
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Product Name *</label>
              <input
                className="input"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Brand</label>
              <input
                className="input"
                name="brand"
                placeholder="Brand"
                value={form.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Category</label>
              <input
                className="input"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label">Price *</label>
              <input
                className="input"
                type="number"
                name="price"
                placeholder="49.99"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Stock Count *</label>
              <input
                className="input"
                type="number"
                name="countInStock"
                placeholder="25"
                min="0"
                step="1"
                value={form.countInStock}
                onChange={handleChange}
                required
              />
            </div>

            {/* Image Uploader (spans two columns) */}
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="label">Product Image *</label>

              <ImageUploader
                onUpload={(url) => onImageUpload(url)}
                // optional: if your backend expects "file" instead of "image"
                // fieldName="file"
              />

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
              <textarea
                className="input"
                name="description"
                rows={5}
                placeholder="Product description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || uploading}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>

            <Link to="/admin/products" className="btn btn-outline" style={{ textDecoration: "none" }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
