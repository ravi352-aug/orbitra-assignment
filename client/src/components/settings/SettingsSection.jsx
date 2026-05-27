const SettingsSection = ({ title, subtitle, children }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-400 mt-1">{subtitle}</p> : null}
        </div>
      </div>
      <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6">{children}</div>
    </section>
  );
};

export default SettingsSection;

