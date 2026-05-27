const PreferenceSelect = ({ label, value, onChange, options }) => {
  return (
    <div className="space-y-1">
      {label ? <p className="text-xs font-semibold text-slate-300">{label}</p> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-950">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PreferenceSelect;

