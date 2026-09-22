import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

export default function LogoutBtn({ className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    authService.logout().finally(() => {
      dispatch(logout());
      navigate("/");
    });
  };

  return (
    <button type="button" className={className} onClick={logoutHandler}>
      Sign out
    </button>
  );
}
