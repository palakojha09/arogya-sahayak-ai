import { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

function BillCard({ icon, title, children, emphasis = false }) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 shadow-lg shadow-slate-950/20 ${
        emphasis ? "border-cyan-300/20 bg-cyan-300/10" : "border-white/10 bg-slate-950/45"
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-xl">{icon}</span>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ChargeItem({ item, fallback }) {
  const title = typeof item === "string" ? item : item.label || item.description || item.name || fallback;
  const amount = typeof item === "string" ? null : item.amount;
  const note = typeof item === "string" ? null : item.note || item.reason;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-100">{title}</p>
        {amount && <p className="shrink-0 font-bold text-cyan-100">{amount}</p>}
      </div>
      {note && <p className="mt-2 text-sm leading-6 text-slate-400">{note}</p>}
    </div>
  );
}

export default function BillBreakdown({ onUpload, loading, error, result, demoMode, onUseDemo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);
  const breakdownItems = result?.breakdown ?? result?.charges ?? result?.categories;
  const summaryText = result?.bill_summary ?? result?.summary ?? result?.simple_explanation;

  return (
    <section className="rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-300/10 text-2xl ring-1 ring-blue-300/20">
            🏥
          </div>
          <h2 className="text-2xl font-bold text-white">Upload Hospital Bill</h2>
          <p className="mt-2 leading-7 text-slate-300">
            Upload a bill image or PDF for a clear breakdown of charges and a simple explanation.
          </p>
        </div>
        {demoMode && (
          <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-100">
            Demo data
          </span>
        )}
      </div>

      <label className="group block cursor-pointer rounded-[1.5rem] border border-dashed border-blue-300/25 bg-slate-950/55 p-6 text-center text-slate-300 shadow-inner shadow-slate-950/30 transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-300/5">
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
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/10 text-3xl ring-1 ring-blue-300/20 transition group-hover:bg-blue-400/15">
          +
        </span>
        <div className="mt-4 text-lg font-semibold text-white">Select bill image or PDF</div>
        <div className="mt-2 text-sm text-slate-400">Image or PDF supported for bill analysis.</div>
        {selectedFile && (
          <span className="mt-4 inline-flex max-w-full rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-sm font-medium text-blue-100">
            <span className="truncate">{selectedFile.name}</span>
          </span>
        )}
      </label>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-800/90 px-5 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          onClick={() => fileInput.current?.click()}
        >
          Choose File
        </button>
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!selectedFile || loading}
          onClick={() => selectedFile && onUpload(selectedFile)}
        >
          {loading ? "Analyzing hospital bill..." : "Analyze Bill"}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-rose-100">
          <p className="font-semibold">AI bill analysis is temporarily unavailable. Please try again later.</p>
          <p className="mt-1 text-sm text-rose-100/80">You can retry the upload or use the demo sample for presentation mode.</p>
          {onUseDemo && (
            <button
              type="button"
              className="mt-3 rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
              onClick={onUseDemo}
            >
              Use Demo Data
            </button>
          )}
        </div>
      )}

      {loading && <LoadingSpinner message="Analyzing hospital bill..." compact />}

      {result && (
        <div className="mt-8 space-y-5">
          <BillCard icon="💰" title="Total Amount" emphasis>
            <p className="text-3xl font-bold text-white">{result.total_amount ?? result.total ?? "Not clearly detected"}</p>
          </BillCard>

          {summaryText && (
            <BillCard icon="📄" title="Bill Summary">
              <p className="leading-7 text-slate-300">{summaryText}</p>
            </BillCard>
          )}

          {breakdownItems?.length > 0 && (
            <BillCard icon="🧾" title="Charge Breakdown">
              <div className="space-y-3">
                {breakdownItems.map((item, index) => (
                  <ChargeItem key={`charge-${index}`} item={item} fallback={`Charge ${index + 1}`} />
                ))}
              </div>
            </BillCard>
          )}

          {result.suspicious_charges?.length > 0 && (
            <BillCard icon="⚠️" title="Suspicious Charges">
              <div className="space-y-3">
                {result.suspicious_charges.map((item, index) => (
                  <ChargeItem key={`suspicious-${index}`} item={item} fallback={`Charge ${index + 1}`} />
                ))}
              </div>
            </BillCard>
          )}

          {result.raw_response && (
            <BillCard icon="📄" title="AI Bill Explanation">
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/75 p-4 text-sm leading-6 text-slate-300">
                {result.raw_response}
              </pre>
            </BillCard>
          )}
        </div>
      )}
    </section>
  );
}
