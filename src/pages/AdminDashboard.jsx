import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container">
      <div style={{ marginBottom: 18 }}>
        <h1 className="h1">Admin Dashboard</h1>
        <p className="p-muted">
          Manage products and keep an eye on your store activity.
        </p>
      </div>

      {/* Top stats / overview */}
      <div className="admin-grid">
        <div className="card admin-card">
          <div className="admin-card-header">
            <span>Products</span>
            <span className="admin-chip">Catalog</span>
          </div>
          <div className="admin-stat-number">—</div>
          <div className="admin-muted">
            Total products in your store
          </div>
        </div>

        <div className="card admin-card">
          <div className="admin-card-header">
            <span>Orders</span>
            <span className="admin-chip">Coming soon</span>
          </div>
          <div className="admin-stat-number">—</div>
          <div className="admin-muted">
            Orders overview will appear here.
          </div>
        </div>

        <div className="card admin-card">
          <div className="admin-card-header">
            <span>Customers</span>
            <span className="admin-chip">Coming soon</span>
          </div>
          <div className="admin-stat-number">—</div>
          <div className="admin-muted">
            Customer stats will show here.
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card admin-card" style={{ marginTop: 18 }}>
        <div className="admin-card-header">
          <span>Quick Actions</span>
        </div>
        <div className="admin-actions">
          <Link
            to="/admin/products"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Manage Products
          </Link>

          <Link
            to="/admin/products/new"
            className="btn btn-outline"
            style={{ textDecoration: "none" }}
          >
            Add New Product
          </Link>

          <Link
            to="/"
            className="btn btn-outline"
            style={{ textDecoration: "none" }}
          >
            View Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
