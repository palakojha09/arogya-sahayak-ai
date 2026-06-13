const detailValue = (value) => value || "";

function InsightCard({ title, value, accent = "cyan" }) {
  const accentClass = accent === "amber" ? "border-amber-300/25 bg-amber-400/10" : "border-cyan-300/15 bg-cyan-300/10";

  return (
    <div className={`rounded-[1.5rem] border ${accentClass} p-5 shadow-lg shadow-slate-950/20`}>
      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{title}</h4>
      <p className="mt-3 leading-7 text-slate-100">{value || "Not clearly detected."}</p>
    </div>
  );
}

export default function AnalysisResult({ result, language }) {

  const t = {

  prescriptionSummary:

    language === "Hindi" ? "प्रिस्क्रिप्शन सारांश" : "Prescription Summary",

  analysisReady:
    language === "Hindi" ? "विश्लेषण तैयार" : "Analysis ready",

  patientSummary:
    language === "Hindi" ? "रोगी सारांश" : "Patient Summary",

  dosageSchedule:
    language === "Hindi" ? "दवा अनुसूची" : "Dosage Schedule",

  medicineList:
    language === "Hindi" ? "दवाओं की सूची" : "Medicine List",

  precautions:
    language === "Hindi" ? "सावधानियां" : "Precautions",

  dose:
    language === "Hindi" ? "खुराक" : "Dose",

  timing:
    language === "Hindi" ? "समय" : "Timing",

  purpose:
    language === "Hindi" ? "उद्देश्य" : "Purpose",

  noMedicine:
    language === "Hindi"
      ? "कोई दवा स्पष्ट रूप से नहीं मिली।"
      : "No individual medicines were clearly detected.",

  notDetected:
    language === "Hindi"
      ? "स्पष्ट रूप से पता नहीं चला।"
      : "Not clearly detected.",

      };

      const medicines = result.medicines || [];


  return (
    <section className="rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Prescription AI</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {t.prescriptionSummary}
          </h3>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-100">
          {t.analysisReady}
        </span>
      </div>

      {result.simple_explanation && (
        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5 text-lg leading-8 text-slate-200">
          {result.simple_explanation}
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <InsightCard title={t.patientSummary} value={result.patient_summary} />
        <InsightCard title={t.dosageSchedule} value={result.dosage_schedule} />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
        <h4 className="text-lg font-bold text-white">
          {t.medicineList}
        </h4>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {medicines.length > 0 ? (
            medicines.map((medicine, index) => (
              <div
                key={`${medicine.name || "medicine"}-${index}`}
                className="rounded-2xl border border-cyan-300/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <p className="text-lg font-bold text-white">💊 {detailValue(medicine.name)}</p>
                <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <p>
                    <span className="block text-slate-500">{t.dose}</span>
                    <span className="font-semibold text-slate-100">{detailValue(medicine.dose || medicine.dosage)}</span>
                  </p>
                  <p>
                    <span className="block text-slate-500">{t.timing}</span>
                    <span className="font-semibold text-slate-100">{detailValue(medicine.timing || medicine.frequency)}</span>
                  </p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  <span className="font-semibold text-cyan-100">
                    {t.purpose}:
                  </span>
                  {detailValue(medicine.purpose)}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-slate-300">
              {t.noMedicine}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <InsightCard title={t.precautions} value={result.precautions} accent="amber" />
      </div>
    </section>
  );
}
