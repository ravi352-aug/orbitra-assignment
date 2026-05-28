const PageLoader = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/90 px-8 py-10 text-center shadow-2xl shadow-black/20">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-300 animate-spin" />
          <div className="relative text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">A.I.</div>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Loading application data</p>
          <p className="mt-2 text-sm text-slate-400">Hang tight while the dashboard refreshes.</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
