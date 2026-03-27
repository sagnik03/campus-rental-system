import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      const token = response?.data?.data?.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      navigate("/");
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg transition-all duration-200 md:p-10">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-3xl font-bold text-textMain">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-textMain/75">
          Access your curated campus rental listings and profile.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-2 ml-1 block text-xs font-semibold uppercase tracking-wider text-textMain/75"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
            placeholder="name@university.edu"
          />
        </div>

        <div>
          <div className="mb-2 ml-1 flex items-center justify-between">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-textMain/75"
              htmlFor="password"
            >
              Password
            </label>
            <span className="text-xs font-medium text-primary">Forgot?</span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-headline font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span>{isSubmitting ? "Logging in..." : "Login"}</span>
        </button>
      </form>

      <p className="mt-8 border-t border-border pt-8 text-center text-sm text-textMain/75">
        New user?{" "}
        <Link
          to="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Signup
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;
