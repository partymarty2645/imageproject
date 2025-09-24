const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN;
const OWNER = process.env.GITHUB_REPOSITORY.split('/')[0];
const REPO = process.env.GITHUB_REPOSITORY.split('/')[1];

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

async function generateImage() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' }); // Note: Adjust model if image generation is supported

  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  const prompt = `Create a beautiful, serene digital artwork with the theme: ${randomTag}. Make it calming and inspirational.`;

  try {
    // Generate image (assuming Gemini supports image generation; adjust based on API capabilities)
    const result = await model.generateContent(prompt);
    const imageData = result.response.text(); // Placeholder; actual implementation depends on Gemini's image response format

    // For demonstration, assume imageData is a base64 string; convert and save
    const buffer = Buffer.from(imageData, 'base64');
    const date = new Date().toISOString().split('T')[0];
    const filePath = `public/images/${date}.png`;
    fs.writeFileSync(filePath, buffer);

    // Commit to GitHub
    const octokit = new Octokit({ auth: GH_TOKEN });
    const content = fs.readFileSync(filePath, 'base64');
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: `Add daily image for ${date}`,
      content: content,
      branch: 'main'
    });

    console.log(`Image generated and committed for ${date}`);
  } catch (error) {
    console.error('Error generating image:', error);
    process.exit(1);
  }
}

generateImage();