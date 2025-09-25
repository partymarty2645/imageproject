import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'partymarty2645/imageproject';
const OWNER = GITHUB_REPOSITORY.split('/')[0];
const REPO = GITHUB_REPOSITORY.split('/')[1];

// Predefined tags for prompts - expanded for more variety
const tags = [
  // Nature themes
  'serene mountain lake at dawn',
  'mystical forest with glowing mushrooms',
  'peaceful ocean waves at sunset',
  'ethereal desert oasis',
  'tranquil bamboo grove',
  'majestic waterfall in autumn',
  'gentle river through wildflowers',
  'snow-capped peaks under northern lights',
  
  // Fantasy elements
  'floating crystal palace',
  'enchanted garden with fairies',
  'magical library with floating books',
  'celestial observatory',
  'ancient stone circle at midnight',
  'floating islands in the clouds',
  'underground crystal cavern',
  'mythical creature in peaceful repose',
  
  // Abstract and emotional
  'flowing colors of serenity',
  'geometric patterns of harmony',
  'swirling energies of calm',
  'intertwined vines of connection',
  'dancing light particles',
  'ripples of tranquility',
  'woven threads of fate',
  'breathing patterns of nature',
  
  // Seasonal and time-based
  'spring blossoms awakening',
  'summer meadow in full bloom',
  'autumn leaves gently falling',
  'winter snowflakes dancing',
  'morning dew on petals',
  'golden hour light through trees',
  'starry night sky over hills',
  'moonlit path through woods'
];

const IMAGE_GENERATION_PROMPT = `
Create a breathtakingly beautiful and serene digital artwork that evokes peace, wonder, and tranquility.
The style should be ethereal and magical, with intricate details and harmonious composition.

Artistic influences to draw from (choose or blend as appropriate):
- The saturated colors and mystical elements of Josephine Wall
- The delicate linework and fairy-tale atmosphere of Arthur Rackham
- The romantic beauty and natural forms of the Pre-Raphaelite movement
- The flowing, organic curves of Art Nouveau design
- The luminous quality of Impressionist landscape painting
- The symbolic depth of Symbolist art
- The harmonious balance of Classical composition
- The dreamlike quality of Surrealist imagination

Key requirements:
- Focus on beauty, peace, and positive emotions
- Use soft, harmonious lighting and color palettes
- Incorporate natural or mystical elements that feel calming
- Avoid any dark, scary, or negative imagery
- Create a sense of wonder and gentle magic
- Ensure the composition feels balanced and serene

The artwork should inspire contemplation and bring a sense of calm to the viewer.
`;

async function generateImage() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      responseModalities: ['Text', 'Image']
    }
  });

  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  const fullPrompt = `${IMAGE_GENERATION_PROMPT}\n\nCreate a unique and beautiful artwork featuring: ${randomTag}. Let your creativity flow while maintaining the serene and inspirational quality. Feel free to interpret this theme in your own artistic way.`;

  try {
    console.log('🔮 Generating image with Gemini API...');
    const result = await model.generateContent(fullPrompt);
    
    // Check if response contains image data
    if (result.response.candidates && result.response.candidates[0]?.content?.parts) {
      const parts = result.response.candidates[0].content.parts;

      // Look for image data in the response
      for (const part of parts) {
        if (part.inlineData?.data) {
          console.log('✅ Image generated successfully');

          // Convert base64 to buffer
          const base64Data = part.inlineData.data;
          const buffer = Buffer.from(base64Data, 'base64');
          
          const date = new Date().toISOString().split('T')[0];
          const filePath = `public/images/${date}.png`;
          
          // Ensure directory exists
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(filePath, buffer);
          console.log(`💾 Image saved to ${filePath}`);

          // Commit to GitHub
          const octokit = new Octokit({ auth: GH_TOKEN });
          const content = fs.readFileSync(filePath, 'base64');
          await octokit.repos.createOrUpdateFileContents({
            owner: OWNER,
            repo: REPO,
            path: filePath,
            message: `Add daily AI-generated image for ${date}`,
            content: content,
            branch: 'main'
          });

          console.log(`📤 Image committed to GitHub for ${date}`);
          return;
        }
      }
    }

    throw new Error('No image data found in response');

  } catch (error) {
    console.error('❌ Error generating image:', error);
    process.exit(1);
  }
}

generateImage();