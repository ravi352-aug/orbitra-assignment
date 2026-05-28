import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { itineraryService } from "../services/itineraryService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import TravelSummary from "../components/itinerary/TravelSummary";
import DayTimeline from "../components/itinerary/DayTimeline";
import ShareTripCard from "../components/itinerary/ShareTripCard";
import ExtractionDetails from "../components/itinerary/ExtractionDetails";
import toast from "react-hot-toast";
import CopyLinkButton from "../components/shared/CopyLinkButton";

const ItineraryDetails = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await itineraryService.getItinerary(id);
        setItinerary(res.itinerary || res);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <DashboardLayout><div className="p-6">Loading...</div></DashboardLayout>;

  if (!itinerary) return <DashboardLayout><div className="p-6">Itinerary not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{itinerary.title}</h2>
              <div className="ml-3 flex items-center gap-2">
                <CopyLinkButton shareId={itinerary.shareId} disabled={!itinerary.shareId} />
                <button
                  onClick={async () => {
                    try {
                      const res = await itineraryService.toggleShareTrip(itinerary._id);
                      setItinerary((current) => ({
                        ...current,
                        isShared: res.isShared,
                      }));
                      toast.success('Share state updated');
                    } catch (err) {
                      toast.error(err.message || 'Unable to toggle share');
                    }
                  }}
                  className="rounded-2xl bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white hover:bg-white/[0.09]"
                >
                  {itinerary.shareId ? 'Disable Sharing' : 'Make Public'}
                </button>
              </div>
            </div>
            <TravelSummary details={{ ...itinerary }} />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-bold text-white mb-2">Full itinerary</h3>
              <DayTimeline itineraryText={itinerary.itinerary} />
            </div>
            <ExtractionDetails extractedText={itinerary.extractedText || ''} />
          </div>
          <div className="space-y-4">
            <ShareTripCard shareId={itinerary.shareId} />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h4 className="font-bold text-white mb-2">AI Generated Text</h4>
              <pre className="whitespace-pre-wrap text-sm text-slate-300 max-h-64 overflow-auto">{itinerary.itinerary}</pre>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ItineraryDetails;
