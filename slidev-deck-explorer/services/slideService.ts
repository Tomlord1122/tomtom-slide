import { Slide, GroupedSlides } from '../types';
import { MOCK_SLIDES } from '../constants';

// Simulating an async fetch operation
export const fetchSlides = async (): Promise<Slide[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SLIDES);
    }, 600); // Simulate network latency for loading state
  });
};

export const formatTitle = (pathOrName: string): string => {
  // Extract filename if it's a path
  const parts = pathOrName.split('/');
  const filename = parts[parts.length - 1];
  
  return filename
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const groupSlidesByCategory = (slides: Slide[]): GroupedSlides => {
  const grouped: GroupedSlides = {};

  slides.forEach(slide => {
    const parts = slide.path.split('/');
    // If path is like "guide/intro", category is "guide". 
    // If path is "intro", category is "General" (or Main)
    let category = parts.length > 1 ? parts[0] : 'General';
    
    // Capitalize category
    category = category.charAt(0).toUpperCase() + category.slice(1);

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(slide);
  });

  return grouped;
};