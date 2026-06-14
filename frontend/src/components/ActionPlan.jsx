function PlanCard({ icon, title, items, tone }) {
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-lg shadow-slate-950/20 ${tone}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl">{icon}</span>
        <h4 className="text-lg font-bold text-white">{title}</h4>
      </div>
      <ul className="mt-5 space-y-3">
        {(items || []).map((item, index) => (
          <li key={`${title}-${index}`} className="flex gap-3 rounded-2xl bg-slate-950/35 p-3 text-sm leading-6 text-slate-200">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-cyan-300/15 text-center text-xs font-bold text-cyan-100">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ActionPlan({ plan, language }) {
  const hasPlan = plan?.reminders?.length || plan?.caregiver_actions?.length || plan?.next_steps?.length;

  if (!hasPlan) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-xl shadow-slate-950/20 backdrop-blur-xl">
        <h3 className="text-2xl font-bold text-white">
          {language === "Hindi"
            ? "कार्य योजना"
            : "Action Plan"}
        </h3>
        <p className="mt-3 text-slate-300">
          {language === "Hindi"
            ? "प्रिस्क्रिप्शन विश्लेषण के बाद कार्य योजना बनाएं।"
            : "Generate an action plan after prescription analysis."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:p-7">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">
          {language === "Hindi"
            ? "देखभाल मार्गदर्शन"
            : "Care Guidance"}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">Action Plan</h3>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <PlanCard
          icon="⏰"
          title={language === "Hindi" ? "अनुस्मारक" : "Reminders"}
          items={plan.reminders}
          tone="border-cyan-300/15 bg-cyan-300/10"
        />
        <PlanCard
          icon="👨‍👩‍👧"
          title={language === "Hindi"
            ? "देखभालकर्ता कार्य"
            : "Caregiver Actions"}
          items={plan.caregiver_actions}
          tone="border-blue-300/15 bg-blue-400/10"
        />
        <PlanCard
          icon="✅"
          title={language === "Hindi"
            ? "अगले कदम"
            : "Next Steps"}
          items={plan.next_steps}
          tone="border-emerald-300/15 bg-emerald-400/10"
        />
      </div>
    </section>
  );
}
