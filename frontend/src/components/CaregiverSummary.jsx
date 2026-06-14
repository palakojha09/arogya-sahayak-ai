export default function CaregiverSummary({ summary, language }) {
  if (!summary) return null;

  return (
    <section className="rounded-[2rem] border border-emerald-300/15 bg-emerald-400/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
          👨‍👩‍👧
        </span>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-100">
            {language === "Hindi" ? "महत्वपूर्ण" : "{language === "Hindi" ? "महत्वपूर्ण" : "Important"}"
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            {language === "Hindi"
              ? "देखभालकर्ता सारांश"
              : "Caregiver Summary"}
          </h3>
          <p className="mt-4 leading-8 text-emerald-50/90">{summary}</p>
        </div>
      </div>
    </section>
  );
}
