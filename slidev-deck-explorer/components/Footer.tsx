import React from 'react';

interface FooterProps {
  totalSlides: number;
  totalCategories: number;
}

const Footer: React.FC<FooterProps> = ({ totalSlides, totalCategories }) => {
  return (
    <footer className="mt-20 border-t border-slate-800 pt-8 pb-12 text-center text-slate-500">
      <p className="flex items-center justify-center gap-2 mb-2">
        <span className="font-semibold text-slate-400">{totalSlides}</span> decks available across
        <span className="font-semibold text-slate-400">{totalCategories}</span> categories
      </p>
      <p className="text-xs opacity-60">Powered by Slidev Explorer</p>
    </footer>
  );
};

export default Footer;