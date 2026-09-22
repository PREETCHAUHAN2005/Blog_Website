import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) navigate("/login");
    else if (!authentication && authStatus) navigate("/");
  }, [authStatus, navigate, authentication]);

  if (authentication && !authStatus) return null;
  if (!authentication && authStatus) return null;
  return children;
}
