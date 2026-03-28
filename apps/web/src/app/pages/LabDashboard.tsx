import {
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../img/logo4.png";
import API from "../api/axios";

type LabOrder = {
  id: number;
  patient: string;
  test: string;
  doctor: string;
  reference: string;
  urgency: string;
  status: string;
};

export function LabDashboard() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [status, setStatus] = useState("");
  const [resultText, setResultText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // ✅ FETCH LAB ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/lab/orders");
        setLabOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch lab orders");
      }
    };

    fetchOrders();
  }, []);

  // ✅ UPDATE SAMPLE STATUS
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;

    try {
      await API.put(`/lab/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });

      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  // ✅ SUBMIT RESULT
  const handleSubmitResult = async () => {
    if (!selectedOrder) return;

    try {
      const formData = new FormData();
      formData.append("summary", resultText);
      if (file) formData.append("file", file);

      await API.post(`/lab/orders/${selectedOrder.id}/results`, formData);

      alert("Result submitted successfully");
      setResultText("");
      setFile(null);
    } catch (err) {
      console.error("Failed to submit result");
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
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-secondary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Laboratory
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage lab tests and results
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Incoming Orders</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {labOrders.length}
            </p>
          </div>
          <Clock className="text-secondary" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {labOrders.filter((o) => o.status === "processing").length}
            </p>
          </div>
          <FlaskConical className="text-accent" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {labOrders.filter((o) => o.status === "complete").length}
            </p>
          </div>
          <CheckCircle2 className="text-primary" />
        </div>
      </div>

      {/* LAB ORDER LIST */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Incoming Lab Orders
        </h2>

        <div className="space-y-3">
          {labOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`w-full text-left p-4 rounded-lg border transition
              ${
                selectedOrder?.id === order.id
                  ? "border-secondary bg-secondary/5"
                  : "border-border bg-muted hover:bg-muted/80"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-foreground">
                    {order.patient}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {order.test}
                  </p>
                </div>

                <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                  {order.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!selectedOrder && (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Select a lab order to process
          </p>
        </div>
      )}

      {selectedOrder && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Lab Order Details
          </h2>

          <div className="space-y-2 text-sm">
            <p>Patient: {selectedOrder.patient}</p>
            <p>Test: {selectedOrder.test}</p>
            <p>Doctor: {selectedOrder.doctor}</p>
          </div>

          {/* STATUS */}
          <div className="flex gap-2 flex-wrap">
            {["Collected", "Processing", "Complete"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusUpdate(s)}
                className={`px-3 py-1 rounded text-sm
                ${
                  status === s
                    ? "bg-secondary/20 text-secondary"
                    : "bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* RESULT */}
          <textarea
            value={resultText}
            onChange={(e) => setResultText(e.target.value)}
            placeholder="Enter result summary..."
            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-secondary"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={handleSubmitResult}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
          >
            <FileText className="w-4 h-4" />
            Submit Result
          </button>
        </div>
      )}
    </div>
  );
}