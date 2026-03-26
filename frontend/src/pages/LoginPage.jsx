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
    <section className="mx-auto w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-lg ring-1 ring-outline-variant/15 md:p-10">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-3xl font-bold text-on-surface">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Access your curated campus rental listings and profile.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-2 ml-1 block text-xs font-semibold uppercase tracking-wider text-outline"
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
            className="w-full rounded-lg border-0 bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20"
            placeholder="name@university.edu"
          />
        </div>

        <div>
          <div className="mb-2 ml-1 flex items-center justify-between">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-outline"
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
            className="w-full rounded-lg border-0 bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-indigo-700 py-3.5 font-headline font-bold text-white shadow-md shadow-indigo-700/25 transition-all hover:bg-indigo-800 hover:shadow-lg hover:shadow-indigo-800/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span>{isSubmitting ? "Logging in..." : "Login"}</span>
        </button>
      </form>

      <p className="mt-8 border-t border-outline-variant/10 pt-8 text-center text-sm text-on-surface-variant">
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
