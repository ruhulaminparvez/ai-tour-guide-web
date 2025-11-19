'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getPlacesData, getWeatherData } from '@/lib/api/travelAdvisorAPI';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import List from '@/components/List';
import { Coordinates, Bounds, Place } from '@/types';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [type, setType] = useState<string>('restaurants');
  const [rating, setRating] = useState<string>('');
  const [coords, setCoords] = useState<Coordinates>({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [weatherData, setWeatherData] = useState<{
    list?: Array<{
      main?: { temp?: number };
      weather?: Array<{ icon?: string; description?: string }>;
    }>;
  } | null>(null);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [childClicked, setChildClicked] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationLoaded, setLocationLoaded] = useState<boolean>(false);

  // Get user's current location on mount
  useEffect(() => {
    const setInitialBounds = (lat: number, lng: number) => {
      setCoords({ lat, lng });
      setBounds({
        ne: { lat: lat + 0.1, lng: lng + 0.1 },
        sw: { lat: lat - 0.1, lng: lng - 0.1 },
      });
      setLocationLoaded(true);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setInitialBounds(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a popular location if geolocation fails
          setInitialBounds(40.7128, -74.006); // New York City
        },
      );
    } else {
      // Fallback if geolocation is not supported
      setInitialBounds(40.7128, -74.006);
    }
  }, []);

  // Filter places by rating
  useEffect(() => {
    if (rating) {
      const filtered = places.filter((place) => {
        const placeRating = typeof place.rating === 'string' ? parseFloat(place.rating) : (place.rating || 0);
        return placeRating > Number(rating);
      });
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces([]);
    }
  }, [rating, places]);

  // Fetch weather data when location changes
  useEffect(() => {
    if (coords.lat && coords.lng && locationLoaded) {
      getWeatherData(coords.lat, coords.lng)
        .then((data) => {
          if (data) {
            setWeatherData(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching weather:', error);
          // Don't set weather data on error, but don't break the app
        });
    }
  }, [coords, locationLoaded]);

  // Fetch places when bounds or type changes
  useEffect(() => {
    if (coords.lat && coords.lng && locationLoaded && bounds) {
      console.log('Fetching places for:', { type, bounds });
      setIsLoading(true);

      const typeKey = type as 'hotels' | 'restaurants' | 'attractions';

      getPlacesData(typeKey, bounds.sw, bounds.ne)
        .then((data) => {
          console.log('Places fetched:', data.length);
          let filtered = data.filter((place) => place.name && place.latitude && place.longitude);
          
          // Apply rating filter if set
          if (rating) {
            const minRating = parseFloat(rating);
            filtered = filtered.filter((place) => {
              const placeRating = typeof place.rating === 'string' ? parseFloat(place.rating) : (place.rating || 0);
              return placeRating >= minRating;
            });
          }
          
          console.log('Places after filtering:', filtered.length);
          setPlaces(filtered);
          setFilteredPlaces([]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching places:', error);
          setPlaces([]);
          setFilteredPlaces([]);
          setIsLoading(false);
        });
    }
  }, [bounds, type, rating, coords, locationLoaded]);

  const onPlaceChanged = (place: Coordinates & { name?: string; locationId?: number | string; placeType?: string }) => {
    if (place && place.lat && place.lng) {
      console.log('Location selected:', { name: place.name, coords: { lat: place.lat, lng: place.lng } });
      setCoords({ lat: place.lat, lng: place.lng });
      // Reset places when location changes
      setPlaces([]);
      setFilteredPlaces([]);
      // Set default bounds immediately
      const defaultBounds = {
        ne: { lat: place.lat + 0.1, lng: place.lng + 0.1 },
        sw: { lat: place.lat - 0.1, lng: place.lng - 0.1 },
      };
      setBounds(defaultBounds);
    }
  };

  const displayPlaces = filteredPlaces.length ? filteredPlaces : places;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      <Header onPlaceChanged={onPlaceChanged} />
      <div className="container mx-auto px-4 py-6 flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <List
              isLoading={isLoading}
              childClicked={childClicked}
              places={displayPlaces}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 h-[85vh]"
          >
            <Map
              setChildClicked={setChildClicked}
              setBounds={setBounds}
              coords={coords}
              places={displayPlaces}
              weatherData={weatherData}
            />
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
