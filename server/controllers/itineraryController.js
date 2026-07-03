const mongoose = require("mongoose");
const Upload = require("../models/Upload");
const Itinerary = require("../models/Itinerary");

const { v4: uuidv4 } = require("uuid");

const { extractTextFromFile } = require("../services/extractionService");

const { generateContent } = require("../services/geminiService");

// example function

const parseGeminiJson = (raw) => {
  if (!raw) return null;

  try {
    const cleaned = String(raw)
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    try {
      const match = String(raw).match(/\{[\s\S]*\}/);

      if (!match) return null;

      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

// Improved fallback extraction with document-type specific logic
const fallbackExtraction = (text = "") => {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  const upper = clean.toUpperCase();
  
  // Extract all times
  const times = clean.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g) || [];
  
  // Extract dates (multiple formats)
  const datePatterns = [
    /\b\d{1,2}[-/ ][A-Za-z]{3,9}[-/ ]\d{2,4}\b/,
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/,
    /\b[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}\b/,
  ];
  const dates = datePatterns.map(p => clean.match(p)?.[0]).filter(Boolean);

  // Document type detection
  const documentType = /HOTEL|ACCOMMODATION|CHECK-?IN|CHECK-?OUT|ROOM|GUEST|STAY/i.test(clean)
    ? "Hotel"
    : /TRAIN|RAIL|IRCTC|PLATFORM|COACH/i.test(clean)
      ? "Train"
      : /FLIGHT|AIRLINE|BOARDING|AIRPORT|GATE|TERMINAL|PNR/i.test(clean)
        ? "Flight"
        : /BUS|COACH|OPERATOR|BOARDING POINT/i.test(clean)
          ? "Bus"
          : /CRUISE/i.test(clean)
            ? "Cruise"
            : /AIRBNB/i.test(clean)
              ? "Airbnb"
              : "Travel";

  // Common fields
  const result = {
    documentType,
    transportType: documentType,
    source: null,
    destination: null,
    city: null,
    country: null,
    travelDate: dates[0] || null,
    departureTime: times[0] || null,
    arrivalTime: times[1] || null,
    passengerName: null,
    guestName: null,
    numberOfGuests: null,
    pnr: null,
    bookingReference: null,
    airline: null,
    hotel: null,
    hotelAddress: null,
    roomType: null,
    checkInDate: null,
    checkOutDate: null,
    trainNumber: null,
    trainName: null,
  };

  // Extract source/destination
  const sourceMatch = clean.match(/\bFrom\s+([A-Z][A-Z\s().-]{2,40}?)(?:\s+To\b|\s+\d|\s+Date\b|$)/i);
  if (sourceMatch) result.source = sourceMatch[1].trim();
  
  const destMatch = clean.match(/\bTo\s+([A-Z][A-Z\s().-]{2,40}?)(?:\s+\d|\s+Date\b|\s+From\b|$)/i);
  if (destMatch) result.destination = destMatch[1].trim();

  // Hotel-specific extraction
  if (documentType === "Hotel") {
    // Hotel name
    const hotelMatch = clean.match(/\b(?:Hotel|Property|Accommodation|Resort)\s*:?\s*([A-Z][^,\n]*?)(?:\s*,|$)/i);
    if (hotelMatch) result.hotel = hotelMatch[1].trim();
    
    // Hotel address
    const addressMatch = clean.match(/\b(?:Address|Location)\s*:?\s*([^\n]*?)(?:\n|$)/i);
    if (addressMatch) result.hotelAddress = addressMatch[1].trim();
    
    // Check-in date
    const checkInMatch = clean.match(/\b(?:Check.?in|Arrival)\s*:?\s*(\d{1,2}[-/ ][A-Za-z]{3,9}[-/ ]\d{2,4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    if (checkInMatch) result.checkInDate = checkInMatch[1].trim();
    
    // Check-out date
    const checkOutMatch = clean.match(/\b(?:Check.?out|Departure)\s*:?\s*(\d{1,2}[-/ ][A-Za-z]{3,9}[-/ ]\d{2,4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    if (checkOutMatch) result.checkOutDate = checkOutMatch[1].trim();
    
    // Room type
    const roomMatch = clean.match(/\b(?:Room|Suite)\s*(?:Type|Category)?\s*:?\s*([A-Za-z\s]+?)(?:\n|,|$)/i);
    if (roomMatch) result.roomType = roomMatch[1].trim();
    
    // Guest name
    const guestMatch = clean.match(/\b(?:Guest|Name|Reserved For)\s*:?\s*([A-Z][A-Za-z\s.]{2,50}?)(?:\n|$)/i);
    if (guestMatch) result.guestName = guestMatch[1].trim();
    
    // Number of guests
    const guestsMatch = clean.match(/\b(?:Guests?|Occupancy|Adults?)\s*:?\s*(\d+)/i);
    if (guestsMatch) result.numberOfGuests = parseInt(guestsMatch[1]);
    
    // Booking reference
    const bookingMatch = clean.match(/\b(?:Booking|Confirmation|Reference|Ref)\s*(?:Number|No|ID)?\s*:?\s*([A-Z0-9-]{5,20})\b/i);
    if (bookingMatch) result.bookingReference = bookingMatch[1].trim();
  }

  // Flight-specific extraction
  if (documentType === "Flight") {
    const airlineMatch = clean.match(/\b(AIR INDIA|INDIGO|VISTARA|SPICEJET|AKASA|EMIRATES|QATAR|ETIHAD|LUFTHANSA|BRITISH AIRWAYS)\b/i);
    if (airlineMatch) result.airline = airlineMatch[1].toUpperCase();
    
    const flightMatch = clean.match(/\b(?:Flight|Fl\.?|FLT)\s*(?:No|Number|#)?\s*:?\s*([A-Z]{2}\d{3,4})\b/i);
    if (flightMatch) result.flightNumber = flightMatch[1].toUpperCase();
    
    const pnrMatch = clean.match(/\bPNR(?:\s*(?:NO|NUMBER|#|:|-))?\s*([A-Z0-9]{6})\b/i);
    if (pnrMatch) result.pnr = pnrMatch[1];
    
    const terminalMatch = clean.match(/\b(?:Terminal|Term\.?)\s*:?\s*([A-Z0-9])\b/i);
    if (terminalMatch) result.terminal = terminalMatch[1];
    
    const gateMatch = clean.match(/\b(?:Gate|Gate No\.?|Boarding Gate)\s*:?\s*([A-Z0-9]+)\b/i);
    if (gateMatch) result.gate = gateMatch[1];
  }

  // Train-specific extraction
  if (documentType === "Train") {
    const trainNumMatch = clean.match(/\b(?:Train|TRN)\s*(?:No|Number|#)?\s*:?\s*(\d{4,6})\b/i);
    if (trainNumMatch) result.trainNumber = trainNumMatch[1];
    
    const trainNameMatch = clean.match(/\/\s*([A-Z][A-Za-z\s]+?)(?:\s*\(|$)/i);
    if (trainNameMatch) result.trainName = trainNameMatch[1].trim();
    
    const pnrMatch = clean.match(/\bPNR(?:\s*(?:NO|NUMBER|#|:|-))?\s*([A-Z0-9]{6,10})\b/i);
    if (pnrMatch) result.pnr = pnrMatch[1];
    
    const platformMatch = clean.match(/\b(?:Platform|Plat\.?)\s*:?\s*([A-Z0-9]+)\b/i);
    if (platformMatch) result.platform = platformMatch[1];
  }

  // Bus-specific extraction
  if (documentType === "Bus") {
    const operatorMatch = clean.match(/\b(?:Operator|Service|Bus)\s*:?\s*([A-Z][A-Za-z\s&.]+?)(?:\n|,|$)/i);
    if (operatorMatch) result.busOperator = operatorMatch[1].trim();
  }

  // Common booking reference
  if (!result.bookingReference) {
    const refMatch = clean.match(/\b(?:BOOKING|CONFIRMATION|REFERENCE|REF|BOOKING ID)\s*(?:NO|NUMBER|#)?\s*:?\s*([A-Z0-9-]{5,20})\b/i);
    if (refMatch) result.bookingReference = refMatch[1];
  }

  return result;
};

// Document-type aware itinerary generation
const buildFallbackItinerary = (data = {}) => {
  const documentType = data.documentType || "Travel";

  // Hotel Booking Itinerary
  if (documentType === "Hotel") {
    const hotelName = data.hotel || "your hotel";
    const checkIn = data.checkInDate || "check-in date";
    const checkOut = data.checkOutDate || "check-out date";
    const roomType = data.roomType || "reserved room";
    const guests = data.numberOfGuests || "guests";
    const bookingRef = data.bookingReference || "booking reference";

    return `# Hotel Stay Itinerary

## Arrival Day
- **Check-in**: ${checkIn}
- **Hotel**: ${hotelName}
- **Room**: ${roomType} for ${guests} guests
- **Booking Reference**: ${bookingRef}
- Arrive early if possible to ensure room availability
- Complete check-in formalities and collect room keys
- Store your booking confirmation and room number

## During Your Stay
- Hotel Address: ${data.hotelAddress || "See booking confirmation"}
- Contact Hotel: ${data.contactPhone || "Available on booking confirmation"}
- Review hotel amenities and services available
- Plan daily activities and local attractions
- Arrange meals (breakfast, lunch, dinner)
- Visit nearby shopping and entertainment areas
- Rest and relax at the hotel

## Checkout Day
- **Checkout**: ${checkOut}
- Settle any outstanding payments or room charges
- Return room keys to reception
- Keep your receipt and booking reference for records
- Plan your departure and next destination`;
  }

  // Flight Ticket Itinerary
  if (documentType === "Flight") {
    const airline = data.airline || "airline";
    const flightNum = data.flightNumber || "flight number";
    const departure = data.departureTime || "departure time";
    const arrival = data.arrivalTime || "arrival time";
    const source = data.source || "departure city";
    const destination = data.destination || "destination city";
    const terminal = data.terminal || "terminal";
    const gate = data.gate || "gate";
    const pnr = data.pnr || "booking reference";

    return `# Flight Itinerary

## Pre-Departure
- **Airline**: ${airline}
- **Flight Number**: ${flightNum}
- **Departure**: ${departure} from ${source}
- **Arrival**: ${arrival} at ${destination}
- **PNR/Booking Reference**: ${pnr}
- Reach airport at least 2-3 hours before departure
- Check-in at the airline counter or use online check-in
- Visit security checkpoint with your boarding pass and ID

## At the Airport
- **Terminal**: ${terminal}
- **Gate**: ${gate}
- Monitor flight information display for gate updates
- Proceed to designated gate before boarding
- Keep your boarding pass and travel documents accessible
- Proceed to boarding when your group is called

## In-Flight
- Find your seat and settle in
- Follow cabin crew safety instructions
- Enjoy in-flight meals and services
- Stay hydrated during the flight

## Upon Arrival
- Wait for seatbelt sign to turn off before exiting
- Collect your belongings
- Exit the aircraft and proceed to baggage claim
- Collect checked baggage
- Pass through immigration and customs if international
- Arrange ground transportation to your accommodation`;
  }

  // Train Ticket Itinerary
  if (documentType === "Train") {
    const trainNum = data.trainNumber || "train number";
    const trainName = data.trainName || "train name";
    const departure = data.departureTime || "departure time";
    const arrival = data.arrivalTime || "arrival time";
    const source = data.source || "departure station";
    const destination = data.destination || "destination station";
    const platform = data.platform || "platform";
    const pnr = data.pnr || "booking reference";
    const coach = data.trainCoach || "coach";

    return `# Train Journey Itinerary

## Before Departure
- **Train Number**: ${trainNum} (${trainName})
- **Departure**: ${departure} from ${source}
- **Arrival**: ${arrival} at ${destination}
- **PNR/Booking Reference**: ${pnr}
- **Coach**: ${coach}
- Reach the railway station at least 30 minutes before departure
- Check your platform number on the station display board
- Platform: ${platform}
- Keep your ticket and identity card ready

## Boarding
- Wait for your coach to arrive at the platform
- Find your seat or berth number on your ticket
- Store luggage in designated compartments
- Familiarize yourself with coach layout and facilities

## During Journey
- Settle into your seat/berth
- Collect your belongings and stay alert
- Use washroom facilities (usually available in each coach)
- Visit the dining car or pantry for meals and beverages
- Rest and enjoy the journey
- Keep your ticket and valuables secure

## Upon Arrival
- Keep your belongings together before arrival
- Wait for the train to come to a complete stop
- Exit the train at the designated platform
- Collect your luggage carefully
- Exit the station and arrange onward transportation`;
  }

  // Bus Ticket Itinerary
  if (documentType === "Bus") {
    const operator = data.busOperator || "bus operator";
    const source = data.source || "boarding point";
    const destination = data.destination || "drop point";
    const departure = data.departureTime || "departure time";
    const arrival = data.arrivalTime || "arrival time";

    return `# Bus Journey Itinerary

## Before Journey
- **Bus Operator**: ${operator}
- **Departure**: ${departure} from ${source}
- **Arrival**: ${arrival} at ${destination}
- Reach the boarding point at least 15-30 minutes early
- Locate your boarding point on the terminal map
- Keep your booking confirmation and ticket ready

## At Boarding Point
- Wait in the designated area for your bus
- Watch for bus arrival announcements
- Board when your group is called
- Locate your seat number
- Stow luggage in overhead compartments or luggage area

## During Journey
- Remain seated while bus is in motion
- Follow bus conductor's instructions
- Use restroom facilities at designated stops only
- Enjoy any refreshment services provided
- Keep your belongings secure
- Note stop announcements for your destination

## At Destination
- Collect belongings before exiting
- Exit through designated doors
- Collect checked baggage from luggage compartment
- Verify all items accounted for
- Arrange onward transportation from drop point`;
  }

  // Generic Travel Itinerary (fallback)
  const source = data.source || "your starting point";
  const destination = data.destination || "your destination";
  const travelDate = data.travelDate ? ` on ${data.travelDate}` : "";
  const departureTime = data.departureTime ? ` at ${data.departureTime}` : "";
  const transport = data.transportType || "Travel";
  const reference = data.pnr || data.bookingReference ? ` Reference: ${data.pnr || data.bookingReference}` : "";

  return `# Travel Itinerary

## Departure Day
- **From**: ${source}
- **To**: ${destination}
- **Travel Date**: ${travelDate || "Check your booking"}
- **Departure Time**: ${departureTime || "Check your booking"}
- **Transport Type**: ${transport}${reference}
- Prepare your travel documents and confirmation
- Reach the departure point with sufficient time
- Complete check-in or boarding procedures
- Keep your booking reference and ticket accessible

## During Travel
- Follow all safety instructions provided
- Stay calm and patient throughout the journey
- Use available facilities and services
- Keep your belongings secure
- Monitor travel progress and announcements

## Upon Arrival
- Confirm arrival at ${destination}
- Collect all belongings
- Keep your receipt and travel documents
- Proceed to accommodation or next destination`;
};


// example function

const generateItinerary = async (req, res) => {
  try {
    const { uploadId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(uploadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid upload ID",
      });
    }

    console.log("[generateItinerary] request", {
      uploadId,
      userId: req.user?._id?.toString(),
    });

    // Find upload
    const upload = await Upload.findOne({
      _id: uploadId,
      userId: req.user._id,
    });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      });
    }

    // If an itinerary already exists for this upload, return it instead of creating a duplicate
    const existingItinerary = await Itinerary.findOne({
      uploadId,
      userId: req.user._id,
    });

    if (existingItinerary) {
      console.log("[generateItinerary] existing itinerary", {
        uploadId,
        itineraryId: existingItinerary._id.toString(),
      });

      await Upload.findByIdAndUpdate(uploadId, {
        status: "processed",
        itineraryId: existingItinerary._id,
      });

      return res.status(200).json({
        success: true,
        fallback: Boolean(existingItinerary.fallback),
        itinerary: existingItinerary,
        existing: true,
      });
    }

    // Mark upload as processing while the extraction begins
    await Upload.findByIdAndUpdate(uploadId, {
      status: "processing",
    });

    let extractedText = "";
    const warnings = [];
    let usedFallback = false;

    try {
      extractedText = await extractTextFromFile(
        upload.filepath,
        upload.mimetype,
      );
    } catch (extractionError) {
      console.error("[generateItinerary] extraction fallback", {
        uploadId,
        error: extractionError.message,
      });
      warnings.push(
        `Document text extraction failed: ${extractionError.message}`,
      );
      usedFallback = true;
      extractedText = [
        upload.filename,
        upload.mimetype,
        "Text extraction was unavailable, so a basic itinerary was generated from upload metadata.",
      ]
        .filter(Boolean)
        .join(" ");
    }

    console.log("[generateItinerary] extracted text", {
      uploadId,
      length: extractedText.length,
    });

    const cleanedText = extractedText
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);

    let parsedData = {};
    let aiResponse = "";

    // example function

    try {
      const extractionPrompt = `
You are an expert travel document extraction AI. Extract ONLY information that is ACTUALLY PRESENT in the text.

STEP 1: Identify the document type
- Hotel Booking: Contains hotel name, check-in, check-out, room type, guest name
- Flight Ticket: Contains airline, flight number, departure/arrival times, airport, PNR, gate, terminal
- Train Ticket: Contains train name, train number, PNR, coach, seat, platform
- Bus Ticket: Contains bus operator, boarding point, drop point, seat number
- Cruise Booking: Contains cruise line, cabin, embarkation, disembarkation
- Airbnb Booking: Contains property name, check-in, check-out, host, address
- Visa Confirmation: Contains passport, visa type, validity, country
- Tour Package: Contains tour operator, itinerary, dates, locations
- Multi-document: Multiple travel documents combined

STEP 2: Extract ALL available fields
STEP 3: Return ONLY valid JSON - no markdown code blocks
STEP 4: Set fields to null if they don't exist in the document
STEP 5: NEVER hallucinate or invent information

Return JSON with ALL fields below (set to null if not present):

{
  "documentType": "Hotel",
  "source": null,
  "destination": null,
  "city": null,
  "country": null,
  "travelDate": null,
  "checkInDate": null,
  "checkOutDate": null,
  "departureTime": null,
  "arrivalTime": null,
  "boardingTime": null,
  "passengerName": null,
  "guestName": null,
  "numberOfGuests": null,
  "numberOfChildren": null,
  "numberOfAdults": null,
  "hotel": null,
  "hotelAddress": null,
  "hotelCity": null,
  "hotelCountry": null,
  "roomType": null,
  "roomNumber": null,
  "numberOfRooms": null,
  "airline": null,
  "flightNumber": null,
  "terminal": null,
  "gate": null,
  "seatNumber": null,
  "trainName": null,
  "trainNumber": null,
  "trainCoach": null,
  "platform": null,
  "busOperator": null,
  "busNumber": null,
  "boardingPoint": null,
  "dropPoint": null,
  "pnr": null,
  "bookingReference": null,
  "confirmationNumber": null,
  "contactPhone": null,
  "contactEmail": null,
  "notes": null
}

TEXT:
${cleanedText}
`;

      aiResponse = await generateContent(extractionPrompt);

      parsedData = parseGeminiJson(aiResponse);

      if (!parsedData) {
        throw new Error("Failed to parse Gemini JSON");
      }
    } catch (aiError) {
      console.warn(
        "[generateItinerary] AI extraction unavailable. Using regex fallback.",
        {
          uploadId,
          error: aiError.message,
        },
      );

      usedFallback = true;
      warnings.push(`AI extraction unavailable: ${aiError.message}`);

      parsedData = fallbackExtraction(cleanedText);

      aiResponse = aiError.message;
    }

    // example function

    const normalize = (value) => {
      if (value === undefined || value === null) {
        return null;
      }

      const trimmed = String(value).trim();

      return trimmed.length ? trimmed : null;
    };

    const normalizeNumber = (value) => {
      if (value === undefined || value === null) {
        return null;
      }
      const num = Number(value);
      return !isNaN(num) && num > 0 ? num : null;
    };

    const normalizedParsed = {
      documentType: normalize(parsedData.documentType),
      transportType: normalize(parsedData.transportType || parsedData.documentType),
      
      // Location
      source: normalize(parsedData.source),
      destination: normalize(parsedData.destination),
      city: normalize(parsedData.city),
      country: normalize(parsedData.country),
      
      // Dates and times
      travelDate: normalize(parsedData.travelDate),
      checkInDate: normalize(parsedData.checkInDate),
      checkOutDate: normalize(parsedData.checkOutDate),
      departureTime: normalize(parsedData.departureTime),
      arrivalTime: normalize(parsedData.arrivalTime),
      boardingTime: normalize(parsedData.boardingTime),
      
      // Passenger/Guest info
      passengerName: normalize(parsedData.passengerName),
      guestName: normalize(parsedData.guestName),
      numberOfGuests: normalizeNumber(parsedData.numberOfGuests),
      numberOfChildren: normalizeNumber(parsedData.numberOfChildren),
      numberOfAdults: normalizeNumber(parsedData.numberOfAdults),
      
      // Hotel specific
      hotel: normalize(parsedData.hotel),
      hotelAddress: normalize(parsedData.hotelAddress),
      hotelCity: normalize(parsedData.hotelCity),
      hotelCountry: normalize(parsedData.hotelCountry),
      roomType: normalize(parsedData.roomType),
      roomNumber: normalize(parsedData.roomNumber),
      numberOfRooms: normalizeNumber(parsedData.numberOfRooms),
      
      // Flight specific
      airline: normalize(parsedData.airline),
      flightNumber: normalize(parsedData.flightNumber),
      terminal: normalize(parsedData.terminal),
      gate: normalize(parsedData.gate),
      seatNumber: normalize(parsedData.seatNumber),
      
      // Train specific
      trainName: normalize(parsedData.trainName),
      trainNumber: normalize(parsedData.trainNumber),
      trainCoach: normalize(parsedData.trainCoach),
      platform: normalize(parsedData.platform),
      
      // Bus specific
      busOperator: normalize(parsedData.busOperator),
      busNumber: normalize(parsedData.busNumber),
      boardingPoint: normalize(parsedData.boardingPoint),
      dropPoint: normalize(parsedData.dropPoint),
      
      // Booking references
      pnr: normalize(parsedData.pnr),
      bookingReference: normalize(parsedData.bookingReference),
      confirmationNumber: normalize(parsedData.confirmationNumber),
      
      // Contact
      contactPhone: normalize(parsedData.contactPhone),
      contactEmail: normalize(parsedData.contactEmail),
      
      // Additional
      notes: normalize(parsedData.notes),
    };

    // example function

    let generatedItinerary = "";

    if (!usedFallback) {
      try {
        // Create document-type-aware prompt
        let documentTypeContext = "";
        
        if (normalizedParsed.documentType === "Hotel") {
          documentTypeContext = `
This is a HOTEL BOOKING. Generate a detailed itinerary for a hotel stay.
Include: check-in procedures, hotel activities, attractions nearby, dining options, checkout procedures.
Use actual hotel name, address, dates, and room type if available.`;
        } else if (normalizedParsed.documentType === "Flight") {
          documentTypeContext = `
This is a FLIGHT TICKET. Generate a detailed flight travel itinerary.
Include: pre-departure preparation, airport procedures, security, boarding, in-flight, and arrival procedures.
Use actual airline, flight number, airports, times, gates, and terminals if available.`;
        } else if (normalizedParsed.documentType === "Train") {
          documentTypeContext = `
This is a TRAIN TICKET. Generate a detailed train journey itinerary.
Include: station arrival, platform information, boarding, journey journey, and arrival procedures.
Use actual train name, number, coach, seats, platforms, and times if available.`;
        } else if (normalizedParsed.documentType === "Bus") {
          documentTypeContext = `
This is a BUS TICKET. Generate a detailed bus journey itinerary.
Include: boarding point procedures, seating, journey conduct, and arrival procedures.
Use actual operator, boarding point, drop point, and times if available.`;
        }

        const itineraryPrompt = `
${documentTypeContext}

Extracted Travel Information:
${JSON.stringify(normalizedParsed, null, 2)}

Requirements:
- Create a REALISTIC, step-by-step itinerary
- Use ONLY information extracted from the document
- DO NOT invent hotels, flights, cities, or activities
- If information is missing, use generic placeholders (e.g., "your hotel", "airport")
- Format as markdown with clear sections and bullet points
- Include practical tips and instructions
- Be specific about dates, times, names, and references from the document
- Make it actionable and useful for actual travel planning
- Never mention "generic placeholder" or "to be determined"

Generate a DETAILED, DOCUMENT-TYPE-SPECIFIC itinerary:
`;

        generatedItinerary = await generateContent(itineraryPrompt);
        if (!generatedItinerary || !String(generatedItinerary).trim()) {
          throw new Error("Generated itinerary was empty");
        }
      } catch (generationError) {
        console.warn(
          "[generateItinerary] AI itinerary unavailable. Using fallback itinerary.",
          {
            uploadId,
            error: generationError.message,
          },
        );
        usedFallback = true;
        warnings.push(`AI itinerary unavailable: ${generationError.message}`);
        generatedItinerary = buildFallbackItinerary(normalizedParsed);
      }
    } else {
      generatedItinerary = buildFallbackItinerary(normalizedParsed);
    }

    // example function

    const itineraryData = {
      userId: req.user._id,
      uploadId,
      title:
        normalizedParsed.destination && normalizedParsed.travelDate
          ? `${normalizedParsed.destination} • ${normalizedParsed.travelDate}`
          : normalizedParsed.hotel && normalizedParsed.checkInDate
          ? `${normalizedParsed.hotel} • ${normalizedParsed.checkInDate}`
          : "Untitled Trip",
      extractedText,
      aiResponse,
      extractedData: normalizedParsed,
      
      // Document type
      documentType: normalizedParsed.documentType || "",
      
      // Location
      destination: normalizedParsed.destination || "",
      source: normalizedParsed.source || "",
      city: normalizedParsed.city || "",
      country: normalizedParsed.country || "",
      
      // Dates and times
      travelDate: normalizedParsed.travelDate || "",
      checkInDate: normalizedParsed.checkInDate || "",
      checkOutDate: normalizedParsed.checkOutDate || "",
      departureTime: normalizedParsed.departureTime || "",
      arrivalTime: normalizedParsed.arrivalTime || "",
      boardingTime: normalizedParsed.boardingTime || "",
      
      // Passenger/Guest
      passengerName: normalizedParsed.passengerName || "",
      guestName: normalizedParsed.guestName || "",
      numberOfGuests: normalizedParsed.numberOfGuests || null,
      numberOfChildren: normalizedParsed.numberOfChildren || null,
      numberOfAdults: normalizedParsed.numberOfAdults || null,
      
      // Hotel
      hotel: normalizedParsed.hotel || "",
      hotelAddress: normalizedParsed.hotelAddress || "",
      hotelCity: normalizedParsed.hotelCity || "",
      hotelCountry: normalizedParsed.hotelCountry || "",
      roomType: normalizedParsed.roomType || "",
      roomNumber: normalizedParsed.roomNumber || "",
      numberOfRooms: normalizedParsed.numberOfRooms || null,
      
      // Flight
      airline: normalizedParsed.airline || "",
      flightNumber: normalizedParsed.flightNumber || "",
      terminal: normalizedParsed.terminal || "",
      gate: normalizedParsed.gate || "",
      seatNumber: normalizedParsed.seatNumber || "",
      
      // Train
      trainName: normalizedParsed.trainName || "",
      trainNumber: normalizedParsed.trainNumber || "",
      trainCoach: normalizedParsed.trainCoach || "",
      platform: normalizedParsed.platform || "",
      
      // Bus
      busOperator: normalizedParsed.busOperator || "",
      busNumber: normalizedParsed.busNumber || "",
      boardingPoint: normalizedParsed.boardingPoint || "",
      dropPoint: normalizedParsed.dropPoint || "",
      
      // Booking
      pnr: normalizedParsed.pnr || "",
      bookingReference: normalizedParsed.bookingReference || "",
      confirmationNumber: normalizedParsed.confirmationNumber || "",
      
      // Contact
      contactPhone: normalizedParsed.contactPhone || "",
      contactEmail: normalizedParsed.contactEmail || "",
      
      // For backwards compatibility
      transportType: normalizedParsed.transportType || "",
      timings: "",
      notes: normalizedParsed.notes || "",
      
      itinerary: generatedItinerary,
      fallback: usedFallback,
      warnings,
      shareId: uuidv4(),
    };

    const itinerary = await Itinerary.create(itineraryData);
    console.log("Generated itinerary successfully:", itinerary._id);
    console.log("Itinerary document:", itinerary);
    console.log("Saved itinerary:", itinerary._id);

    if (!itinerary._id) {
      throw new Error("Failed to save itinerary");
    }

    await Upload.findByIdAndUpdate(uploadId, {
      status: "processed",
      itineraryId: itinerary._id,
    });

    res.status(200).json({
      success: true,
      fallback: usedFallback,
      warnings,
      itinerary,
    });
  } catch (error) {
    console.error("Generate Itinerary Error:", error);

    if (req.body?.uploadId) {
      await Upload.findByIdAndUpdate(req.body.uploadId, {
        status: "failed",
      }).catch((updateError) => {
        console.error("Failed to mark upload as failed", {
          uploadId: req.body.uploadId,
          error: updateError.message,
        });
      });
    }

    // Production safety: AI failures must never break itinerary generation.
    // This catch covers truly unexpected errors; we still attempt a best-effort fallback save.
    try {
      if (req.body?.uploadId) {
        const uploadId = req.body.uploadId;
        const upload = await Upload.findOne({
          _id: uploadId,
          userId: req.user._id,
        });
        if (upload) {
          // Ensure minimal itinerary always exists.
          const fallbackParsed = fallbackExtraction(upload.filename || "");
          const minimalItineraryText = buildFallbackItinerary(fallbackParsed);

          const itineraryData = {
            userId: req.user._id,
            uploadId,
            title: fallbackParsed.hotel 
              ? `${fallbackParsed.hotel} • Trip`
              : fallbackParsed.destination
              ? `${fallbackParsed.destination} • Trip`
              : "Untitled Trip",
            extractedText: "",
            aiResponse: "",
            extractedData: fallbackParsed,
            
            // All new fields
            documentType: fallbackParsed.documentType || "",
            destination: fallbackParsed.destination || "",
            source: fallbackParsed.source || "",
            city: fallbackParsed.city || "",
            country: fallbackParsed.country || "",
            travelDate: fallbackParsed.travelDate || "",
            checkInDate: fallbackParsed.checkInDate || "",
            checkOutDate: fallbackParsed.checkOutDate || "",
            departureTime: fallbackParsed.departureTime || "",
            arrivalTime: fallbackParsed.arrivalTime || "",
            passengerName: fallbackParsed.passengerName || "",
            guestName: fallbackParsed.guestName || "",
            numberOfGuests: fallbackParsed.numberOfGuests || null,
            hotel: fallbackParsed.hotel || "",
            hotelAddress: fallbackParsed.hotelAddress || "",
            roomType: fallbackParsed.roomType || "",
            airline: fallbackParsed.airline || "",
            flightNumber: fallbackParsed.flightNumber || "",
            trainName: fallbackParsed.trainName || "",
            trainNumber: fallbackParsed.trainNumber || "",
            trainCoach: fallbackParsed.trainCoach || "",
            platform: fallbackParsed.platform || "",
            busOperator: fallbackParsed.busOperator || "",
            boardingPoint: fallbackParsed.boardingPoint || "",
            dropPoint: fallbackParsed.dropPoint || "",
            pnr: fallbackParsed.pnr || "",
            bookingReference: fallbackParsed.bookingReference || "",
            transportType: fallbackParsed.transportType || "",
            itinerary: minimalItineraryText,
            fallback: true,
            warnings: [
              `AI/unexpected error during generation: ${error.message || "unknown"}`,
            ],
            shareId: uuidv4(),
          };

          const saved = await Itinerary.create(itineraryData);
          await Upload.findByIdAndUpdate(uploadId, {
            status: "processed",
            itineraryId: saved._id,
          });

          return res.status(200).json({
            success: true,
            fallback: true,
            warnings: itineraryData.warnings,
            itinerary: saved,
          });
        }
      }
    } catch (fallbackSaveError) {
      // If even fallback save fails, keep last-resort 500.
      console.error("[generateItinerary] fallback save failed", {
        error: fallbackSaveError.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to generate itinerary",
    });
  }
};

// example function

const getHistory = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      itineraries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// example function

const getSingleItinerary = async (req, res) => {
  try {
    console.log("Requested itinerary:", req.params.id);

    let itinerary = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      itinerary = await Itinerary.findById(req.params.id);
    }

    if (!itinerary) {
      itinerary = await Itinerary.findOne({ shareId: req.params.id });
    }

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// example function

const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// example function

const getSharedItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      shareId: req.params.shareId,
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Shared itinerary not found",
      });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSharedTrips = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({
      userId: req.user._id,

      isShared: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      itineraries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleShareTrip = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    itinerary.isShared = !itinerary.isShared;

    await itinerary.save();

    res.status(200).json({
      success: true,
      isShared: itinerary.isShared,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateItinerary,
  getHistory,
  getSingleItinerary,
  deleteItinerary,
  getSharedItinerary,
  getSharedTrips,
  toggleShareTrip,
};
