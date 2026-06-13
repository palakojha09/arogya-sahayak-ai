const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

import { useState } from "react";
import Hero from "./components/Hero.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import UploadPrescription from "./components/UploadPrescription.jsx";
import AnalysisResult from "./components/AnalysisResult.jsx";
import BillBreakdown from "./components/BillBreakdown.jsx";
import CaregiverSummary from "./components/CaregiverSummary.jsx";
import ActionPlan from "./components/ActionPlan.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import translations from "./translations";

const demoPrescription = {
  patient_summary: "Mrs. Sharma is prescribed medicines for blood pressure and digestion.",
  medicines: [
    { name: "Amlodipine", dose: "5 mg", timing: "Morning", purpose: "Helps lower blood pressure" },
    { name: "Pantoprazole", dose: "40 mg", timing: "Before breakfast", purpose: "Reduces stomach acidity" },
  ],
  dosage_schedule: "Take Amlodipine once daily in the morning and Pantoprazole once daily before breakfast.",
  precautions: "Do not skip doses. Drink plenty of water and avoid spicy food.",
  simple_explanation: "Your prescription is for blood pressure control and stomach comfort.",
  caregiver_summary: "Help with morning medicine, monitor blood pressure, and ensure the patient eats a light meal.",
  action_plan: {
    reminders: ["Morning medication", "Daily blood pressure check"],
    caregiver_actions: ["Prepare pills before breakfast", "Track any side effects"],
    next_steps: ["Follow up with the doctor in 5 days", "Keep a record of medicine timing"],
  },
};

const demoBill = {
  summary: "This bill shows consultation, medicine, and room charges.",
  categories: [
    { label: "Consultation", amount: "Rs. 600" },
    { label: "Medicines", amount: "Rs. 1,200" },
    { label: "Room Charges", amount: "Rs. 2,300" },
  ],
  total: "Rs. 4,100",
  simple_explanation: "Most of the cost is for room and care. Medicine charges are moderate.",
};

function App() {
  const [language, setLanguage] = useState("English");
  const t = translations[language] || translations.English;
  const [prescriptionResult, setPrescriptionResult] = useState(null);
  const [billResult, setBillResult] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);
  const [loadingBill, setLoadingBill] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [billError, setBillError] = useState("");
  const [actionPlan, setActionPlan] = useState(null);
  const [actionPlanLoading, setActionPlanLoading] = useState(false);
  const [actionPlanError, setActionPlanError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const handleAnalyzePrescription = async (file) => {
    setLoadingPrescription(true);
    setPrescriptionError("");
    setDemoMode(false);
    setPrescriptionResult(null);
    setActionPlan(null);
    setActionPlanError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-prescription`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrescriptionResult(data);
    } catch (error) {
      console.error("Prescription analysis error:", error);
      setPrescriptionError("AI prescription analysis is temporarily unavailable. Please try again later.");
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
    formData.append("language", language);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-bill`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Bill analysis response:", data);
      setBillResult(data);
    } catch (error) {
      console.error("Bill analysis error:", error);
      setBillError("AI bill analysis is temporarily unavailable. Please try again later.");
    } finally {
      setLoadingBill(false);
    }
  };

  const handleGenerateActionPlan = async () => {
    if (!prescriptionResult) return;

    setActionPlanLoading(true);
    setActionPlanError("");
    setActionPlan(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-action-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescription_analysis: prescriptionResult }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setActionPlan(data);
    } catch (error) {
      console.error("Action plan generation error:", error);
      setActionPlanError("AI care plan generation is temporarily unavailable. Please try again later.");
    } finally {
      setActionPlanLoading(false);
    }
  };

  const handleUseDemoPrescription = () => {
    setPrescriptionResult(demoPrescription);
    setDemoMode(true);
    setPrescriptionError("");
  };

  const handleUseDemoBill = () => {
    setBillResult(demoBill);
    setDemoMode(true);
    setBillError("");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(59,130,246,0.18),transparent_24%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8">
          <Hero />
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              {[
                  language === "Hindi" ? "अपलोड" : "Upload",
                  language === "Hindi" ? "एआई विश्लेषण" : "AI Analysis",
                  language === "Hindi" ? "देखभाल मार्गदर्शन" : "Care Guidance",
                ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 shadow-lg shadow-slate-950/20"
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-bold text-cyan-200">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
            <LanguageSelector language={language} onChange={setLanguage} />
          </div>
        </header>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <div className="space-y-8">
            <UploadPrescription
              onUpload={handleAnalyzePrescription}
              loading={loadingPrescription}
              error={prescriptionError}
              demoMode={demoMode}
              onUseDemo={handleUseDemoPrescription}
            />

            {loadingPrescription && <LoadingSpinner message="Extracting medicines..." />}

            {prescriptionResult && !loadingPrescription && (
              <div className="space-y-6">
                <AnalysisResult
                  result={prescriptionResult}
                  language={language}
                />

                <div className="rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">
                        {language === "Hindi" ? "देखभाल प्रक्रिया" : "Care workflow"}
                      </p>
                      <p className="mt-2 text-slate-300">
                        {language === "Hindi"
                          ? "इस प्रिस्क्रिप्शन विश्लेषण से एक कार्य योजना बनाएं।"
                          : "Generate a custom action plan from this prescription analysis."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateActionPlan}
                      disabled={actionPlanLoading}
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionPlanLoading
                        ? (language === "Hindi"
                          ? "कार्य योजना बनाई जा रही है..."
                          : "Generating care plan...")
                        : (language === "Hindi"
                          ? "कार्य योजना बनाएं"
                          : "Generate Action Plan")}
                    </button>
                  </div>

                  {actionPlanLoading && <LoadingSpinner message="Generating care plan..." compact />}

                  {actionPlanError && (
                    <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                      {actionPlanError}
                    </div>
                  )}
                </div>

                <CaregiverSummary
                  summary={prescriptionResult.caregiver_summary}
                  language={language}
                />
                <ActionPlan
                  plan={actionPlan}
                  language={language}
                />
              </div>
            )}
          </div>

          <div className="space-y-8">
            <BillBreakdown
              onUpload={handleAnalyzeBill}
              loading={loadingBill}
              error={billError}
              result={billResult}
              demoMode={demoMode}
              onUseDemo={handleUseDemoBill}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

