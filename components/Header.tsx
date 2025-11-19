'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLocationAutocomplete } from '@/lib/api/travelAdvisorAPI';
import { Coordinates } from '@/types';

interface AutocompleteResult {
  lat: number;
  lng: number;
  name: string;
  locationId: number | string;
  placeType?: string;
}

interface HeaderProps {
  onPlaceChanged?: (place: Coordinates & { name?: string; locationId?: number | string; placeType?: string }) => void;
}

export default function Header({ onPlaceChanged }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<AutocompleteResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchLocationAutocomplete(query);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handlePlaceSelect = (result: AutocompleteResult) => {
    if (onPlaceChanged) {
      onPlaceChanged({
        lat: result.lat,
        lng: result.lng,
        name: result.name,
        locationId: result.locationId,
        placeType: result.placeType,
      });
    }

    setSearchQuery(result.name);
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              🤖 AI Tour
            </span>
            <span>Guide</span>
          </motion.h1>

          <div className="flex-1 max-w-2xl flex items-center gap-3">
            <div className="flex-1 relative" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 text-white/80 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-white/80" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
                />
              </div>

              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar"
                  >
                    <ul className="py-2">
                      {searchResults.map((result, index) => (
                        <motion.li
                          key={`${result.locationId}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handlePlaceSelect(result)}
                          className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3 group"
                        >
                          <MapPin className="h-5 w-5 text-primary-600 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{result.name}</div>
                            {result.placeType && (
                              <div className="text-xs text-primary-600 mt-1 capitalize">{result.placeType.toLowerCase()}</div>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.a
              href="https://ruhulaminparvez-deploy-test-tour-guide-landmark-detect-sy2fnh.streamlit.app/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 hover:from-yellow-300 hover:via-orange-300 hover:to-pink-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap border border-white/20 backdrop-blur-sm"
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="hidden sm:inline">Detect Place with AI</span>
              <span className="sm:hidden">AI</span>
            </motion.a>
          </div>
        </div>
      </div>
    </header>
  );
}
