import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import {
  User,
  Stethoscope,
  Syringe,
  FlaskConical,
  Pill,
  Eye,
  EyeOff,
} from "lucide-react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import logo from "../img/logo4.png";

/* ================= TYPES ================= */
type RegisterForm = {
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  name: string;
  hospital: string;
  specialization: string;
  labName: string;
  pharmacyName: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  commonAllergies: string;
  disability: string;
};

/* ================= ZOD ================= */
const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.string(),

    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
    hospital: z.string().optional(),
    specialization: z.string().optional(),
    labName: z.string().optional(),
    pharmacyName: z.string().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    bloodType: z.string().optional(),
    allergies: z.string().optional(),
    commonAllergies: z.string().optional(),
    disability: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ================= ROLE UI ================= */
const roleStyles: Record<string, string> = {
  patient: "bg-blue-500 text-white",
  doctor: "bg-green-500 text-white",
  nurse: "bg-teal-500 text-white",
  lab: "bg-purple-500 text-white",
  pharmacy: "bg-yellow-500 text-black",
};

const roles = [
  { value: "patient", label: "Patient", icon: User },
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "nurse", label: "Nurse", icon: Syringe },
  { value: "lab", label: "Lab", icon: FlaskConical },
  { value: "pharmacy", label: "Pharmacy", icon: Pill },
];

