import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const palette = ["#38bdf8", "#818cf8", "#34d399", "#f472b6", "#fbbf24", "#22c55e"];

const TransportDistributionChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
        Transport distribution will appear after you generate itineraries.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Transport distribution</h3>
          <p className="text-xs text-slate-500">What transport types your trips use most.</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="transportType" outerRadius={92} innerRadius={42} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.transportType}`} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, "Trips"]} />
            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ color: "#cbd5e1" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransportDistributionChart;
