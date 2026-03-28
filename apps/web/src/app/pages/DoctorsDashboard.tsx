import React, { useEffect, useState } from "react";
import {
  Activity,
  FlaskConical,
  Pill,
  ClipboardList,
  Clock,
  AlertCircle,
} from "lucide-react";
import logo from "../img/logo4.png";
import API from "../api/axios"; // axios instance

export function DoctorDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState({ code: "", notes: "" });
  const [prescription, setPrescription] = useState({ name: "", dosage: "", frequency: "" });
  const [labOrder, setLabOrder] = useState({ test: "", notes: "" });

  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/doctor/patients"); // 🔹 Backend route
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients", err);
      }
    };
    fetchPatients();
  }, []);

  const handleAddDiagnosis = async () => {
    if (!selectedPatient) return;
    try {
      await API.post(`/doctor/patients/${selectedPatient.id}/diagnosis`, diagnosis);
      alert("Diagnosis saved!");
      setDiagnosis({ code: "", notes: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssuePrescription = async () => {
    if (!selectedPatient) return;
    try {
      await API.post(`/doctor/patients/${selectedPatient.id}/prescriptions`, prescription);
      alert("Prescription issued!");
      setPrescription({ name: "", dosage: "", frequency: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLabOrder = async () => {
    if (!selectedPatient) return;
    try {
      await API.post(`/doctor/patients/${selectedPatient.id}/lab-orders`, labOrder);
      alert("Lab order created!");
      setLabOrder({ test: "", notes: "" });
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
              <img src={logo} alt="Alafia Logo" className="w-30 h-30 rounded-md object-cover" />
            </div>
            <span className="text-2xl font-semibold text-foreground">Alafia</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Doctor</h1>
                <p className="text-sm text-muted-foreground">
                  Clinical assessments, prescriptions, and lab orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PATIENT ACCESS */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Assigned Patients</h2>
        <div className="space-y-3">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`w-full text-left p-4 rounded-lg border transition 
              ${selectedPatient?.id === p.id ? "border-primary bg-primary/5" : "border-border bg-muted hover:bg-muted/80"}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{p.name}</span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  Access Granted
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* NO PATIENT SELECTED */}
      {!selectedPatient && (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Select a patient to view and update records</p>
        </div>
      )}

      {/* PATIENT DETAILS */}
      {selectedPatient && (
        <>
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diagnoses</p>
                <p className="text-2xl font-semibold text-foreground">4</p>
              </div>
              <ClipboardList className="text-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
                <p className="text-2xl font-semibold text-foreground">2</p>
              </div>
              <Pill className="text-secondary" />
            </div>
            <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lab Orders</p>
                <p className="text-2xl font-semibold text-foreground">1</p>
              </div>
              <FlaskConical className="text-accent" />
            </div>
          </div>

          {/* CLINICAL ACTIONS */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Diagnosis */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Add Diagnosis</h3>
              <input
                placeholder="ICD-10 Code"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary"
                value={diagnosis.code}
                onChange={(e) => setDiagnosis({ ...diagnosis, code: e.target.value })}
              />
              <textarea
                placeholder="Diagnosis notes..."
                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary"
                value={diagnosis.notes}
                onChange={(e) => setDiagnosis({ ...diagnosis, notes: e.target.value })}
              />
              <button
                onClick={handleAddDiagnosis}
                className="w-full py-2 bg-primary text-white rounded-lg"
              >
                Save Diagnosis
              </button>
            </div>

            {/* Prescription */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Prescription</h3>
              <input
                placeholder="Drug name"
                className="input"
                value={prescription.name}
                onChange={(e) => setPrescription({ ...prescription, name: e.target.value })}
              />
              <input
                placeholder="Dosage"
                className="input"
                value={prescription.dosage}
                onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
              />
              <input
                placeholder="Frequency"
                className="input"
                value={prescription.frequency}
                onChange={(e) => setPrescription({ ...prescription, frequency: e.target.value })}
              />
              <button
                onClick={handleIssuePrescription}
                className="w-full py-2 bg-primary text-white rounded-lg"
              >
                Issue Prescription
              </button>
            </div>

            {/* Lab Order */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Lab Order</h3>
              <input
                placeholder="Test type"
                className="input"
                value={labOrder.test}
                onChange={(e) => setLabOrder({ ...labOrder, test: e.target.value })}
              />
              <textarea
                placeholder="Clinical notes..."
                className="input"
                value={labOrder.notes}
                onChange={(e) => setLabOrder({ ...labOrder, notes: e.target.value })}
              />
              <button
                onClick={handleLabOrder}
                className="w-full py-2 bg-primary text-white rounded-lg"
              >
                Order Test
              </button>
            </div>
          </div>

          {/* LIVE UPDATES */}
          <div className="bg-card border border-border rounded-xl p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Live Updates</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Activity className="text-accent" />
                <p className="text-sm text-foreground">New vitals uploaded (BP: 120/80)</p>
                <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Just now
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}