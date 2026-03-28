import {
  Pill,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "../api/axios";

// ✅ TYPES
type Prescription = {
  id: number;
  patient: string;
  drug: string;
  doctor: string;
  hospital: string;
  status: string;
  verified: boolean;
};

export function PharmacyDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<Prescription | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH PRESCRIPTIONS
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/pharmacy/prescriptions");
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // ✅ ACTIONS (BACKEND ROUTES)

  const confirmStock = async () => {
    if (!selectedOrder) return;

    await API.post(`/pharmacy/prescriptions/${selectedOrder.id}/confirm-stock`);
    fetchPrescriptions();
  };

  const confirmPayment = async () => {
    if (!selectedOrder) return;

    await API.post(`/pharmacy/prescriptions/${selectedOrder.id}/confirm-payment`);
    fetchPrescriptions();
  };

  const markDispensed = async () => {
    if (!selectedOrder) return;

    await API.post(`/pharmacy/prescriptions/${selectedOrder.id}/dispense`);
    fetchPrescriptions();
  };

  const updateDeliveryStatus = async (status: string) => {
    if (!selectedOrder) return;

    setSelectedStatus(status);

    await API.patch(`/pharmacy/prescriptions/${selectedOrder.id}/delivery`, {
      status,
    });

    fetchPrescriptions();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Pharmacy Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage prescriptions and deliveries
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-lg">
          Pharmacy
        </span>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Incoming Orders</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {prescriptions.length}
            </p>
          </div>
          <Clock className="text-primary" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Processed</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {prescriptions.filter(p => p.status === "processed").length}
            </p>
          </div>
          <CheckCircle2 className="text-secondary" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Delivered</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {prescriptions.filter(p => p.status === "delivered").length}
            </p>
          </div>
          <Truck className="text-accent" />
        </div>
      </div>

      {/* PRESCRIPTION QUEUE */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Incoming Prescriptions
        </h2>

        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

        <div className="space-y-3">
          {prescriptions.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedOrder(p)}
              className={`w-full text-left p-4 rounded-lg border transition
                ${
                  selectedOrder?.id === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-foreground">{p.patient}</h3>
                  <p className="text-sm text-muted-foreground">{p.drug}</p>
                </div>

                <div className="flex items-center gap-2">
                  {p.verified ? (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">
                      Unverified
                    </span>
                  )}

                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {p.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* NO ORDER SELECTED */}
      {!selectedOrder && (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Select a prescription to process
          </p>
        </div>
      )}

      {/* ORDER DETAILS */}
      {selectedOrder && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">

          <h2 className="text-xl font-semibold text-foreground">
            Prescription Details
          </h2>

          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Patient:</span> {selectedOrder.patient}</p>
            <p><span className="text-muted-foreground">Drug:</span> {selectedOrder.drug}</p>
            <p><span className="text-muted-foreground">Doctor:</span> {selectedOrder.doctor}</p>
            <p><span className="text-muted-foreground">Hospital:</span> {selectedOrder.hospital}</p>
          </div>

          {/* ACTIONS */}
          <div className="grid md:grid-cols-3 gap-4">
            <button onClick={confirmStock} className="bg-primary text-white px-4 py-2 rounded">
              Confirm Stock
            </button>

            <button onClick={confirmPayment} className="bg-primary text-white px-4 py-2 rounded">
              Confirm Payment
            </button>

            <button onClick={markDispensed} className="bg-primary text-white px-4 py-2 rounded">
              Mark as Dispensed
            </button>
          </div>

          {/* DELIVERY STATUS */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Delivery Status</h3>

            <div className="flex gap-2 flex-wrap">
              {["Pending", "Packed", "Dispatched", "Delivered"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateDeliveryStatus(status)}
                  className={`px-3 py-1 rounded text-sm
                    ${
                      selectedStatus === status
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-foreground"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}