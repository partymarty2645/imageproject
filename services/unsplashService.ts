/**
 * Gratis image generation service using Unsplash API
 * Voor dagelijks gegenereerde fantasy afbeeldingen zonder betaalde AI services
 */

import { env } from '../src/env-config';

const UNSPLASH_ACCESS_KEY = env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
const UNSPLASH_SECRET_KEY = env.UNSPLASH_SECRET_KEY || '';
const UNSPLASH_APP_ID = env.UNSPLASH_APPLICATION_ID || '';
const UNSPLASH_REDIRECT_URI = env.UNSPLASH_REDIRECT_URI || '';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
}

/**
 * Zoekt naar fantasy/serene afbeeldingen op Unsplash gebaseerd op keywords
 */
export const searchFantasyImages = async (query: string = 'fantasy serene magical'): Promise<UnsplashImage[]> => {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `${UNSPLASH_BASE_URL}/search/photos?query=${searchQuery}&orientation=square&per_page=30&content_filter=high`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching Unsplash images:', error);
    return [];
  }
};

/**
 * Haalt een willekeurige high-quality fantasy afbeelding op
 */
export const getRandomFantasyImage = async (): Promise<string> => {
  try {
    console.log("🖼️ Fetching random fantasy image from Unsplash...");

    // Verschillende zoektermen voor variatie
    const searchTerms = [
      'fantasy landscape magical forest',
      'ethereal mystical serene',
      'magical garden enchanted',
      'dreamy fantasy art',
      'mystical landscape peaceful',
      'enchanted forest fairy tale',
      'magical atmosphere serene',
      'fantasy world peaceful'
    ];

    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const images = await searchFantasyImages(randomTerm);

    if (images.length === 0) {
      throw new Error('No images found from Unsplash');
    }

    // Kies een willekeurige afbeelding
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Gebruik de 'regular' size voor goede kwaliteit maar niet te groot
    const imageUrl = randomImage.urls.regular;

    console.log("✅ Found fantasy image:", randomImage.alt_description || 'No description');
    return imageUrl;

  } catch (error) {
    console.error('Error fetching random fantasy image:', error);
    throw error;
  }
};

/**
 * Download en comprimeer een afbeelding van een URL
 */
export const downloadAndCompressImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log("📥 Downloading and compressing image...");

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const imageBlob = await response.blob();

    // Converteer naar data URL voor compressie
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    // Import the compression utility
    const { compressBase64Image, dataURLtoBlob } = await import('../utils/imageCompressor');

    // Comprimeer de afbeelding
    const compressedDataUrl = await compressBase64Image(dataUrl, 0.8);

    console.log("✅ Image downloaded, compressed and ready for storage");
    return compressedDataUrl;

  } catch (error) {
    console.error('Error downloading and compressing image:', error);
    throw error;
  }
};

/**
 * Genereert een dagelijkse fantasy afbeelding met gratis Unsplash API
 * Voor nu gebruikt het alleen de static fallback images tot we een API key hebben
 */
export const generateDailyImageFree = async (): Promise<string> => {
  try {
    console.log("🖼️ Fetching dynamic fantasy image from Unsplash API...");
    console.log("🔑 Access key present:", !!UNSPLASH_ACCESS_KEY, "Key starts with:", UNSPLASH_ACCESS_KEY?.substring(0, 10));

    // Controleer of we een access key hebben
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      console.log("⚠️ No Unsplash access key found, using static fallback");
      return await generateStaticFallback();
    }

    // Specifiekere zoektermen voor fantasy/magische afbeeldingen
    const searchTerms = [
      'fantasy art magical forest ethereal',
      'mystical landscape enchanted woods',
      'magical garden fairy tale dreamlike',
      'ethereal fantasy art serene mystical',
      'enchanted forest magical atmosphere',
      'dreamy fantasy landscape peaceful',
      'magical realm ethereal fantasy',
      'fairy tale garden enchanted mystical',
      'fantasy world magical serene',
      'ethereal landscape fantasy art',
      'magical forest enchanted atmosphere',
      'dreamlike fantasy mystical garden',
      'serene fantasy art magical landscape',
      'enchanted mystical ethereal forest',
      'fairy tale fantasy magical dream'
    ];

    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    console.log("🔍 Searching Unsplash for:", randomTerm);

    // Unsplash API search endpoint met betere parameters
    const searchUrl = `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(randomTerm)}&orientation=squarish&per_page=30&content_filter=high&color=purple&color=blue&color=green`;
    console.log("🌐 Making API call to:", searchUrl);

    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    });

    console.log("📡 API response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      throw new Error(`Unsplash API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📊 API response data:", { total: data.total, results_count: data.results?.length });

    if (!data.results || data.results.length === 0) {
      console.log("⚠️ No results from Unsplash, using static fallback");
      return await generateStaticFallback();
    }

    // Kies een willekeurige afbeelding uit de resultaten
    // Filter voor afbeeldingen met fantasy/magische beschrijvingen - meer relaxed filtering
    const fantasyResults = data.results.filter((image: any) => {
      const description = (image.alt_description || '').toLowerCase();
      const title = (image.description || '').toLowerCase();
      const combined = description + ' ' + title;

      // Meer inclusieve filtering voor fantasy/serene thema's
      const fantasyKeywords = ['fantasy', 'magical', 'ethereal', 'mystical', 'enchanted', 'fairy', 'dream', 'magical', 'surreal', 'magical', 'forest', 'woods', 'garden', 'landscape', 'nature', 'peaceful', 'serene', 'calm', 'tranquil', 'beautiful', 'artistic', 'abstract', 'water', 'sky', 'mountain', 'flower', 'tree', 'light', 'dark', 'shadow', 'mystery', 'wonder', 'magic'];

      return fantasyKeywords.some(keyword => combined.includes(keyword));
    });

    console.log(`🎯 Filtered ${fantasyResults.length} fantasy images from ${data.results.length} total results`);

    // Gebruik gefilterde resultaten, of val terug op alle resultaten als er te weinig zijn
    const finalResults = fantasyResults.length >= 1 ? fantasyResults : data.results;

    if (finalResults.length === 0) {
      console.log("⚠️ No suitable fantasy images found, using static fallback");
      return await generateStaticFallback();
    }

    const randomImage = finalResults[Math.floor(Math.random() * finalResults.length)];
    const imageUrl = randomImage.urls.regular; // Gebruik regular size voor goede kwaliteit

    // Download, comprimeer en converteer naar base64 data URL
    // Sla op in Firestore als data URL (gratis alternatief voor Firebase Storage)
    const compressedDataUrl = await downloadAndCompressImage(imageUrl);

    console.log("✅ Found Unsplash image:", randomImage.alt_description || 'No description');
    console.log("📝 Description:", randomImage.description || 'No title');
    console.log("🖼️ Compressed image ready for storage");

    return compressedDataUrl;

  } catch (error) {
    console.warn("⚠️ Unsplash API failed, using static fallback:", error);
    return await generateStaticFallback();
  }
};

/**
 * Genereert een statische fallback afbeelding (oude implementatie)
 */
const generateStaticFallback = async (): Promise<string> => {
  console.log("🎨 Using static fantasy fallback image...");

  const { FALLBACK_IMAGES } = await import('../constants');
  const randomImageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

  // Download en comprimeer de fallback afbeelding
  const compressedDataUrl = await downloadAndCompressImage(randomImageUrl);
  return compressedDataUrl;
};