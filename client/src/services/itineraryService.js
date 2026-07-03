import api from "./authService";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

const isObjectIdLike = (value) => {
  if (!value) return false;
  return /^[a-f\d]{24}$/i.test(String(value).trim());
};


export const parseAIResponse = (value) => {

  if (!value) {
    return {
      data: null,
      raw: "",
    };
  }

  if (typeof value === "object") {

    return {
      data: value,
      raw: JSON.stringify(value, null, 2),
    };

  }

  const raw = String(value).trim();

  const withoutFence = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {

    return {
      data: JSON.parse(withoutFence),
      raw,
    };

  } catch {

    const jsonMatch =
      withoutFence.match(/\{[\s\S]*\}/);

    if (jsonMatch) {

      try {

        return {
          data: JSON.parse(jsonMatch[0]),
          raw,
        };

      } catch {

        return {
          data: null,
          raw,
        };

      }

    }

    return {
      data: null,
      raw,
    };

  }

};

export const itineraryService = {

  // =========================================
  // GENERATE ITINERARY
  // =========================================

  async generateItinerary(uploadId) {

    if (!uploadId) {

      throw new Error(
        "Upload ID is required"
      );

    }

    try {

      const response =
        await api.post(
          "/itinerary/generate",
          {
            uploadId,
          }
        );

      console.log(
        "Generate response:",
        response.data
      );

      if (
        response.data?.success !== true
      ) {

        throw new Error(
          response.data?.message ||
          "Itinerary generation failed"
        );

      }

      const payload =
        response.data?.itinerary;

      if (
        !payload ||
        !payload._id
      ) {

        throw new Error(
          "Invalid itinerary response"
        );

      }

      const parsed =
        parseAIResponse(

          payload?.aiResponse ||
          payload?.ai_response ||
          payload?.ai

        );

      return {

        success:
          response.data?.success ?? true,

        fallback:
          response.data?.fallback ?? false,

        warnings:
          response.data?.warnings ||
          payload?.warnings ||
          [],

        itinerary: payload,

        extractedText:
          payload?.extractedText || null,

        travelDetails:
          parsed.data,

        rawAIResponse:
          parsed.raw,

      };

    } catch (error) {

      console.error(
        "Generate itinerary error:",
        error
      );

      throw new Error(

        getErrorMessage(
          error,
          "Unable to generate itinerary"
        )

      );

    }

  },

  // =========================================
  // GET HISTORY
  // =========================================

  async getHistory() {

    try {

      const res =
        await api.get(
          "/itinerary/history"
        );

      return res.data;

    } catch (error) {

      throw new Error(

        getErrorMessage(
          error,
          "Unable to fetch itineraries"
        )

      );

    }

  },

  // =========================================
  // GET SINGLE ITINERARY
  // =========================================

  async getItinerary(
    id,
    retries = 5
  ) {

    if (!id) {
      throw new Error("Itinerary id is required");
    }

    // Avoid pointless server calls for clearly invalid params.
    if (!isObjectIdLike(id)) {
      throw new Error("Itinerary not found");
    }

    for (
      let i = 0;
      i < retries;
      i++
    ) {


      try {

        console.log(

          `Fetching itinerary ${id} (Attempt ${i + 1}/${retries})`

        );

        const res =
          await api.get(
            `/itinerary/${id}`
          );

        console.log(
          "Itinerary response:",
          res.data
        );

        // Backend returns { success, itinerary } for single fetch.
        if (!res.data?.success) {
          throw new Error(res.data?.message || "Unable to fetch itinerary");
        }

        // Always return the itinerary document (not the wrapper payload).
        if (!res.data?.itinerary) {
          throw new Error("Itinerary not found");
        }

        return res.data.itinerary;


      } catch (error) {

        console.log(
          "Retrying itinerary fetch..."
        );

        if (
          i === retries - 1
        ) {

          throw new Error(

            getErrorMessage(
              error,
              "Unable to fetch itinerary"
            )

          );

        }

        await new Promise(
          (resolve) =>

            setTimeout(
              resolve,
              2000
            )

        );

      }

    }

  },

  // =========================================
  // DELETE ITINERARY
  // =========================================

  async deleteItinerary(id) {

    try {

      const res =
        await api.delete(
          `/itinerary/${id}`
        );

      return res.data;

    } catch (error) {

      throw new Error(

        getErrorMessage(
          error,
          "Unable to delete itinerary"
        )

      );

    }

  },

  // =========================================
  // GET SHARED TRIPS
  // =========================================

  async getSharedTrips() {

    try {

      const res =
        await api.get(
          "/itinerary/shared"
        );

      return res.data;

    } catch (error) {

      throw new Error(

        getErrorMessage(
          error,
          "Unable to fetch shared trips"
        )

      );

    }

  },

  // =========================================
  // TOGGLE SHARE
  // =========================================

  async toggleShareTrip(id) {

    try {

      const res =
        await api.patch(
          `/itinerary/share-toggle/${id}`
        );

      return res.data;

    } catch (error) {

      throw new Error(

        getErrorMessage(
          error,
          "Unable to toggle share"
        )

      );

    }

  },

  // =========================================
  // GET SHARED ITINERARY
  // =========================================

  async getSharedItinerary(shareId) {

    try {

      const res =
        await api.get(
          `/itinerary/share/${shareId}`
        );

      return res.data;

    } catch (error) {

      throw new Error(

        getErrorMessage(
          error,
          "Unable to fetch shared itinerary"
        )

      );

    }

  },

};

export default itineraryService;