import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const GH_TOKEN = process.env.GH_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'partymarty2645/imageproject';
const OWNER = GITHUB_REPOSITORY.split('/')[0];
const REPO = GITHUB_REPOSITORY.split('/')[1];

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import our image service (we'll need to make it work in Node.js context)
async function generateDailyInspirationalImage() {
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
    // Try Pixabay first (better results for fantasy themes)
    console.log('🔍 Trying Pixabay API...');
    const pixabayImages = await searchPixabayImages(randomTerm);

    if (pixabayImages.length > 0) {
      const randomImage = pixabayImages[Math.floor(Math.random() * pixabayImages.length)];
      const imageUrl = randomImage.largeImageURL;

      console.log('✅ Found Pixabay image:', randomImage.user);
      return await downloadAndCompressImage(imageUrl);
    }

    // Try Pexels as fallback
    console.log('🔍 Trying Pexels API...');
    const pexelsImages = await searchPexelsImages(randomTerm);

    if (pexelsImages.length > 0) {
      const randomImage = pexelsImages[Math.floor(Math.random() * pexelsImages.length)];
      const imageUrl = randomImage.src.large;

      console.log('✅ Found Pexels image:', randomImage.photographer);
      return await downloadAndCompressImage(imageUrl);
    }

    // Use curated collection as final fallback
    console.log('🔍 Using curated inspirational collection...');
    const curatedUrl = await getCuratedInspirationalImage();
    console.log('✅ Using curated image');
    return await downloadAndCompressImage(curatedUrl);

  } catch (error) {
    console.warn('⚠️ All APIs failed, using simple fallback:', error);
    // Return a simple fallback image URL that doesn't require processing
    return 'https://images.pexels.com/photos/2386144/pexels-photo-2386144.jpeg?w=800&h=800&fit=crop';
  }
}

// Pexels API functions (adapted for Node.js)
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';

async function searchPexelsImages(query) {
  if (!PEXELS_API_KEY) {
    console.log('⚠️ No Pexels API key, skipping Pexels search');
    return [];
  }

  try {
    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=square`;
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
}

async function searchPixabayImages(query) {
  if (!PIXABAY_API_KEY) {
    console.log('⚠️ No Pixabay API key, skipping Pixabay search');
    return [];
  }

  try {
    const searchUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=30&orientation=horizontal&min_width=800&min_height=800`;
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
}

async function getCuratedInspirationalImage() {
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

  const randomIndex = Math.floor(Math.random() * CURATED_INSPIRATIONAL_IMAGES.length);
  return CURATED_INSPIRATIONAL_IMAGES[randomIndex];
}

async function downloadAndCompressImage(imageUrl) {
  try {
    console.log("📥 Downloading and compressing image...");

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const imageBlob = await response.blob();

    // For Node.js, we'll save as buffer directly (no compression for now)
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("✅ Image downloaded and ready for storage");
    return buffer;

  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

async function generateImage() {
  try {
    console.log('🎨 Starting daily image generation process...');

    // Generate the image using our multi-API service
    const imageBuffer = await generateDailyInspirationalImage();

    // Save locally first
    const date = new Date().toISOString().split('T')[0];
    const filePath = `public/images/${date}.png`;

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, imageBuffer);
    console.log(`💾 Image saved locally to ${filePath}`);

    // Commit to GitHub
    console.log('📤 Committing image to GitHub...');
    const octokit = new Octokit({ auth: GH_TOKEN });
    const content = fs.readFileSync(filePath, 'base64');

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: `Add daily inspirational image for ${date}`,
      content: content,
      branch: 'main'
    });

    console.log(`✅ Image successfully committed to GitHub for ${date}`);

  } catch (error) {
    console.error('❌ Error in image generation process:', error);
    process.exit(1);
  }
}

generateImage();