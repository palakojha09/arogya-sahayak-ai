const API_BASE_URL = "http://localhost:8000";

import { useState } from "react";
import Hero from "./components/Hero.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import UploadPrescription from "./components/UploadPrescription.jsx";
import AnalysisResult from "./components/AnalysisResult.jsx";
import BillBreakdown from "./components/BillBreakdown.jsx";
import CaregiverSummary from "./components/CaregiverSummary.jsx";
import ActionPlan from "./components/ActionPlan.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

const demoPrescription = {
  patient_summary: "Mrs. Sharma is prescribed medicines for blood pressure and digestion.",
  medicines: [
    { name: "Amlodipine", purpose: "Helps lower blood pressure" },
    { name: "Pantoprazole", purpose: "Reduces stomach acidity" }
  ],
  dosage_schedule: "Take Amlodipine once daily in the morning and Pantoprazole once daily before breakfast.",
  precautions: "Do not skip doses. Drink plenty of water and avoid spicy food.",
  simple_explanation: "Your prescription is for blood pressure control and stomach comfort.",
  caregiver_summary: "Help with morning medicine, monitor blood pressure, and ensure the patient eats a light meal.",
  action_plan: {
    reminders: ["Morning medication", "Daily blood pressure check"],
    caregiver_actions: ["Prepare pills before breakfast", "Track any side effects"],
    next_steps: ["Follow up with the doctor in 5 days", "Keep a record of medicine timing"]
  }
};

const demoBill = {
  summary: "This bill shows consultation, medicine, and room charges.",
  categories: [
    { label: "Consultation", amount: "₹600" },
    { label: "Medicines", amount: "₹1,200" },
    { label: "Room Charges", amount: "₹2,300" }
  ],
  total: "₹4,100",
  simple_explanation: "Most of the cost is for room and care. Medicine charges are moderate."
};

function App() {
  const [language, setLanguage] = useState("English");
  const [prescriptionResult, setPrescriptionResult] = useState(null);
  const [billResult, setBillResult] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);
  const [loadingBill, setLoadingBill] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [billError, setBillError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const handleAnalyzePrescription = async (file) => {
    setLoadingPrescription(true);
    setPrescriptionError("");
    setDemoMode(false);
    setPrescriptionResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-prescription`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrescriptionResult(data);
    } catch (error) {
      console.error("Prescription analysis error:", error);
      setPrescriptionError(error.message || "Failed to analyze prescription. Please try again.");
    } finally {
      setLoadingPrescription(false);
    }
  };

  const handleAnalyzeBill = async (file) => {
    setLoadingBill(true);
    setBillError("");
    setDemoMode(false);
    setBillResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-bill`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setBillResult(data);
    } catch (error) {
      console.error("Bill analysis error:", error);
      setBillError(error.message || "Failed to analyze bill. Please try again.");
    } finally {
      setLoadingBill(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <Hero />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-slate-300">
              Use ArogyaSahayak AI to upload prescription and bill documents, then receive clear and patient-friendly guidance with caregiver support.
            </p>
            <LanguageSelector language={language} onChange={setLanguage} />
          </div>
        </header>

        <section className="space-y-8">
          <UploadPrescription
            onUpload={handleAnalyzePrescription}
            loading={loadingPrescription}
            error={prescriptionError}
            demoMode={demoMode}
          />

          {loadingPrescription && <LoadingSpinner />}

          {prescriptionResult && !loadingPrescription && (
            <div className="space-y-6">
              <AnalysisResult result={prescriptionResult} />
              <CaregiverSummary summary={prescriptionResult.caregiver_summary} />
              <ActionPlan plan={prescriptionResult.action_plan} />
            </div>
          )}

          <BillBreakdown
            onUpload={handleAnalyzeBill}
            loading={loadingBill}
            error={billError}
            result={billResult}
            demoMode={demoMode}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
