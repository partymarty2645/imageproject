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

// Predefined tags for prompts
const tags = [
  'surreal landscape',
  'dreamy forest',
  'ethereal mountains',
  'mystical ocean',
  'fantasy castle',
  'peaceful meadow',
  'abstract emotions',
  'cosmic wonder'
];

const IMAGE_GENERATION_PROMPT = `
A breathtakingly beautiful and serene fantasy digital painting.
The style must be ethereal and magical, deeply inspired by the intricate detail and saturated colors of Josephine Wall, the classic fairy-tale linework of Arthur Rackham, and the romanticism of the Pre-Raphaelite movement.
Incorporate the flowing, organic forms of Art Nouveau in the composition.
The mood should be one of wonder, peace, and enchantment.
The scene should be filled with soft light, mystical elements, and a sense of calm.
Avoid any dark, scary, or negative imagery. Focus on beauty and tranquility.
`;

async function generateImage() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'imagen-4',
    generationConfig: {
      responseModalities: ['Text', 'Image']
    }
  });

  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  const fullPrompt = `${IMAGE_GENERATION_PROMPT}\n\nCreate a beautiful fantasy image with the theme: ${randomTag}. Make it calming and inspirational.`;

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