import React from 'react';
import { Slide } from '../types';
import { BASE_URL } from '../constants';
import { formatTitle } from '../services/slideService';
import { ArrowRightIcon, ClockIcon, PresentationIcon } from './Icon';

interface SlideCardProps {
  slide: Slide;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide }) => {
  const formattedTitle = formatTitle(slide.name);
  const href = `${BASE_URL}/${slide.path}/`.replace('//', '/');

  return (
    <a
      href={href}
      className="group relative flex flex-col h-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>

      <div className="flex items-start justify-between mb-4 z-10">
        <div className="p-3 bg-slate-700/50 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors duration-300">
          <PresentationIcon className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
        {formattedTitle}
      </h3>
      
      <div className="flex-grow">
        <code className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-800 break-all">
           /{slide.path}
        </code>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-400 border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="text-xs">{slide.lastModified || 'Recently'}</span>
        </div>
        
        <div className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <span className="font-medium">Open</span>
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};

export default SlideCard;