import api from "./authService";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const parseAIResponse = (value) => {
  if (!value) return { data: null, raw: "" };
  if (typeof value === "object") return { data: value, raw: JSON.stringify(value, null, 2) };

  const raw = String(value).trim();
  const withoutFence = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return { data: JSON.parse(withoutFence), raw };
  } catch {
    const jsonMatch = withoutFence.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return { data: JSON.parse(jsonMatch[0]), raw };
      } catch {
        return { data: null, raw };
      }
    }
    return { data: null, raw };
  }
};

export const itineraryService = {
  async generateItinerary(uploadId) {
    if (!uploadId) {
      throw new Error("Upload ID is required");
    }

    try {
      const response = await api.post("/itinerary/generate", { uploadId });

      // Backend returns { success: true, itinerary }
      const payload = response.data?.itinerary || response.data;

      const parsed = parseAIResponse(payload?.aiResponse || payload?.ai_response || payload?.ai);

      return {
        ...payload,
        travelDetails: parsed.data,
        rawAIResponse: parsed.raw,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to generate itinerary"));
    }
  },
  async getHistory() {
    try {
      const res = await api.get("/itinerary/history");
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch itineraries"));
    }
  },
  async getItinerary(id) {
    try {
      const res = await api.get(`/itinerary/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch itinerary"));
    }
  },
  async deleteItinerary(id) {
    try {
      const res = await api.delete(`/itinerary/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to delete itinerary"));
    }
  },
  async getSharedTrips() {
    try {
      const res = await api.get(`/itinerary/shared`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch shared trips"));
    }
  },
  async toggleShareTrip(id) {
    try {
      const res = await api.patch(`/itinerary/share-toggle/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to toggle share"));
    }
  },
  async getSharedItinerary(shareId) {
    try {
      const res = await api.get(`/itinerary/share/${shareId}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch shared itinerary"));
    }
  },
};

export default itineraryService;
