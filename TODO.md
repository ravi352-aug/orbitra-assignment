# TODO - Itinerary generation reliability (AI optional)

- [ ] Update `server/controllers/itineraryController.js` to guarantee:
  - [ ] AI failures never cause 500
  - [ ] always create itinerary using regex fallback when AI fails
  - [ ] always save to MongoDB and return `{ success:true, fallback:<bool>, itinerary:<savedItinerary> }`
- [ ] Ensure extraction fallback always produces valid parsedData; add guards for empty/undefined outputs.
- [ ] Make final response contract consistent and remove any remaining paths that might return 500 due to AI-related issues.
- [ ] Optional (only if needed after backend fix): tweak `client/src/pages/ItineraryDetails.jsx` retry logic for 404/not found.
- [ ] Run tests / manual flow:
  - [ ] Upload doc with AI failing (quota key missing/blocked) and confirm itinerary page renders
  - [ ] Verify MongoDB contains saved itinerary with `fallback:true`

