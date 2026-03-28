import {
  Users,
  Activity,
  HeartPulse,
  Thermometer,
  Weight,
  Droplets,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "../api/axios";
import logo from "../img/logo4.png";

// ✅ TYPES
type Patient = {
  id: number;
  name: string;
};

type Vitals = {
  weight: string;
  bloodPressure: string;
  temperature: string;
  heartRate: string;
  spo2: string;
};

export function NurseDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const [vitals, setVitals] = useState<Vitals>({
    weight: "",
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    spo2: "",
  });

  // ✅ FETCH PATIENTS
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await API.get("/nurse/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (field: keyof Vitals, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ SUBMIT VITALS
  const handleSubmit = async () => {
    if (!selectedPatient) return;

    try {
      await API.post(`/nurse/patients/${selectedPatient.id}/vitals`, vitals);

      // reset form after submit
      setVitals({
        weight: "",
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        spo2: "",
      });

      alert("Vitals recorded successfully");
    } catch (err) {
      console.error("Failed to save vitals");
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
              <Users className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Nurse
              </h1>
              <p className="text-sm text-muted-foreground">
                Record patient vitals and drug administration in real-time
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Patients Assigned</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {patients.length}
            </p>
          </div>
          <Users className="text-primary" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Vitals Recorded Today
            </p>
            <p className="text-3xl font-semibold text-foreground mt-1">--</p>
          </div>
          <Activity className="text-accent" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending Patients</p>
            <p className="text-3xl font-semibold text-foreground mt-1">--</p>
          </div>
          <HeartPulse className="text-secondary" />
        </div>
      </div>

      {/* PATIENT LIST */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Assigned Patients
        </h2>

        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

        <div className="space-y-3">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`w-full text-left p-4 rounded-lg border transition
                ${
                  selectedPatient?.id === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">
                  {p.name}
                </span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  Assigned
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {!selectedPatient && (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-muted-foreground">
            Select a patient to record vitals
          </p>
        </div>
      )}

      {/* VITALS FORM */}
      {selectedPatient && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Record Vitals — {selectedPatient.name}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <label className="text-sm flex items-center gap-2">
                <Weight className="w-4 h-4" /> Weight (kg)
              </label>
              <input
                value={vitals.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <label className="text-sm flex items-center gap-2">
                <Droplets className="w-4 h-4" /> Blood Pressure
              </label>
              <input
                value={vitals.bloodPressure}
                onChange={(e) => handleChange("bloodPressure", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <label className="text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" /> Temperature
              </label>
              <input
                value={vitals.temperature}
                onChange={(e) => handleChange("temperature", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <label className="text-sm flex items-center gap-2">
                <HeartPulse className="w-4 h-4" /> Heart Rate
              </label>
              <input
                value={vitals.heartRate}
                onChange={(e) => handleChange("heartRate", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2 md:col-span-2">
              <label className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> SpO₂ (%)
              </label>
              <input
                value={vitals.spo2}
                onChange={(e) => handleChange("spo2", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Save Vitals
          </button>
        </div>
      )}
    </div>
  );
}