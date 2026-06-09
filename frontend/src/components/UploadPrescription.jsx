import { useRef, useState } from "react";

export default function UploadPrescription({ onUpload, loading, error, demoMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    onUpload(selectedFile);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Upload Prescription</h2>
          <p className="mt-2 text-slate-300">
            Upload a prescription image and get a patient-friendly summary, medicine list, dosage schedule, and caregiver guidance.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-950/90 px-4 py-3 text-slate-300">
          Backend: <span className="font-semibold text-cyan-300">/analyze-prescription</span>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label className="block rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-5 text-center text-slate-300 transition hover:border-cyan-400">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          />
          <span className="block text-lg font-medium">Select prescription image</span>
          <span className="mt-2 block text-sm text-slate-400">
            JPG, PNG, or other photo formats accepted.
          </span>
          {selectedFile && (
            <p className="mt-3 text-sm text-slate-200">Selected: {selectedFile.name}</p>
          )}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Prescription"}
          </button>
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </div>

        {demoMode && (
          <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100">
            Demo mode active: the app is showing example output because backend is unavailable.
          </div>
        )}
      </form>
    </section>
  );
}
