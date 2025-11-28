import { Slide } from './types';

// In a real Slidev build, this data is injected or fetched.
// We are simulating the data structure provided in the prompt.
export const BASE_URL = ''; // usually just '/' or empty string for relative paths

export const MOCK_SLIDES: Slide[] = [
  { name: 'intro', path: 'guide/intro', lastModified: '2023-10-15' },
  { name: 'installation', path: 'guide/installation', lastModified: '2023-10-12' },
  { name: 'syntax', path: 'guide/syntax', lastModified: '2023-11-01' },
  { name: 'demo', path: 'demos/feature-showcase', lastModified: '2023-09-20' },
  { name: 'animation', path: 'demos/animations', lastModified: '2023-09-22' },
  { name: 'quarterly-report', path: 'reports/q3-2023', lastModified: '2023-11-10' },
  { name: 'roadmap', path: 'reports/roadmap-2024', lastModified: '2023-11-15' },
  { name: 'main', path: 'main', lastModified: '2023-12-01' },
  { name: 'components', path: 'dev/components', lastModified: '2023-08-05' },
  { name: 'layouts', path: 'dev/layouts', lastModified: '2023-08-06' },
  { name: 'theme-customization', path: 'advanced/theming', lastModified: '2023-12-05' },
];