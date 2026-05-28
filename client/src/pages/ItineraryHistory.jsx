import { useEffect, useMemo, useState } from "react";
import { itineraryService } from "../services/itineraryService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ItineraryHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [transportFilter, setTransportFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const load = async () => {
    setLoading(true);
    try {
      const res = await itineraryService.getHistory();
      setItems(res.itineraries || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const transports = useMemo(() => {
    const setT = new Set();
    items.forEach((it) => {
      if (it.transportType) setT.add(it.transportType);
    });
    return Array.from(setT);
  }, [items]);

  const filtered = useMemo(() => {
    let list = items.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (it) =>
          (it.destination || "").toLowerCase().includes(q) ||
          (it.title || "").toLowerCase().includes(q),
      );
    }
    if (transportFilter) {
      list = list.filter((it) => (it.transportType || "") === transportFilter);
    }
    if (startDate) {
      const s = new Date(startDate);
      list = list.filter((it) => new Date(it.createdAt) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((it) => new Date(it.createdAt) <= e);
    }
    list.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? ta - tb : tb - ta;
    });
    return list;
  }, [items, query, transportFilter, startDate, endDate, sortOrder]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this itinerary?")) return;
    try {
      await itineraryService.deleteItinerary(id);
      toast.success("Itinerary deleted");
      setItems((s) => s.filter((it) => it._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-white">My Itineraries</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              placeholder="Search by destination or title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
            />
            <select
              value={transportFilter}
              onChange={(e) => setTransportFilter(e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200"
            >
              <option value="">All transports</option>
              {transports.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200" />
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200">
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-6 rounded-2xl bg-white/[0.02]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/[0.02] text-slate-400">No itineraries found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((it) => (
              <div key={it._id} className="rounded-2xl border border-white/10 p-4 bg-white/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{it.title || 'Untitled'}</h3>
                    <p className="text-xs text-slate-400 mt-1">{it.destination || '—'} • {it.travelDate || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/itinerary/${it._id}`} className="text-sm px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-200">View</Link>
                    <button onClick={() => handleDelete(it._id)} className="text-sm px-3 py-2 rounded-xl bg-red-500/10 text-red-300">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ItineraryHistory;
