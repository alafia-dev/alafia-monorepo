import {
  Users,
  FileText,
  CreditCard,
  Shield,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import API from "../api/axios";
import logo from "../img/logo4.png";

type Staff = {
  id: number;
  name: string;
  role: string;
  status: string;
};

type Onboarding = {
  id: number;
  name: string;
  status: string;
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("staff");

  const [staff, setStaff] = useState<Staff[]>([]);
  const [onboarding, setOnboarding] = useState<Onboarding[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 🔹 FETCH DATA
  // =========================
  useEffect(() => {
    fetchStaff();
    fetchOnboarding();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/staff"); // ✅ BACKEND ROUTE
      setStaff(res.data);
    } catch (err: any) {
      setError("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const fetchOnboarding = async () => {
    try {
      const res = await API.get("/admin/onboarding"); // ✅ BACKEND ROUTE
      setOnboarding(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🔹 ACTIONS
  // =========================

  const addStaff = async () => {
    try {
      await API.post("/admin/staff", {
        name: "New Staff",
        role: "Doctor",
      }); // ✅ BACKEND ROUTE

      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const invitePatient = async () => {
    try {
      await API.post("/admin/onboarding/invite", {
        email: "patient@email.com",
      }); // ✅ BACKEND ROUTE

      fetchOnboarding();
    } catch (err) {
      console.error(err);
    }
  };

  const exportReport = async () => {
    try {
      await API.get("/admin/compliance/export"); // ✅ BACKEND ROUTE
      alert("Report exported");
    } catch (err) {
      console.error(err);
    }
  };

  const downloadInvoice = async () => {
    try {
      await API.get("/billing/invoice"); // ✅ BACKEND ROUTE
      alert("Invoice downloaded");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="bg-card shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <img
                src={logo}
                alt="Alafia Logo"
                className="w-30 h-30 rounded-md object-cover"
              />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              Alafia
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage staff, billing, and compliance
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {staff.length}
            </p>
          </div>
          <Users className="text-primary" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Patients</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {onboarding.length}
            </p>
          </div>
          <UserPlus className="text-secondary" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Records Synced</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              1,240
            </p>
          </div>
          <FileText className="text-accent" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Billing Status</p>
            <p className="text-lg font-semibold text-green-600 mt-1">
              Active
            </p>
          </div>
          <CreditCard className="text-green-600" />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {["staff", "billing", "compliance", "settings", "onboarding"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          )
        )}
      </div>

      {/* CONTENT */}
      <div className="bg-card border border-border rounded-xl p-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* STAFF */}
        {activeTab === "staff" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Staff Management
            </h2>

            <div className="space-y-3">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.role}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      s.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={addStaff}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Add Staff
            </button>
          </div>
        )}

        {/* BILLING */}
        {activeTab === "billing" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Usage & Billing
            </h2>

            <button
              onClick={downloadInvoice}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Download Invoice
            </button>
          </div>
        )}

        {/* COMPLIANCE */}
        {activeTab === "compliance" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Compliance & Audit
            </h2>

            <button
              onClick={exportReport}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Export Report
            </button>
          </div>
        )}

        {/* ONBOARDING */}
        {activeTab === "onboarding" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Patient Onboarding
            </h2>

            <div className="space-y-3">
              {onboarding.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-4 bg-muted rounded-lg"
                >
                  <p>{p.name}</p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      p.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={invitePatient}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Invite Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}