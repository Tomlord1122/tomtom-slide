export interface Slide {
  name: string;
  path: string;
  lastModified?: string; // Optional metadata for a richer UI
  thumbnail?: string;    // Optional thumbnail URL
}

export interface GroupedSlides {
  [category: string]: Slide[];
}

export type SortOption = 'name' | 'path';