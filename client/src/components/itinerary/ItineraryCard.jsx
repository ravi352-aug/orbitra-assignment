import { motion } from "framer-motion";
import { Calendar, Coffee, Hotel, MapPinned, Sparkles } from "lucide-react";

const splitList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildDays = (details) => {
  if (Array.isArray(details?.days)) return details.days;
  if (Array.isArray(details?.itinerary)) return details.itinerary;

  const destination = details?.destination || "your destination";
  const hotel = details?.hotel || null;
  const timings = details?.timings || null;
  const suggestions = splitList(details?.suggestions);

  return [
    {
      day: "Day 1",
      title: `Arrive in ${destination}`,
      activities: [
        `Travel from ${details?.source || "your source"} to ${destination}`,
        `Check in at ${hotel}`,
        `Confirm local transfers around ${timings}`,
      ],
      hotel,
      suggestions: suggestions.length ? suggestions : ["Keep documents handy", "Take a light evening walk"],
    },
    {
      day: "Day 2",
      title: `Explore ${destination}`,
      activities: [
        "Start with a relaxed breakfast",
        "Visit key attractions near your stay",
        "Reserve time for local food and shopping",
      ],
      hotel,
      suggestions: ["Carry a power bank", "Keep buffer time between activities"],
    },
  ];
};

const ItineraryCard = ({ details }) => {
  const days = buildDays(details);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Generated itinerary</h3>
          <p className="text-xs text-slate-500">Day-wise plan built from extracted travel details</p>
        </div>
        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-200">
          {days.length} days
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {days.map((day, index) => {
          const activities = splitList(day.activities || day.plan || day.description);
          const suggestions = splitList(day.suggestions);

          return (
            <motion.article
              key={day.day || day.title || index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 backdrop-blur-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative mb-5 flex items-start justify-between">
                <div>
                  <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                    <Calendar className="h-3.5 w-3.5" />
                    {day.day || `Day ${index + 1}`}
                  </p>
                  <h4 className="text-lg font-black text-white">
                    {day.title || day.destination || "Travel plan"}
                  </h4>
                </div>
                <MapPinned className="h-5 w-5 text-violet-300" />
              </div>

              <div className="relative space-y-3">
                {activities.map((activity, activityIndex) => (
                  <div key={activity} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-cyan-200">
                      {activityIndex + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-300">{activity}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Hotel className="h-4 w-4" />
                    Stay
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {day.hotel || details?.hotel || "No stay details available"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Coffee className="h-4 w-4" />
                    Suggestions
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {suggestions[0] || "Explore nearby cafes and landmarks"}
                  </p>
                </div>
              </div>

              {suggestions.length > 1 ? (
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {suggestions.slice(1).map((suggestion) => (
                    <span
                      key={suggestion}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300"
                    >
                      <Sparkles className="h-3 w-3 text-violet-300" />
                      {suggestion}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default ItineraryCard;
