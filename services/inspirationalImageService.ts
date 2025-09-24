/**
 * Multi-API image service for high-quality inspirational images
 * Supports Pexels, Pixabay, and curated collections
 */

import { env } from '../src/env-config';

// API Configuration
const PEXELS_API_KEY = env.PEXELS_API_KEY || '';
const PIXABAY_API_KEY = env.PIXABAY_API_KEY || '';

const PEXELS_BASE_URL = 'https://api.pexels.com/v1';
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

// Curated fantasy/magical image collection (free, high-quality)
const CURATED_INSPIRATIONAL_IMAGES = [
  // Romantic Moments
  'https://images.pexels.com/photos/2386144/pexels-photo-2386144.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386154/pexels-photo-2386154.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386226/pexels-photo-2386226.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386227/pexels-photo-2386227.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386228/pexels-photo-2386228.jpeg?w=800&h=800&fit=crop',

  // Love & Romance
  'https://images.pexels.com/photos/2386229/pexels-photo-2386229.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386230/pexels-photo-2386230.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386231/pexels-photo-2386231.jpeg?w=800&h=800&fit=crop',

  // Intimate Settings
  'https://images.pexels.com/photos/2386232/pexels-photo-2386232.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386233/pexels-photo-2386233.jpeg?w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/2386234/pexels-photo-2386234.jpeg?w=800&h=800&fit=crop',
];

interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL: string;
  imageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

/**
 * Search Pexels for inspirational images
 */
export const searchPexelsImages = async (query: string = 'fantasy magical nature mystical'): Promise<PexelsImage[]> => {
  if (!PEXELS_API_KEY) {
    console.log('⚠️ No Pexels API key, skipping Pexels search');
    return [];
  }

  try {
    const searchUrl = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=30&orientation=square`;
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Error searching Pexels:', error);
    return [];
  }
};

/**
 * Search Pixabay for inspirational images
 */
export const searchPixabayImages = async (query: string = 'fantasy mystical nature magical'): Promise<PixabayImage[]> => {
  if (!PIXABAY_API_KEY) {
    console.log('⚠️ No Pixabay API key, skipping Pixabay search');
    return [];
  }

  try {
    const searchUrl = `${PIXABAY_BASE_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=30&orientation=horizontal&min_width=800&min_height=800`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error searching Pixabay:', error);
    return [];
  }
};

/**
 * Get a random curated inspirational image
 */
export const getCuratedInspirationalImage = async (): Promise<string> => {
  // Import personal images dynamically
  const { PERSONAL_CURATED_IMAGES } = await import('../constants/personalImages');

  // Combine built-in and personal collections
  const allImages = [...CURATED_INSPIRATIONAL_IMAGES, ...PERSONAL_CURATED_IMAGES];
  const randomIndex = Math.floor(Math.random() * allImages.length);
  return allImages[randomIndex];
};

/**
 * Generate daily inspirational image using multiple APIs
 */
export const generateDailyInspirationalImage = async (): Promise<string> => {
  console.log('🎨 Generating daily inspirational image...');

  // Define inspirational search terms - fantasy/magical theme with nature and mythical creatures
  const inspirationalTerms = [
    'fantasy landscape magical forest',
    'ethereal mystical serene nature',
    'magical garden enchanted fairies',
    'dreamy fantasy art josephine wall',
    'mystical landscape peaceful elves',
    'enchanted forest fairy tale horses',
    'magical atmosphere serene cat',
    'fantasy world peaceful black labrador',
    'ethereal landscape fantasy art',
    'magical forest enchanted atmosphere',
    'dreamlike fantasy mystical garden',
    'serene fantasy art magical landscape',
    'enchanted mystical ethereal forest',
    'fairy tale fantasy magical dream',
    'mythical creatures nature peaceful',
    'josephine wall style fantasy art',
    'art nouveau magical landscape',
    'pre raphaelite fantasy serene',
    'fairy elves mystical forest',
    'magical horses enchanted meadow',
    'black labrador fantasy peaceful',
    'cat mystical serene garden',
    'mythical female creatures ethereal',
    'fairy tale magical atmosphere',
    'enchanted nature fantasy art'
  ];

  const randomTerm = inspirationalTerms[Math.floor(Math.random() * inspirationalTerms.length)];

  try {
    // Try Pexels first (higher quality)
    console.log('🔍 Trying Pexels API...');
    const pexelsImages = await searchPexelsImages(randomTerm);

    if (pexelsImages.length > 0) {
      const randomImage = pexelsImages[Math.floor(Math.random() * pexelsImages.length)];
      const imageUrl = randomImage.src.large; // High quality but not too large

      console.log('✅ Found Pexels image:', randomImage.photographer);
      return await downloadAndCompressImage(imageUrl);
    }

    // Try Pixabay as fallback
    console.log('🔍 Trying Pixabay API...');
    const pixabayImages = await searchPixabayImages(randomTerm);

    if (pixabayImages.length > 0) {
      const randomImage = pixabayImages[Math.floor(Math.random() * pixabayImages.length)];
      const imageUrl = randomImage.largeImageURL;

      console.log('✅ Found Pixabay image:', randomImage.user);
      return await downloadAndCompressImage(imageUrl);
    }

    // Use curated collection as final fallback
    console.log('🔍 Using curated inspirational collection...');
    const curatedUrl = await getCuratedInspirationalImage();
    console.log('✅ Using curated image');
    return await downloadAndCompressImage(curatedUrl);

  } catch (error) {
    console.warn('⚠️ All APIs failed, using curated fallback:', error);
    const curatedUrl = await getCuratedInspirationalImage();
    return await downloadAndCompressImage(curatedUrl);
  }
};

/**
 * Download and compress an image from URL
 */
export const downloadAndCompressImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log("📥 Downloading and compressing image...");

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const imageBlob = await response.blob();

    // Convert to data URL for compression
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    // Import the compression utility
    const { compressBase64Image } = await import('../utils/imageCompressor');

    // Compress the image
    const compressedDataUrl = await compressBase64Image(dataUrl, 0.8);

    console.log("✅ Image downloaded, compressed and ready for storage");
    return compressedDataUrl;

  } catch (error) {
    console.error('Error downloading and compressing image:', error);
    throw error;
  }
};

/**
 * Add your own curated images to the collection
 * Call this function to expand the curated collection
 */
export const addCuratedImages = (newImages: string[]): void => {
  CURATED_INSPIRATIONAL_IMAGES.push(...newImages);
  console.log(`✅ Added ${newImages.length} new curated images. Total: ${CURATED_INSPIRATIONAL_IMAGES.length}`);
};