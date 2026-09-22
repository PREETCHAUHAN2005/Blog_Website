import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../store/authSlice";
import authService from "../appwrite/auth";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData }));
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "Could not sign in.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-center font-serif text-4xl font-normal">Sign in</h1>
      <p className="mt-3 text-center text-sm text-[#6b6560]">
        No account?{" "}
        <Link to="/signup" className="text-[#1c1917] underline underline-offset-4">
          Sign up
        </Link>
      </p>
      {error && <p className="mt-4 text-sm text-[#8a2b2b]">{error}</p>}
      <form onSubmit={handleSubmit(login)} className="mt-6 space-y-4">
        <Input
          label="Email"
          placeholder="you@email.com"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required." })}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
