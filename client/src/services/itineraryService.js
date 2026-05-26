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
      const response = await api.post(
        "/itinerary/generate",
        { uploadId },
      );

      const parsed = parseAIResponse(response.data?.aiResponse);
      return {
        ...response.data,
        travelDetails: parsed.data,
        rawAIResponse: parsed.raw,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to generate itinerary"));
    }
  },
};
