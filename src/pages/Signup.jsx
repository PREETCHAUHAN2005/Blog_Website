import SignupForm from "../components/Signup";
import usePageTitle from "../hooks/usePageTitle";

export default function Signup() {
  usePageTitle("Sign up");
  return <SignupForm />;
}
