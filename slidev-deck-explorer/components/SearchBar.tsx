import React from 'react';
import { SearchIcon } from './Icon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative group w-full max-w-2xl mx-auto mb-12">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative flex items-center bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl">
        <div className="pl-4 text-slate-400">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search presentations..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 px-4 py-4 rounded-xl focus:outline-none focus:ring-0 text-lg"
          autoFocus
        />
        <div className="pr-4">
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-700 rounded-md border border-slate-600">
            /
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;