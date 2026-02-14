import { HfInference } from '@huggingface/inference';
import type { RoomConfig, DesignResult, FurnitureItem } from './types';
import { COLOR_PALETTES, STYLE_DESCRIPTIONS } from './constants';

// API Configuration
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN || '';
const USE_FALLBACK = !HF_TOKEN || HF_TOKEN === '';

let inference: HfInference | null = null;
let hfPermissionError = false;

if (!USE_FALLBACK) {
  try {
    inference = new HfInference(HF_TOKEN);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('Failed to initialize HuggingFace inference:', errorMessage);
    if (errorMessage.includes('permissions') || errorMessage.includes('Inference Providers')) {
      hfPermissionError = true;
      console.warn('HF token lacks required permissions for Inference Providers. Using fallback mode.');
    }
  }
}

export async function generateRoomImage(config: RoomConfig): Promise<string | null> {
  if (USE_FALLBACK || !inference) {
    // Return a placeholder image URL from picsum
    const seed = config.roomType.length + config.style.length;
    return `https://picsum.photos/seed/${seed}/1024/576`;
  }

  try {
    const prompt = `Interior design render of a ${config.roomType} in ${config.style} style, ${config.colorScheme} color scheme, photorealistic, high quality, 8k, professional interior photography, cozy, spacious, detailed furniture, beautiful lighting`;

    const result = await inference.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry, low quality, distorted, ugly, deformed',
        guidance_scale: 7.5,
        num_inference_steps: 30,
      },
    });

    const blob = result as unknown as Blob;
    return URL.createObjectURL(blob);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Image generation error:', errorMessage);
    
    // Check for permission/authentication errors - fall back gracefully
    if (errorMessage.includes('permissions') || errorMessage.includes('authentication') || errorMessage.includes('Inference Providers')) {
      console.warn('HF token lacks required permissions. Using fallback mode.');
      return `https://picsum.photos/seed/${config.roomType.length + config.style.length}/1024/576`;
    }
    
    // Fallback to placeholder for other errors
    const seed = config.roomType.length + config.style.length;
    return `https://picsum.photos/seed/${seed}/1024/576`;
  }
}

export async function generateDesignDescription(config: RoomConfig): Promise<string | null> {
  if (USE_FALLBACK || !inference) {
    return generateFallbackDescription(config);
  }

  try {
    const prompt = `Write a detailed interior design description for a ${config.roomType} with the following specifications:
- Style: ${config.style}
- Color Scheme: ${config.colorScheme}
- Budget: ${config.budget}
- Room Size: ${config.size}

Describe the layout, key furniture pieces, color choices, lighting recommendations, and decorative elements. Make it inspiring and practical. Keep it to 3-4 paragraphs.`;

    const stream = inference.chatCompletionStream({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
    }

    return fullResponse || generateFallbackDescription(config);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Text generation error:', errorMessage);
    
    // Check for permission/authentication errors - fall back gracefully
    if (errorMessage.includes('permissions') || errorMessage.includes('authentication') || errorMessage.includes('Inference Providers')) {
      console.warn('HF token lacks required permissions. Using fallback mode.');
    }
    return generateFallbackDescription(config);
  }
}

function generateFallbackDescription(config: RoomConfig): string {
  const styleDesc = STYLE_DESCRIPTIONS[config.style] || '';
  
  return `This ${config.roomType} showcases a beautiful ${config.style} aesthetic with a ${config.colorScheme.toLowerCase()} color palette.

${styleDesc}

The design incorporates a thoughtful layout that maximizes both functionality and visual appeal. Key furniture pieces have been selected to complement the overall theme within the ${config.budget} budget. Lighting plays a crucial role in setting the mood, with a combination of ambient, task, and accent lighting to create depth and warmth.

The ${config.colorScheme} scheme brings visual harmony to the space, while the ${config.size.split(' ')[0].toLowerCase()} room size allows for comfortable movement and arrangement of essential elements.`;
}

export function generateColorPalette(colorScheme: string) {
  return {
    colors: COLOR_PALETTES[colorScheme] || COLOR_PALETTES['Neutral'],
  };
}

export async function generateFurnitureRecommendations(config: RoomConfig): Promise<FurnitureItem[]> {
  if (USE_FALLBACK || !inference) {
    return generateFallbackFurniture(config);
  }

  try {
    const prompt = `List 6 furniture items suitable for a ${config.roomType} in ${config.style} style with ${config.colorScheme} colors and budget of ${config.budget}. 

Format each item as: Item Name | Price Range | Brief Description

Only respond with the list, no additional text.`;

    const stream = inference.chatCompletionStream({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
    }

    return parseFurnitureResponse(fullResponse) || generateFallbackFurniture(config);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Furniture generation error:', errorMessage);
    
    // Check for permission/authentication errors - fall back gracefully
    if (errorMessage.includes('permissions') || errorMessage.includes('authentication') || errorMessage.includes('Inference Providers')) {
      console.warn('HF token lacks required permissions. Using fallback mode.');
    }
    return generateFallbackFurniture(config);
  }
}

function parseFurnitureResponse(response: string): FurnitureItem[] {
  const lines = response.split('\n').filter(line => line.trim());
  const items: FurnitureItem[] = [];

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      items.push({
        name: parts[0].replace(/^\d+\.\s*/, ''),
        price: parts[1],
        description: parts[2],
        category: 'Furniture',
      });
    }
  }

  return items.slice(0, 6);
}

