import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/logo4.png";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = {
  email: string;
  password: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-white text-foreground border border-slate-200 shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await API.post("/auth/login", data);
      return res.data;
    },

    onSuccess: (data) => {
      setAuth(data.token, data.user.role);
      localStorage.setItem("token", data.token);

      switch (data.user.role) {
        case "doctor":
          navigate("/dashboard/doctor");
          break;
        case "nurse":
          navigate("/dashboard/nurse");
          break;
        case "lab":
          navigate("/dashboard/lab");
          break;
        case "pharmacy":
          navigate("/dashboard/pharmacy");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "patient":
          navigate("/dashboard/patient");
          break;
        default:
          navigate("/");
      }
    },

    onError: (err: any) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = LoginSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    loginMutation.mutate(form);
  };

  const loading = loginMutation.isLoading;

  return (
    <div className="min-h-screen bg-muted/60 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Alafia"
            className="w-24 h-24 rounded-xl object-cover shadow-md mb-4"
          />
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Own your health
          </p>
          <h1 className="text-2xl font-semibold text-foreground mt-2">
            Login
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Sign in to your health wallet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            Register
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};
