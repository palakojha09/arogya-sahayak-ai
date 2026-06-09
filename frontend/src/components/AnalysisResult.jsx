export default function AnalysisResult({ result }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
      <h3 className="text-2xl font-semibold text-white">Prescription Summary</h3>
      <p className="mt-4 text-slate-300">{result.simple_explanation}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950/90 p-6">
          <h4 className="text-lg font-semibold text-white">Patient Summary</h4>
          <p className="mt-3 text-slate-300">{result.patient_summary}</p>
        </div>

        <div className="rounded-3xl bg-slate-950/90 p-6">
          <h4 className="text-lg font-semibold text-white">Dosage Schedule</h4>
          <p className="mt-3 text-slate-300">{result.dosage_schedule}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950/90 p-6">
        <h4 className="text-lg font-semibold text-white">Medicine List</h4>
        <div className="mt-4 space-y-4">
          {result.medicines?.map((medicine, index) => (
            <div key={index} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
              <p className="font-semibold text-slate-100">{medicine.name}</p>
              <p className="mt-1 text-slate-300">{medicine.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950/90 p-6">
        <h4 className="text-lg font-semibold text-white">Precautions</h4>
        <p className="mt-3 text-slate-300">{result.precautions}</p>
      </div>
    </section>
  );
}
