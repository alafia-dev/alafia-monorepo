import React, { useState, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";
import logo from "../img/logo4.png";

interface LocationState {
  email?: string;
}

export const ResetPasswordOTP: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const email = state?.email || "";

  // Verify OTP mutation
  const verifyMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      const res = await API.post("/auth/verify-otp", { email, otp: otpCode });
      return res.data;
    },
    onSuccess: () => {
      setMessage("OTP verified! Redirecting...");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "OTP verification failed");
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await API.post("/auth/resend-otp", { email });
      return res.data;
    },
    onSuccess: () => setMessage("OTP resent successfully!"),
    onError: (err: any) =>
      setError(err.response?.data?.message || "Failed to resend OTP"),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.some((d) => d === "")) {
      setError("Please enter all 4 digits");
      return;
    }

    verifyMutation.mutate(otp.join(""));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-xl">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="logo" className="w-20 h-20 rounded-lg" />
        </div>

        <h2 className="text-3xl font-semibold text-center mb-6">Enter OTP</h2>

        {error && <p className="text-destructive text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                className="w-14 h-14 text-center text-xl border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifyMutation.status === "loading"}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            {verifyMutation.status === "loading" ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Didn't receive OTP?{" "}
          <button
            type="button"
            onClick={() => resendMutation.mutate()}
            disabled={resendMutation.status === "loading"}
            className="text-primary hover:underline"
          >
            {resendMutation.status === "loading" ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};