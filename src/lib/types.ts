export interface RoomConfig {
  roomType: string;
  style: string;
  colorScheme: string;
  budget: string;
  size: string;
}

export interface DesignResult {
  imageUrl: string | null;
  description: string | null;
  colorPalette: ColorPalette | null;
  furniture: FurnitureItem[];
}

export interface ColorPalette {
  colors: Color[];
}

export interface Color {
  hex: string;
  name: string;
}

export interface FurnitureItem {
  name: string;
  price: string;
  description: string;
  category: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface GenerationProgress {
  image: LoadingState;
  description: LoadingState;
  colors: LoadingState;
  furniture: LoadingState;
}
