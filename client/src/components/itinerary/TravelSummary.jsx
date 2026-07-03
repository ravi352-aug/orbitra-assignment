import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  Hash,
  MapPin,
  Plane,
  Timer,
  Train,
  User,
  MapPinIcon,
  Users,
  DoorOpen,
  Phone,
  Mail,
} from "lucide-react";

// Document-type specific field configuration
const getFieldsForDocumentType = (documentType, data) => {
  const common = [
    { key: "documentType", label: "Document Type", Icon: MapPin },
    { key: "source", label: "From", Icon: MapPin },
    { key: "destination", label: "To", Icon: MapPin },
    { key: "travelDate", label: "Travel Date", Icon: CalendarDays },
  ];

  // Hotel-specific fields
  if (documentType === "Hotel") {
    return [
      { key: "hotel", label: "Hotel Name", Icon: Building2 },
      { key: "hotelAddress", label: "Address", Icon: MapPin },
      { key: "hotelCity", label: "City", Icon: MapPinIcon },
      { key: "hotelCountry", label: "Country", Icon: MapPinIcon },
      { key: "checkInDate", label: "Check-in", Icon: CalendarDays },
      { key: "checkOutDate", label: "Check-out", Icon: CalendarDays },
      { key: "roomType", label: "Room Type", Icon: DoorOpen },
      { key: "numberOfGuests", label: "Guests", Icon: Users },
      { key: "numberOfAdults", label: "Adults", Icon: Users },
      { key: "numberOfChildren", label: "Children", Icon: Users },
      { key: "guestName", label: "Guest Name", Icon: User },
      { key: "bookingReference", label: "Booking Ref", Icon: Hash },
      { key: "contactPhone", label: "Contact", Icon: Phone },
    ];
  }

  // Flight-specific fields
  if (documentType === "Flight") {
    return [
      { key: "airline", label: "Airline", Icon: Plane },
      { key: "flightNumber", label: "Flight Number", Icon: Plane },
      { key: "source", label: "Departure", Icon: MapPin },
      { key: "destination", label: "Arrival", Icon: MapPin },
      { key: "departureTime", label: "Departure Time", Icon: Timer },
      { key: "arrivalTime", label: "Arrival Time", Icon: Timer },
      { key: "terminal", label: "Terminal", Icon: Building2 },
      { key: "gate", label: "Gate", Icon: DoorOpen },
      { key: "seatNumber", label: "Seat", Icon: Hash },
      { key: "passengerName", label: "Passenger", Icon: User },
      { key: "pnr", label: "PNR", Icon: Hash },
    ];
  }

  // Train-specific fields
  if (documentType === "Train") {
    return [
      { key: "trainName", label: "Train Name", Icon: Train },
      { key: "trainNumber", label: "Train Number", Icon: Train },
      { key: "source", label: "From Station", Icon: MapPin },
      { key: "destination", label: "To Station", Icon: MapPin },
      { key: "departureTime", label: "Departure", Icon: Timer },
      { key: "arrivalTime", label: "Arrival", Icon: Timer },
      { key: "platform", label: "Platform", Icon: DoorOpen },
      { key: "trainCoach", label: "Coach", Icon: Train },
      { key: "passengerName", label: "Passenger", Icon: User },
      { key: "pnr", label: "PNR", Icon: Hash },
    ];
  }

  // Bus-specific fields
  if (documentType === "Bus") {
    return [
      { key: "busOperator", label: "Operator", Icon: Building2 },
      { key: "boardingPoint", label: "Boarding", Icon: MapPin },
      { key: "dropPoint", label: "Drop Point", Icon: MapPin },
      { key: "departureTime", label: "Departure", Icon: Timer },
      { key: "arrivalTime", label: "Arrival", Icon: Timer },
      { key: "passengerName", label: "Passenger", Icon: User },
    ];
  }

  return common;
};

const TravelSummary = ({ details }) => {
  const data = details || {};
  const documentType = data.documentType || data.transportType;

  // Get document-type specific fields
  const documentSpecificFields = getFieldsForDocumentType(documentType, data);

  // Filter fields that have values
  const fields = documentSpecificFields.filter(
    ({ key }) => data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== ""
  );

  // If no specific fields found, use default fields
  const defaultFields = [
    { key: "transportType", label: "Type", Icon: MapPin },
    { key: "source", label: "From", Icon: MapPin },
    { key: "destination", label: "To", Icon: MapPin },
    { key: "travelDate", label: "Date", Icon: CalendarDays },
  ];

  const displayFields = fields.length ? fields : defaultFields;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="mb-5">
        <h3 className="text-base font-bold text-white">Travel summary</h3>
        <p className="text-xs text-slate-500">Details extracted from the uploaded document</p>
        {documentType && (
          <p className="mt-2 inline-block rounded-lg bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
            {documentType} Document
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {displayFields.map(({ key, label, Icon }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {label}
            </p>
            <p className="mt-1 break-words text-sm font-bold text-white">
              {String(data[key] || "—")}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TravelSummary;
