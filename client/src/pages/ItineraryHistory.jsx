import { useEffect, useState } from "react";
import { itineraryService } from "../services/itineraryService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ItineraryHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Itineraries</h2>
        </div>

        {loading ? (
          <div className="p-6 rounded-2xl bg-white/[0.02]">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/[0.02] text-slate-400">No itineraries yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((it) => (
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
