import axios from 'axios';
import { getAIRecommendation } from './ai';

/**
 * Generate recommended homes based on user preferences using AI
 * @param {Object} filters - User preferences for filtering
 * @returns {Promise<Array>} Array of recommended homes
 */
export const generateRecommendations = async (filters = {}) => {
    try {
        console.log("Generating AI recommendations for:", filters);

        const response = await axios.get('http://localhost:3000/api/listings');
        let allListings = response.data.data;
        // console.log(allListings);
        let candidates = allListings;

        if (filters.city) {
            candidates = candidates.filter(home =>
                home.address?.city?.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.pricePerNight?.min || filters.pricePerNight?.max) {
            candidates = candidates.filter(home => {
                const min = filters.pricePerNight.min ? parseFloat(filters.pricePerNight.min) : 0;
                const max = filters.pricePerNight.max ? parseFloat(filters.pricePerNight.max) : Infinity;
                return home.pricePerNight >= min && home.pricePerNight <= max;
            });
        }

        if (candidates.length === 0) return [];

        // Prepare data for AI
        const listingsForAI = candidates.map(home => ({
            id: home._id,
            title: home.title,
            description: home.description,
            type: home.propertyType,
            amenities: home.amenities?.map(a => a.name) || [],
            price: home.pricePerNight
        }));

        // 4. Construct Prompt
        const prompt = `
            Act as an expert travel agent. I have a traveler with the following preferences:
            - **Purpose of Trip**: ${filters.purpose || 'General Travel'}
            - **Desired Property Type**: ${filters.propertyType || 'Any'}
            - **Desired Amenities**: ${filters.amenities?.join(', ') || 'None specific'}
            
            Here is a list of available properties (JSON):
            ${JSON.stringify(listingsForAI)}

            **Task**:
            1. Select the top properties that BEST match the traveler's "Purpose" and specific needs.
            2. Even if a property doesn't have every single amenity, if it fits the VIBE of the purpose perfectly, include it.
            3. Prioritize "Property Type" if specified, but if a different type is a perfect match for the purpose (e.g. a villa for a family trip instead of an apartment), you can include it.
            4. Return ONLY a JSON array of the matching Property IDs (strings). Do not return any other text.
            
            Example Response: ["64f...", "65a..."]
        `;

        // call ai
        console.log("Asking AI for recommendations...");
        const aiResponse = await getAIRecommendation(prompt);

        if (!aiResponse) {
            // return candidates if AI fails
            console.warn("AI didn't return a response, returning pre-filtered candidates.");
            return candidates;
        }

        // parse response
        let recommendedIds = [];
        try {
            // Clean code blocks if present (markdown json)
            const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            recommendedIds = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse AI response:", e);
            return candidates;
        }

        // filter and order final list
        const recommendedHomes = [];
        const candidateMap = new Map(candidates.map(h => [h._id, h]));

        recommendedIds.forEach(id => {
            if (candidateMap.has(id)) {
                recommendedHomes.push(candidateMap.get(id));
            }
        });

        // final sort
        recommendedHomes.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });

        console.log(`AI recommended ${recommendedHomes.length} homes.`);
        return recommendedHomes;

    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations. Please try again.');
    }
};
