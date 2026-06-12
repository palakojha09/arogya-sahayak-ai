export default function LoadingSpinner({ message = "Loading...", compact = false }) {
  return (
    <div className={`flex items-center justify-center ${compact ? "py-5" : "py-8"}`}>
      <div className="w-full max-w-md rounded-[1.5rem] border border-cyan-300/10 bg-white/[0.04] p-5 text-center shadow-xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 ring-1 ring-cyan-300/20">
          <svg
            className="h-8 w-8 animate-spin text-cyan-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
        <p className="mt-4 text-base font-semibold text-white">{message}</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" />
        </div>
      </div>
    </div>
  );
}
