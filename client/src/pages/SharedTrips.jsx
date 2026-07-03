import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { itineraryService } from "../services/itineraryService";
import SharedTripCard from "../components/shared/SharedTripCard";
import SharedTripSkeleton from "../components/shared/SharedTripSkeleton";
import EmptySharedState from "../components/shared/EmptySharedState";

const SharedTrips = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await itineraryService.getSharedTrips();
      const list = res.itineraries || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Failed to load shared trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this shared itinerary?")) return;
    try {
      await itineraryService.deleteItinerary(id);
      setItems((s) => s.filter((it) => it._id !== id));
    } catch (err) {
      alert(err.message || "Unable to delete");
    }
  };

  const handleToggle = (updated) => {
    setItems((s) => s.map((it) => (it._id === updated._id ? updated : it)));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Shared trips</h2>
            <p className="text-xs text-slate-400 mt-1">
              Trips you&apos;ve made public for sharing
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SharedTripSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptySharedState onRefresh={load} />
        ) : (
          <motion.div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {items.map((it) => (
              <SharedTripCard
                key={it._id}
                itinerary={it}
                onDelete={() => handleDelete(it._id)}
                onToggled={handleToggle}
              />
            ))}
          </motion.div>
        )}

        {error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default SharedTrips;

