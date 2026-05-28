import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TrendChart = ({ title, description, data = [], dataKey, labelKey }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className="h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
            <XAxis dataKey={labelKey} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 16, color: "#e2e8f0" }} />
            <Area type="monotone" dataKey={dataKey} stroke="#38bdf8" fillOpacity={1} fill="url(#trendGradient)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
