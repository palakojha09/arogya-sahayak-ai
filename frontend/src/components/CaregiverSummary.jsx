export default function CaregiverSummary({ summary }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
      <h3 className="text-2xl font-semibold text-white">Caregiver Summary</h3>
      <p className="mt-4 text-slate-300">{summary}</p>
    </section>
  );
}
