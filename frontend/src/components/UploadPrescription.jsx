import { useRef, useState } from "react";

export default function UploadPrescription({
  onUpload,
  loading,
  error,
  demoMode,
  onUseDemo,
  t,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedFile || loading) return;
    onUpload(selectedFile);
  };

  return (
    <section className="rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-2xl ring-1 ring-cyan-300/20">
            🧾
          </div>
          <h2 className="text-2xl font-bold text-white">
            Upload Prescription
          </h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-300">
            {t.uploadDescription || 
            "Upload a prescription image to get a patient-friendly summary, medicine list, dosage schedule, and caregiver guidance."}
          </p>
        </div>
        {demoMode && (
          <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-100">
            Demo data
          </span>
        )}
      </div>

      <form onSubmit={submit} className="space-y-5">
        <label className="group block cursor-pointer rounded-[1.5rem] border border-dashed border-cyan-300/25 bg-slate-950/55 p-6 text-center text-slate-300 shadow-inner shadow-slate-950/30 transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-300/5">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          />
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl ring-1 ring-cyan-300/20 transition group-hover:bg-cyan-400/15">
            +
          </span>
          <span className="mt-4 block text-lg font-semibold text-white">{t.selectImage || "Select prescription image"}</span>
          <span className="mt-2 block text-sm text-slate-400">{t.imageFormats || "JPG, PNG, or other photo formats accepted."}</span>
          {selectedFile && (
            <span className="mt-4 inline-flex max-w-full rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
              <span className="truncate">{selectedFile.name}</span>
            </span>
          )}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-800/90 px-5 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={() => fileInput.current?.click()}
          >
            {t.chooseFile || "Choose File"}
          </button>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || !selectedFile}
          >
            {loading
              ? (t.readingPrescription || "Reading prescription...")
              : t.analyzePrescription}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-rose-100">
            <p className="font-semibold">{t.analysisUnavailable || "Prescription analysis unavailable"}</p>
            <p className="mt-1 text-sm text-rose-100/85">{error}</p>
            {onUseDemo && (
              <button
                type="button"
                className="mt-3 rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                onClick={onUseDemo}
              >
                {t.useDemo || "Use Demo Data"}
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
