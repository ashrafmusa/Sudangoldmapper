import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. Please set it to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getDepositDescription(depositName: string): Promise<string> {
  const prompt = `Provide a brief, engaging geological description for a gold deposit named "${depositName}" in Sudan. Focus on the type of deposit, surrounding rock types, and why it's a significant location for gold. Keep it to 2-3 sentences.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getDepositDescription:", error);
    throw new Error("Failed to fetch description from AI model.");
  }
}

export async function getAnalysisSummary(): Promise<string> {
  const prompt = `
    You are a senior geologist delivering a final report for the Sudan GoldMapper project.
    The analysis combined Sentinel-2 imagery (NDVI, Iron Oxide, Clay indices), SRTM elevation data (slope), and known gold deposit locations to train a Random Forest AI model. The model has now generated a final gold potential prediction map for Eastern Sudan.
    
    Generate a concise, professional summary of the project's findings. Structure the report with:
    1.  **Executive Summary:** A brief, high-level overview of the outcome.
    2.  **Key Findings:** 2-3 bullet points detailing the most important insights. For example, mention specific correlations the model found (e.g., "High iron oxide values combined with moderate slopes were strong predictors") or the discovery of new promising zones near existing clusters.
    3.  **Recommendation:** A concluding sentence on next steps (e.g., "Field verification is recommended for the high-potential zones identified in the northwest.").
    
    Keep the tone confident and data-driven. Use markdown for bolding and bullet points.
  `;
  
  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getAnalysisSummary:", error);
    throw new Error("Failed to generate analysis summary from AI model.");
  }
}

export async function getSatelliteUpdateInfo(): Promise<string> {
  const prompt = `
    Generate a short, one-sentence notification for a satellite imagery update for an app analyzing gold potential in Sudan. 
    Mention a plausible, recent event or condition. 
    Example: "New cloud-free imagery from early this month is now available for the Red Sea Hills region."
    Make it concise and professional.
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getSatelliteUpdateInfo:", error);
    throw new Error("Failed to generate satellite update info.");
  }
}

export async function getModelExplanation(): Promise<string> {
    const prompt = `
        Explain what a Random Forest model is and why it's a good choice for geospatial analysis to find gold, like in this app.
        Keep it simple, around 2-3 sentences. Target a non-expert audience.
        Analogy: like asking many experts (trees) and averaging their opinions.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch(error) {
        console.error("Gemini API error in getModelExplanation:", error);
        throw new Error("Failed to generate model explanation.");
    }
}
