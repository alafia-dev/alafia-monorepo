import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import logo from "../img/logo2.png";

export const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/auth/forgot-password", { email });

      setMessage(`A reset code has been sent to ${email}`);

      // ✅ Navigate AFTER success
      setTimeout(() => {
        navigate("/register/reset-password-otp", { state: { email } });
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2">
              Forgot Password
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Enter your email and we’ll send you a reset code
            </p>
          </div>

          {/* SUCCESS */}
          {message && (
            <div className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />

            {/* ✅ FIXED: No Link wrapper */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              Send Reset Code
            </button>
          </form>

          {/* Back to login */}
          <p className="text-sm text-center text-muted-foreground mt-6">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary cursor-pointer hover:underline"
            >
              Go back to login
            </span>
          </p>

        </div>
      </section>
    </div>
  );
};