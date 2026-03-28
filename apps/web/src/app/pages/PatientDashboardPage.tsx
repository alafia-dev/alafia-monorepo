import React, { useEffect, useState } from "react";
import {
  Activity,
  Pill,
  FlaskConical,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../img/logo4.png";
import API from "../api/axios"; // axios instance with baseURL

export function PatientDashboard() {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activePrescriptions, setActivePrescriptions] = useState<any[]>([]);
  const [latestLabResults, setLatestLabResults] = useState<any[]>([]);
  const [accessPermissions, setAccessPermissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, prescRes, labRes, permRes] = await Promise.all([
          API.get("/patient/activity"),
          API.get("/patient/prescriptions"),
          API.get("/patient/lab-results"),
          API.get("/patient/permissions"),
        ]);

        setRecentActivity(activityRes.data);
        setActivePrescriptions(prescRes.data);
        setLatestLabResults(labRes.data);
        setAccessPermissions(permRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Patient
              </h1>
              <p className="text-sm text-muted-foreground">
                View your health records and prescriptions
              </p>
            </div>
          </div>

          <span className="px-3 py-1 text-xs bg-accent/10 text-accent rounded-lg">
            Patient
          </span>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Prescriptions</p>
              <p className="text-3xl font-semibold text-foreground mt-1">
                {activePrescriptions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lab Tests</p>
              <p className="text-3xl font-semibold text-foreground mt-1">
                {latestLabResults.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recent Visits</p>
              <p className="text-3xl font-semibold text-foreground mt-1">
                {recentActivity.filter((a) => a.type === "visit").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Permissions</p>
              <p className="text-3xl font-semibold text-foreground mt-1">
                {accessPermissions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Health Timeline */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <Link to="/dashboard/health-records" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  {activity.type === "visit" && <Calendar className="w-5 h-5 text-primary" />}
                  {activity.type === "prescription" && <Pill className="w-5 h-5 text-secondary" />}
                  {activity.type === "lab" && <FlaskConical className="w-5 h-5 text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.doctor}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{activity.date}</span>
                    <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Active Prescriptions</h2>
            <Link to="/dashboard/prescriptions" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {activePrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{prescription.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{prescription.dosage}</p>
                    <p className="text-sm text-muted-foreground">Dr. {prescription.doctor}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{prescription.refills} refills remaining</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}