function generateFallbackFurniture(config: RoomConfig): FurnitureItem[] {
  const furnitureByRoom: Record<string, FurnitureItem[]> = {
    'Living Room': [
      { name: 'Modern Sectional Sofa', price: '$2,500 - $4,000', description: 'L-shaped sectional with clean lines and plush cushions', category: 'Seating' },
      { name: 'Coffee Table', price: '$400 - $800', description: 'Mid-century modern design with wood and metal accents', category: 'Tables' },
      { name: 'Accent Armchair', price: '$600 - $1,200', description: 'Velvet upholstery with brass finish legs', category: 'Seating' },
      { name: 'Floor Lamp', price: '$200 - $500', description: 'Arched floor lamp with adjustable head', category: 'Lighting' },
      { name: 'Media Console', price: '$800 - $1,500', description: 'Walnut wood media unit with cable management', category: 'Storage' },
      { name: 'Area Rug', price: '$300 - $700', description: 'Hand-woven wool rug with pattern', category: 'Rugs' },
    ],
    'Bedroom': [
      { name: 'Platform Bed', price: '$1,200 - $2,500', description: 'Upholstered king/queen platform bed with tufted headboard', category: 'Beds' },
      { name: 'Nightstands', price: '$300 - $600', description: 'Pair of drawer nightstands with soft-close drawers', category: 'Storage' },
      { name: 'Dresser', price: '$800 - $1,800', description: '6-drawer dresser with mirror', category: 'Storage' },
      { name: 'Bedside Lamps', price: '$150 - $350', description: 'Set of 2 ceramic table lamps with linen shades', category: 'Lighting' },
      { name: 'Vanity Chair', price: '$200 - $400', description: 'Upholstered vanity chair with swivel base', category: 'Seating' },
      { name: 'Chest of Drawers', price: '$600 - $1,200', description: 'Tall chest with 5 drawers for extra storage', category: 'Storage' },
    ],
    'Kitchen': [
      { name: 'Kitchen Island', price: '$1,500 - $3,500', description: 'Portable kitchen island with butcher block top', category: 'Storage' },
      { name: 'Bar Stools', price: '$250 - $600', description: 'Set of 3 adjustable height bar stools', category: 'Seating' },
      { name: 'Pendant Lights', price: '$200 - $500', description: 'Set of 3 geometric pendant lights', category: 'Lighting' },
      { name: 'Open Shelving', price: '$300 - $700', description: 'Floating wall shelves in reclaimed wood', category: 'Storage' },
      { name: 'Bakers Rack', price: '$200 - $400', description: 'Metal bakers rack with wine storage', category: 'Storage' },
      { name: 'Kitchen Rug', price: '$100 - $300', description: 'Stain-resistant kitchen rug with anti-fatigue mat', category: 'Rugs' },
    ],
    'Bathroom': [
      { name: 'Vanity Mirror', price: '$400 - $900', description: 'Backlit LED mirror with defogger', category: 'Fixtures' },
      { name: 'Bathroom Cabinet', price: '$500 - $1,200', description: 'Wall-mounted bathroom cabinet with mirror', category: 'Storage' },
      { name: 'Towel Warmer', price: '$300 - $600', description: 'Electric heated towel rack', category: 'Fixtures' },
      { name: 'Bath Mat', price: '$50 - $150', description: 'Luxurious bamboo bath mat', category: 'Accessories' },
      { name: 'Shower Curtain', price: '$50 - $150', description: 'Waterproof shower curtain with liner', category: 'Accessories' },
      { name: 'Bathroom Lighting', price: '$150 - $400', description: 'Vanity light fixtures with frosted glass', category: 'Lighting' },
    ],
    'Office': [
      { name: 'Executive Desk', price: '$800 - $2,000', description: 'Standing desk with electric height adjustment', category: 'Tables' },
      { name: 'Ergonomic Chair', price: '$500 - $1,200', description: 'High-back ergonomic office chair with lumbar support', category: 'Seating' },
      { name: 'Bookshelf', price: '$400 - $1,000', description: '5-tier bookshelf with industrial design', category: 'Storage' },
      { name: 'Desk Lamp', price: '$100 - $300', description: 'LED desk lamp with adjustable brightness', category: 'Lighting' },
      { name: 'File Cabinet', price: '$200 - $500', description: '3-drawer filing cabinet with lock', category: 'Storage' },
      { name: 'Area Rug', price: '$300 - $800', description: 'Durable office rug with sound absorption', category: 'Rugs' },
    ],
    'Dining Room': [
      { name: 'Dining Table', price: '$1,200 - $3,000', description: 'Solid wood dining table seats 6-8', category: 'Tables' },
      { name: 'Dining Chairs', price: '$400 - $1,000', description: 'Set of 6 upholstered dining chairs', category: 'Seating' },
      { name: 'Chandelier', price: '$300 - $800', description: 'Modern chandelier with adjustable height', category: 'Lighting' },
      { name: 'Sideboard', price: '$800 - $1,800', description: 'Buffet sideboard with serving board', category: 'Storage' },
      { name: 'Dining Rug', price: '$300 - $700', description: 'Large dining room rug to define the space', category: 'Rugs' },
      { name: 'Wall Mirror', price: '$200 - $500', description: 'Large decorative mirror to enhance space', category: 'Accessories' },
    ],
  };

  return furnitureByRoom[config.roomType] || furnitureByRoom['Living Room'];
}

export async function generateAllDesigns(config: RoomConfig): Promise<DesignResult> {
  const [imageUrl, description, furniture] = await Promise.all([
    generateRoomImage(config),
    generateDesignDescription(config),
    generateFurnitureRecommendations(config),
  ]);

  const colorPalette = generateColorPalette(config.colorScheme);

  return {
    imageUrl,
    description,
    colorPalette,
    furniture,
  };
}

export function isUsingFallback(): boolean {
  return USE_FALLBACK || hfPermissionError;
}
