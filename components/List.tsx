'use client';

import { useState, useEffect, createRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, UtensilsCrossed, Hotel, MapPin, Star } from 'lucide-react';
import { Place } from '@/types';
import PlaceDetails from './PlaceDetails';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

interface ListProps {
  places: Place[];
  type: string;
  setType: (type: string) => void;
  rating: string;
  setRating: (rating: string) => void;
  childClicked: number | null;
  isLoading: boolean;
}

const typeIcons = {
  restaurants: UtensilsCrossed,
  hotels: Hotel,
  attractions: MapPin,
};

const typeLabels = {
  restaurants: 'Restaurants',
  hotels: 'Hotels',
  attractions: 'Attractions',
};

export default function List({
  places,
  type,
  setType,
  rating,
  setRating,
  childClicked,
  isLoading,
}: ListProps) {
  const [elRefs, setElRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    setElRefs((refs) =>
      Array(places.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef<HTMLDivElement>()),
    );
  }, [places]);

  const TypeIcon = typeIcons[type as keyof typeof typeIcons] || MapPin;

  return (
    <Card className="h-[85vh] overflow-hidden flex flex-col shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="p-2 bg-primary-100 rounded-lg">
            <TypeIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Discover Amazing Places
            </CardTitle>
            <CardDescription className="mt-1">
              Find the best {typeLabels[type as keyof typeof typeLabels] || 'places'} around you
            </CardDescription>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="h-16 w-16 text-primary-600" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 font-medium text-lg"
            >
              Exploring places...
            </motion.p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full"
                >
                  <option value="restaurants">🍽️ Restaurants</option>
                  <option value="hotels">🏨 Hotels</option>
                  <option value="attractions">🎯 Attractions</option>
                </Select>
              </div>

              <div className="flex-1">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <Select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full"
                >
                  <option value="">⭐ All Ratings</option>
                  <option value="3">⭐ 3.0+</option>
                  <option value="4">⭐ 4.0+</option>
                  <option value="4.5">⭐ 4.5+</option>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {places?.length > 0 ? (
                places.map((place, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <PlaceDetails
                      selected={Number(childClicked) === i}
                      refProp={elRefs[i]}
                      place={place}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No places found</h3>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your filters or search in a different area
                  </p>
                </motion.div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

