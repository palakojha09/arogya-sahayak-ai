export default function BillBreakdown({ onUpload, loading, error, result, demoMode }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Upload Hospital Bill</h2>
          <p className="mt-2 text-slate-300">
            Upload a bill image or PDF for a clear breakdown of charges and a simple explanation.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-950/90 px-4 py-3 text-slate-300">
          Backend: <span className="font-semibold text-cyan-300">/analyze-bill</span>
        </div>
      </div>

      <label className="block rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-5 text-center text-slate-300 transition hover:border-cyan-400">
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => event.target.files?.[0] && onUpload(event.target.files[0])}
        />
        <div className="text-lg font-medium">Select bill image or PDF</div>
        <div className="mt-2 text-sm text-slate-400">Image or PDF supported for bill analysis.</div>
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          {loading ? "Analyzing bill..." : "Select Bill"}
        </button>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>

      {demoMode && (
        <div className="mt-6 rounded-3xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100">
          Demo mode active: showing sample bill breakdown because backend service is unavailable.
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-3xl bg-slate-950/90 p-6">
          <h3 className="text-xl font-semibold text-white">Bill Breakdown</h3>
          <p className="mt-4 text-slate-300">{result.simple_explanation}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {result.categories?.map((item, index) => (
              <div key={index} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.amount}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Estimated total</p>
            <p className="mt-2 text-2xl font-semibold text-white">{result.total}</p>
          </div>
        </div>
      )}
    </section>
  );
}
