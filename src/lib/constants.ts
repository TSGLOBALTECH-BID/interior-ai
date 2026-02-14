export const ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
  'Dining Room',
];

export const STYLES = [
  'Modern Minimalist',
  'Scandinavian',
  'Industrial',
  'Bohemian',
  'Art Deco',
  'Japanese Zen',
  'Mediterranean',
  'Contemporary',
];

export const COLOR_SCHEMES = [
  'Neutral',
  'Warm Earth Tones',
  'Cool Blues',
  'Bold & Vibrant',
  'Monochromatic',
  'Pastel',
];

export const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $15,000',
  '$15,000+',
];

export const ROOM_SIZES = [
  { label: 'Small (10x10)', value: 'small' },
  { label: 'Medium (15x15)', value: 'medium' },
  { label: 'Large (20x20)', value: 'large' },
  { label: 'XL (30x30)', value: 'xl' },
];

export const DEFAULT_CONFIG = {
  roomType: 'Living Room',
  style: 'Modern Minimalist',
  colorScheme: 'Neutral',
  budget: '$5,000 - $15,000',
  size: 'Medium (15x15)',
};

export const COLOR_PALETTES: Record<string, { hex: string; name: string }[]> = {
  'Neutral': [
    { hex: '#F5F5F5', name: 'Snow White' },
    { hex: '#E0E0E0', name: 'Silver' },
    { hex: '#BDBDBD', name: 'Taupe Gray' },
    { hex: '#757575', name: 'Charcoal' },
    { hex: '#424242', name: 'Graphite' },
  ],
  'Warm Earth Tones': [
    { hex: '#D4A574', name: 'Sandy Beige' },
    { hex: '#C19A6B', name: 'Camel' },
    { hex: '#8B4513', name: 'Saddle Brown' },
    { hex: '#A0522D', name: 'Sienna' },
    { hex: '#654321', name: 'Dark Brown' },
  ],
  'Cool Blues': [
    { hex: '#E3F2FD', name: 'Ice Blue' },
    { hex: '#90CAF9', name: 'Sky Blue' },
    { hex: '#42A5F5', name: 'Ocean Blue' },
    { hex: '#1565C0', name: 'Navy' },
    { hex: '#0D47A1', name: 'Midnight Blue' },
  ],
  'Bold & Vibrant': [
    { hex: '#E91E63', name: 'Hot Pink' },
    { hex: '#FF5722', name: 'Deep Orange' },
    { hex: '#FFEB3B', name: 'Bright Yellow' },
    { hex: '#4CAF50', name: 'Vibrant Green' },
    { hex: '#2196F3', name: 'Electric Blue' },
  ],
  'Monochromatic': [
    { hex: '#FAFAFA', name: 'Almost White' },
    { hex: '#F5F5F5', name: 'Light Gray' },
    { hex: '#E0E0E0', name: 'Medium Gray' },
    { hex: '#9E9E9E', name: 'Dark Gray' },
    { hex: '#212121', name: 'Near Black' },
  ],
  'Pastel': [
    { hex: '#FFCDD2', name: 'Pastel Pink' },
    { hex: '#F8BBD9', name: 'Pastel Lavender' },
    { hex: '#C5CAE9', name: 'Pastel Blue' },
    { hex: '#B2DFDB', name: 'Pastel Mint' },
    { hex: '#FFF9C4', name: 'Pastel Yellow' },
  ],
};

export const STYLE_DESCRIPTIONS: Record<string, string> = {
  'Modern Minimalist': 'Clean lines, open spaces, functional furniture, neutral colors with bold accents',
  'Scandinavian': 'Light woods, cozy textiles, natural materials, white and cream palette',
  'Industrial': 'Exposed brick, metal fixtures, raw materials, vintage aesthetics',
  'Bohemian': 'Eclectic mix, vibrant patterns, plants, layered textiles, global influences',
  'Art Deco': 'Geometric patterns, bold colors, luxurious materials, symmetrical designs',
  'Japanese Zen': 'Minimalist, natural elements, low furniture, calming neutral tones',
  'Mediterranean': 'Terracotta, blue accents, wrought iron, textured walls, warm vibes',
  'Contemporary': 'Current trends, mixed materials, neutral base with bold statements',
};
