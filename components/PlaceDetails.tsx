'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Globe, Award, UtensilsCrossed } from 'lucide-react';
import { Place } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlaceDetailsProps {
  place: Place;
  selected: boolean;
  refProp: React.RefObject<HTMLDivElement>;
}

export default function PlaceDetails({ place, selected, refProp }: PlaceDetailsProps) {
  useEffect(() => {
    if (selected && refProp?.current) {
      refProp.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected, refProp]);

  const imageUrl =
    place.photo?.images?.large?.url ||
    place.photo?.images?.medium?.url ||
    place.photo?.images?.small?.url ||
    'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <motion.div
      ref={refProp}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl',
          selected && 'ring-2 ring-primary-500 shadow-xl scale-[1.02]',
        )}
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          {place.awards && place.awards.length > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Award className="h-3 w-3" />
              Award Winner
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{place.name}</h3>

          <div className="flex items-center gap-4 mb-3 flex-wrap">
            {place.rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-gray-700">{place.rating}</span>
                <span className="text-gray-500 text-sm">({place.num_reviews})</span>
              </div>
            )}
            {place.price_level && (
              <div className="text-gray-600">
                {'$'.repeat(place.price_level)}
              </div>
            )}
            {place.ranking && (
              <div className="text-sm text-gray-500">#{place.ranking}</div>
            )}
          </div>

          {place.cuisine && place.cuisine.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <UtensilsCrossed className="h-4 w-4 text-gray-500" />
              {place.cuisine.slice(0, 3).map((cuisine, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                >
                  {cuisine.name}
                </span>
              ))}
            </div>
          )}

          {place.address && (
            <div className="flex items-start gap-2 mb-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{place.address}</span>
            </div>
          )}

          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </a>
            )}
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
            {place.web_url && (
              <a
                href={place.web_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>More Info</span>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

