export default function LanguageSelector({ language, onChange }) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4 shadow-lg shadow-slate-950/20">
      <label className="mb-2 block text-sm font-medium text-slate-300">Select language</label>
      <select
        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
        value={language}
        onChange={(event) => onChange(event.target.value)}
      >
        <option>English</option>
        <option>Hindi</option>
        <option>Kannada</option>
        <option>Telugu</option>
      </select>
    </div>
  );
}
