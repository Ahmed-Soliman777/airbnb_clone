import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateDescription(title) {
    const prompt = `Write an attractive, engaging description for the following title: "${title}". The description must sound like it was written by a professional human host, match the language of the title, and include only the description text.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export async function generatePricePerNight(lat, lng) {
    const prompt = `Estimate a realistic price per night (in EGP) for a property at latitude ${lat}, longitude ${lng}. Respond with only the numerical value, no other text.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}