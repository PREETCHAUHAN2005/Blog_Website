import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../store/authSlice";
import authService from "../appwrite/auth";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login({ userData }));
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "Could not create the account.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-center font-serif text-4xl font-normal">Create your account</h1>
      <p className="mt-3 text-center text-sm text-[#6b6560]">
        Already have an account?{" "}
        <Link to="/login" className="text-[#1c1917] underline underline-offset-4">
          Sign in
        </Link>
      </p>
      {error && <p className="mt-4 text-sm text-[#8a2b2b]">{error}</p>}
      <form onSubmit={handleSubmit(create)} className="mt-6 space-y-4">
        <Input
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name", { required: "Name is required." })}
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required.",
            minLength: { value: 8, message: "Use at least 8 characters." },
          })}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
