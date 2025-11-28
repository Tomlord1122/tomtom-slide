import React, { useState, useEffect, useMemo } from 'react';
import { Slide } from './types';
import { fetchSlides, groupSlidesByCategory } from './services/slideService';
import SearchBar from './components/SearchBar';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    fetchSlides().then((data) => {
      setSlides(data);
      setLoading(false);
    });
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.querySelector('input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtering Logic
  const filteredSlides = useMemo(() => {
    if (!searchTerm) return slides;
    const lowerTerm = searchTerm.toLowerCase();
    return slides.filter(
      (slide) =>
        slide.name.toLowerCase().includes(lowerTerm) ||
        slide.path.toLowerCase().includes(lowerTerm)
    );
  }, [slides, searchTerm]);

  // Grouping Logic
  const groupedSlides = useMemo(() => {
    return groupSlidesByCategory(filteredSlides);
  }, [filteredSlides]);

  const categories = Object.keys(groupedSlides).sort();

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/0 to-slate-900/0 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="text-center mb-16 relative">
          <div className="inline-block mb-4 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium border border-indigo-500/20">
            Slidev Dashboard
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">
              Your Presentations
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse, search, and manage your markdown-based slide decks in one beautiful interface.
          </p>
        </header>

        {/* Search */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 animate-pulse">Loading library...</p>
          </div>
        ) : filteredSlides.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No slides found</h3>
            <p className="text-slate-500">
              We couldn't find any presentations matching "{searchTerm}"
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategorySection
                key={category}
                title={category}
                slides={groupedSlides[category]}
              />
            ))}
          </div>
        )}

        <Footer 
          totalSlides={filteredSlides.length} 
          totalCategories={categories.length} 
        />
      </div>
    </div>
  );
};

export default App;