/* ================= COMPONENT ================= */
export const Register = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState<RegisterForm>({
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    name: "",
    hospital: "",
    specialization: "",
    labName: "",
    pharmacyName: "",
    phoneNumber: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    commonAllergies: "",
    disability: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev: RegisterForm) => ({ ...prev, [field]: value }));
  };

  const resetRole = () => {
    setSelectedRole(null);
    setForm({
      role: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      name: "",
      hospital: "",
      specialization: "",
      labName: "",
      pharmacyName: "",
      phoneNumber: "",
      dateOfBirth: "",
      bloodType: "",
      allergies: "",
      commonAllergies: "",
      disability: "",
    });
  };

  /* ================= MUTATION ================= */
  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await API.post("/auth/register", data);
      return res.data;
    },
  });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = RegisterSchema.safeParse(form);

    if (!result.success) {
      const errorMessage = result.error.issues?.[0]?.message || "Validation error";
      setError(errorMessage);
      return;
    }

    try {
      let profile: any = {};

      if (form.role === "patient") {
        profile = {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          dateOfBirth: form.dateOfBirth,
          bloodType: form.bloodType,
          allergies: form.commonAllergies,
        };
      }

      if (form.role === "doctor" || form.role === "nurse") {
        profile = {
          name: form.name,
          hospital: form.hospital,
          specialization: form.specialization,
        };
      }

      if (form.role === "lab") {
        profile = {
          labName: form.labName,
          hospital: form.hospital,
        };
      }

      if (form.role === "pharmacy") {
        profile = {
          pharmacyName: form.pharmacyName,
        };
      }

      await registerMutation.mutateAsync({
        email: form.email,
        password: form.password,
        role: form.role,
        profile,
      });

      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      setAuth(loginRes.data.token, loginRes.data.user.role);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  /* ================= UI ================= */
  return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-card p-10 rounded-xl shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Alafia Logo" className="w-20 h-20 rounded-lg" />
          </div>
  
          <h2 className="text-3xl font-semibold text-center text-foreground mb-6">
            Create Account
          </h2>
  
          {/* STEP 1: ROLE */}
          {!selectedRole && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    onClick={() => {
                      setSelectedRole(r.value);
                      handleChange("role", r.value);
                    }}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg hover:scale-105 transition ${roleStyles[r.value]}`}
                  >
                    <Icon size={28} />
                    <span className="mt-2 text-sm">{r.label}</span>
                  </button>
                );
              })}
            </div>
          )}
  
          {/* STEP 2: FORM */}
          {selectedRole && (
            <div className="animate-fade-in">
              <button onClick={resetRole} className="text-primary mb-4 text-sm">
                ← Change role
              </button>
  
              {error && (
                <p className="text-destructive text-sm mb-4 text-center">
                  {error}
                </p>
              )}
  
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm mb-1 text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
  
                {/* ================= PATIENT ================= */}
                {form.role === "patient" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-foreground">First Name</label>
                        <input
                          type="text"
                          placeholder="First Name"
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) =>
                            handleChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
  
                      <div>
                        <label className="block text-sm mb-1 text-foreground">Last Name</label>
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) =>
                            handleChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
  
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-foreground">Phone Number</label>
                        <input
                          type="text"
                          placeholder="Phone Number"
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) =>
                            handleChange("phoneNumber", e.target.value)
                          }
                          required
                        />
                      </div>
  
                      <div>
                        <label className="block text-sm mb-1 text-foreground">Date of Birth</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) =>
                            handleChange("dateOfBirth", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
  
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-foreground">Blood Group</label>
                        <select
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) => handleChange("bloodType", e.target.value)}
                        >
                          <option value="">Blood Group</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                          <option>O+</option>
                          <option>O-</option>
                        </select>
                      </div>
  
                      <div>
                        <label className="block text-sm mb-1 text-foreground">Allergies</label>
                        <select
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) => handleChange("allergies", e.target.value)}
                        >
                          <option value="">Do you have allergies?</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>
  
                    {form.allergies === "Yes" && (
                      <div>
                        <label className="block text-sm mb-1 text-foreground">Common Allergies</label>
                        <select
                          className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                          onChange={(e) => handleChange("commonAllergies", e.target.value)}
                        >
                          <option value="">Select Common Allergy</option>
                          <option>Peanuts</option>
                          <option>Shellfish</option>
                          <option>Pollen</option>
                          <option>Dust</option>
                          <option>Dairy</option>
                        </select>
                      </div>
                    )}
  
                    <div>
                      <label className="block text-sm mb-1 text-foreground">Disability (optional)</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                        onChange={(e) => handleChange("disability", e.target.value)}
                      >
                        <option value="">Do you have a disability?</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </>
                )}
  
                {/* ================= DOCTOR ================= */}
                {form.role === "doctor" && (
                  <>
                    <label className="block text-sm mb-1 text-foreground">
                      Doctor Name
                    </label>
                    <input
                      placeholder="Doctor Name"
                      className="input"
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                    <label className="block text-sm mb-1 text-foreground">
                      Hospital Name
                    </label>
                    <input
                      placeholder="Hospital Name"
                      className="input"
                      onChange={(e) => handleChange("hospital", e.target.value)}
                      required
                    />
                    <label className="block text-sm mb-1 text-foreground">
                      Specialization
                    </label>
                    <input
                      placeholder="Specialization (ENT, General...)"
                      className="input"
                      onChange={(e) =>
                        handleChange("specialization", e.target.value)
                      }
                    />
                  </>
                )}
  
                {/* ================= NURSE ================= */}
                {form.role === "nurse" && (
                  <>
                    <label className="block text-sm mb-1 text-foreground">
                      Nurse Name
                    </label>
                    <input
                      placeholder="Nurse Name"
                      className="input"
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                    <label className="block text-sm mb-1 text-foreground">
                      Hospital Name
                    </label>
                    <input
                      placeholder="Hospital Name"
                      className="input"
                      onChange={(e) => handleChange("hospital", e.target.value)}
                      required
                    />
                    <label className="block text-sm mb-1 text-foreground">
                      Department / Ward
                    </label>
                    <input
                      placeholder="Department / Ward"
                      className="input"
                      onChange={(e) =>
                        handleChange("specialization", e.target.value)
                      }
                    />
                  </>
                )}
  
                {/* ================= LAB ================= */}
                {form.role === "lab" && (
                  <>
                    <label className="block text-sm mb-1 text-foreground">
                      Lab Name
                    </label>
                    <input
                      placeholder="Lab Name"
                      className="input"
                      onChange={(e) => handleChange("labName", e.target.value)}
                      required
                    />
                    <label className="block text-sm mb-1 text-foreground">
                      Hospital Name (optional)
                    </label>
                    <input
                      placeholder="Hospital Name"
                      className="input"
                      onChange={(e) => handleChange("hospital", e.target.value)}
                    />
                  </>
                )}
  
                {/* ================= PHARMACY ================= */}
                {form.role === "pharmacy" && (
                  <>
                    <label className="block text-sm mb-1 text-foreground">
                      Pharmacy Name
                    </label>
                    <input
                      placeholder="Pharmacy Name"
                      className="input"
                      onChange={(e) =>
                        handleChange("pharmacyName", e.target.value)
                      }
                      required
                    />
                    <label className="block text-sm mb-1 text-foreground">
                      Hospital Name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Hospital (optional)"
                      className="input"
                      onChange={(e) => handleChange("hospital", e.target.value)}
                    />
                  </>
                )}
  
                {/* ================= PASSWORD ================= */}
                <div className="relative">
                  <label className="block text-sm mb-1 text-foreground">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </span>
                </div>
  
                <div className="relative">
                  <label className="block text-sm mb-1 text-foreground">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:ring-2 focus:ring-primary"
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </span>
                </div>
  
                {/* Submit */}
                
                <button
  type="submit"
  disabled={registerMutation.isPending}
  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
>
  {registerMutation.isPending ? "Registering..." : "Register"}
</button>
                
              </form>
            </div>
          )}
  
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Register;
