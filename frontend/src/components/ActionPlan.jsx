export default function ActionPlan({ plan }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
      <h3 className="text-2xl font-semibold text-white">Action Plan</h3>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-950/90 p-6">
          <h4 className="text-lg font-semibold text-white">Reminders</h4>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
            {plan?.reminders?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-slate-950/90 p-6">
          <h4 className="text-lg font-semibold text-white">Caregiver Actions</h4>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
            {plan?.caregiver_actions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-slate-950/90 p-6">
          <h4 className="text-lg font-semibold text-white">Next Steps</h4>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
            {plan?.next_steps?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
