const ToggleSwitch = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {label ? <p className="text-sm font-semibold text-white">{label}</p> : null}
        {description ? <p className="text-xs text-slate-400 mt-1">{description}</p> : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          checked
            ? "relative h-6 w-11 rounded-full bg-cyan-400/20 ring-1 ring-cyan-300/40 transition"
            : "relative h-6 w-11 rounded-full bg-white/[0.06] ring-1 ring-white/10 transition"
        }
      >
        <span
          className={
            checked
              ? "absolute left-6 top-1 h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 shadow"
              : "absolute left-1 top-1 h-4 w-4 rounded-full bg-white/20"
          }
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;

