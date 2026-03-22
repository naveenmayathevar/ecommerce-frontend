import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
