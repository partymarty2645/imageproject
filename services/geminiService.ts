import { AI, getGenerativeModel } from 'firebase/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compressBase64Image, dataURLtoBlob } from './imageCompressor';
import { OptimizedImageProcessor } from './optimizedImageProcessor';
import { FALLBACK_IMAGES } from '../constants';
import { IMAGE_PROCESSING } from '../constants/appConstants';
import { generateDailyInspirationalImage } from "./inspirationalImageService";

const IMAGE_GENERATION_PROMPT = `
A breathtakingly beautiful and serene fantasy digital painting.
The style must be ethereal and magical, deeply inspired by the intricate detail and saturated colors of Josephine Wall, the classic fairy-tale linework of Arthur Rackham, and the romanticism of the Pre-Raphaelite movement.
Incorporate the flowing, organic forms of Art Nouveau in the composition.
The mood should be one of wonder, peace, and enchantment.
The scene should be filled with soft light, mystical elements, and a sense of calm.
Avoid any dark, scary, or negative imagery. Focus on beauty and tranquility.
`;

/**
 * Genereert een dagelijkse afbeelding met gratis Unsplash API.
 * Valt terug op Firebase AI Gemini (vereist betaalde Blaze pricing) als Unsplash faalt.
 */
export const generateDailyImage = async (ai: AI): Promise<string> => {
  try {
    console.log("🔮 Attempting free image generation with Unsplash...");

    // Probeer eerst gratis inspirational image service
    const imageUrl = await generateDailyInspirationalImage();
    console.log("✅ Free image generation successful, URL:", imageUrl);
    return imageUrl;

  } catch (error) {
    console.warn("⚠️ Free Unsplash service failed, trying Firebase AI Gemini (will likely fail on free tier):", error);

    try {
      // Use Gemini model that supports image generation (requires Blaze pricing)
      const model = getGenerativeModel(ai, {
        model: 'gemini-2.5-flash-image-preview',
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      });

      const response = await model.generateContent([
        IMAGE_GENERATION_PROMPT,
        "Generate a beautiful fantasy image based on this description. Return the image with minimal text description."
      ]);

      // Check if response contains image data
      if (response.response.candidates && response.response.candidates[0]?.content?.parts) {
        const parts = response.response.candidates[0].content.parts;

        // Look for image data in the response
        for (const part of parts) {
          if (part.inlineData?.data) {
            console.log("✅ Firebase AI Gemini generated successfully");

            // Convert base64 to blob
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageBlob = dataURLtoBlob(`data:${mimeType};base64,${base64Data}`);

            // Use optimized compression
            const compressedBlob = await OptimizedImageProcessor.compressBlobDirect(imageBlob);

            // Convert to data URL for Firestore storage (free alternative to Firebase Storage)
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(compressedBlob);
            });

            return dataUrl;
          }
        }
      }

      throw new Error("Image generation failed: No image data in response.");

    } catch (geminiError) {
      console.warn("⚠️ Firebase AI Gemini also failed (expected on free tier), using static fallback:", geminiError);

      // Fallback naar een willekeurige afbeelding
      try {
        console.log("🎨 Using static fallback image...");
        const randomImageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

                // Download de fallback afbeelding
        const response = await fetch(randomImageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch fallback image: ${response.status}`);
        }

        const imageBlob = await response.blob();

        // Use optimized processing for fallback images
        const uploadedUrl = await processFallbackImage(randomImageUrl);
        console.log("✅ Static fallback image uploaded successfully");
        return uploadedUrl;

      } catch (fallbackError) {
        console.error("❌ Static fallback image also failed:", fallbackError);
        throw new Error("Both free generation, AI generation, and fallback failed. Please check the console for details.");
      }
    }
  }
}

/**
 * Process fallback image using optimized pipeline
 */
export const processFallbackImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log("🎨 Processing fallback image with optimized pipeline...");

    // Fetch image directly as blob
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch fallback image: ${response.status}`);
    }

    const originalBlob = await response.blob();

    // Use optimized compression (direct blob processing)
    const compressedBlob = await OptimizedImageProcessor.compressBlobDirect(originalBlob);

    // Convert to data URL for Firestore storage
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedBlob);
    });

    console.log("✅ Fallback image processed and ready for storage");
    return dataUrl;

  } catch (error) {
    console.error('Optimized fallback processing failed:', error);
    // Fallback to original method if optimized processing fails
    return await processFallbackImageLegacy(imageUrl);
  }
};

/**
 * Legacy fallback processing (used if optimized processing fails)
 */
const processFallbackImageLegacy = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch fallback image: ${response.status}`);
  }

  const imageBlob = await response.blob();

  // Convert to data URL for compression (legacy method)
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(imageBlob);
  });

  // Compress using legacy method
  const compressedDataUrl = await compressBase64Image(dataUrl, IMAGE_PROCESSING.COMPRESSION_QUALITY);
  console.log("✅ Legacy fallback image processed successfully");
  return compressedDataUrl;
};