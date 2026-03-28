import React, { useState, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const logo = "../img/logo4.png"; 

interface LocationState {
  email?: string;
}

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPassword: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const email = state?.email || "";

  const schema = z
    .object({
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/\d/, "Password must contain a number"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const mutation = useMutation({
    mutationFn: async () =>
      API.post("/auth/reset-password", { email, newPassword: form.newPassword }),
    onSuccess: () => {
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message); // Fixed 'errors' to 'issues'
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-xl">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="logo" className="w-20 h-20 rounded-lg" />
        </div>

        <h2 className="text-3xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {error && <p className="text-destructive text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </span>
          </div>

          <button
            type="submit"
            disabled={mutation.status === "loading"}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            {mutation.status === "loading" ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};