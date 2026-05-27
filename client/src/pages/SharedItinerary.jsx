import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { itineraryService } from "../services/itineraryService";
import DayTimeline from "../components/itinerary/DayTimeline";
import TravelSummary from "../components/itinerary/TravelSummary";
import toast from "react-hot-toast";

const SharedItinerary = () => {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await itineraryService.getSharedItinerary(shareId);
        setItinerary(res.itinerary || res);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!itinerary) return <div className="min-h-screen flex items-center justify-center">Shared itinerary not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061428] to-[#0a0f1e] py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="text-2xl font-bold text-white">{itinerary.title}</h1>
          <p className="text-sm text-slate-400 mt-1">Shared travel itinerary</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <TravelSummary details={itinerary} />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <DayTimeline itineraryText={itinerary.itinerary} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h4 className="font-bold text-white mb-2">About this trip</h4>
              <p className="text-sm text-slate-300">This itinerary was generated using AI based on travel documents uploaded by the owner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedItinerary;
