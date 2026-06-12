import { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function BillBreakdown({ onUpload, loading, error, result, demoMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);
  const breakdownItems = result?.breakdown ?? result?.charges;
  const summaryText = result?.bill_summary ?? result?.simple_explanation;

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
          ref={fileInput}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setSelectedFile(file);
          }}
        />
        <div className="text-lg font-medium">Select bill image or PDF</div>
        <div className="mt-2 text-sm text-slate-400">Image or PDF supported for bill analysis.</div>
        {selectedFile && (
          <p className="mt-3 text-sm text-slate-200">Selected: {selectedFile.name}</p>
        )}
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={() => fileInput.current?.click()}
        >
          Select Bill
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-3xl bg-slate-800 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!selectedFile || loading}
          onClick={() => selectedFile && onUpload(selectedFile)}
        >
          {loading ? "Analyzing hospital bill..." : "Analyze Bill"}
        </button>
        {error && (
          <div className="mt-3 rounded-2xl border border-rose-700 bg-rose-900/10 px-4 py-3 text-rose-200">
            <p className="font-semibold">Bill analysis failed</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner message={"Analyzing bill..."} />}

      {demoMode && (
        <div className="mt-6 rounded-3xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100">
          Demo mode active: showing sample bill breakdown because backend service is unavailable.
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-3xl bg-slate-950/90 p-6">
          <h3 className="text-xl font-semibold text-white">Bill Breakdown</h3>

          {summaryText && (
            <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Bill Summary</p>
              <p className="mt-2 text-slate-300">{summaryText}</p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Total Amount</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {result.total_amount ?? result.total ?? "Not clearly detected"}
              </p>
            </div>

            {breakdownItems?.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Charge Breakdown</p>
                <div className="mt-4 space-y-4">
                  {breakdownItems.map((item, index) => {
                    const title = typeof item === "string"
                      ? item
                      : item.label || item.description || item.name || `Charge ${index + 1}`;
                    const amount = typeof item === "string" ? null : item.amount;
                    const note = typeof item === "string" ? null : item.note;

                    return (
                      <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                        <p className="font-semibold text-slate-100">{title}</p>
                        {amount && <p className="mt-1 text-slate-300">{amount}</p>}
                        {note && <p className="mt-1 text-sm text-slate-400">{note}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {result.suspicious_charges?.length > 0 && (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h4 className="text-lg font-semibold text-white">Suspicious Charges</h4>
              <div className="mt-4 space-y-4 text-slate-300">
                {result.suspicious_charges.map((item, index) => {
                  const title = typeof item === "string"
                    ? item
                    : item.label || item.description || item.name || `Charge ${index + 1}`;
                  const amount = typeof item === "string" ? null : item.amount;
                  const reason = typeof item === "string" ? null : item.reason;

                  return (
                    <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="font-semibold text-slate-100">{title}</p>
                      {amount && <p className="mt-1 text-slate-300">{amount}</p>}
                      {reason && <p className="mt-1 text-sm text-slate-400">{reason}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result.categories?.length > 0 && (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h4 className="text-lg font-semibold text-white">Legacy Category Breakdown</h4>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {result.categories.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.raw_response && (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
              <h4 className="text-lg font-semibold text-white">AI Bill Explanation</h4>
              <pre className="mt-4 whitespace-pre-wrap rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-sm text-slate-300">
                {result.raw_response}
              </pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
