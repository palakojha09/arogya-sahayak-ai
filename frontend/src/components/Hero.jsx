const badges = ["Prescription AI", "Bill Breakdown", "Caregiver Plan", "Multilingual Support"];

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">ArogyaSahayak AI</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            ArogyaSahayak AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            AI assistant for prescriptions, hospital bills, and caregiver guidance.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-950/20"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-sm text-slate-400">Care confidence</span>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
              Live AI
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {["Prescription clarity", "Cost transparency", "Caregiver readiness"].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item}</span>
                  <span className="text-cyan-200">{92 - index * 7}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
                    style={{ width: `${92 - index * 7}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
