import LoginForm from "../components/Login";
import usePageTitle from "../hooks/usePageTitle";

export default function Login() {
  usePageTitle("Sign in");
  return <LoginForm />;
}
