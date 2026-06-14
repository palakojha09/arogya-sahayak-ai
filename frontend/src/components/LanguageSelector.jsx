export default function LanguageSelector({ language, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-3 shadow-lg shadow-slate-950/20">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {language === "Hindi"
          ? "भाषा"
          : language === "Telugu"
          ? "భాష"
          : "Language"}
      </label>
      <select
        className="w-full min-w-48 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
        value={language}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
        <option value="Telugu">Telugu</option>
      </select>
    </div>
  );
}
