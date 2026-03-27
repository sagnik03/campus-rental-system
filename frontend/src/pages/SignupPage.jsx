import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await api.post("/auth/signup", formData);
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
        "Signup failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-200 md:grid-cols-2">
      <div className="relative hidden min-h-[620px] md:block">
        <img
          alt="Campus"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq8R-zc5Rad6ttnTBzV4JaC1_5US_kr_7Ee5zKLJSRsxYbPmUGpY8TmwaoriCLfUt6A-FBtCRPVp3MhBd8EL1JyKQuR6eAagcTwXh2cnf80TRbzqILYyNqAofVgeKlaMMRgI6r6foG3hEhKAKaJ_t35w_bwkhcklSog8nez3ODxI1ArHw4L-oO5kVONMnhc6q97GM_INnB5ota4Z9W9AcSnErYK0RlnWSPwBY6a6xdzfC7dKyIu2pfthY7l1FTv-7V2vAl8V0uU2Zz"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="font-headline text-4xl font-bold leading-tight">
            Start your campus journey with confidence.
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Join students finding affordable rentals and marketplace deals every
            semester.
          </p>
        </div>
      </div>

      <div className="p-8 md:p-16">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-headline text-3xl font-bold text-textMain">
            Create account
          </h1>
          <p className="mt-2 text-textMain/75">
            Enter your details to register for the campus marketplace.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-textMain/75"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="Alex Johnson"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-textMain/75"
              htmlFor="email"
            >
              University Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="alex@university.edu"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-textMain/75"
              htmlFor="password"
            >
              Password
            </label>
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
            className="w-full rounded-xl bg-primary px-6 py-4 font-headline font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="mt-8 border-t border-border pt-8 text-center text-sm text-textMain/75 md:text-left">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;
