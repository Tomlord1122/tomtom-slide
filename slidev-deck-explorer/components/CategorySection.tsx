import React from 'react';
import { Slide } from '../types';
import SlideCard from './SlideCard';
import { FolderIcon } from './Icon';

interface CategorySectionProps {
  title: string;
  slides: Slide[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, slides }) => {
  if (slides.length === 0) return null;

  return (
    <div className="mb-12 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <FolderIcon className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-slate-200 tracking-tight">
          {title}
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-slate-700 to-transparent ml-4"></div>
        <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
          {slides.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {slides.map((slide) => (
          <SlideCard key={slide.path} slide={slide} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;