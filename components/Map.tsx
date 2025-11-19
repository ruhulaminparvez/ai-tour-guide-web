'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';
import { Coordinates, Place } from '@/types';
import { Card } from '@/components/ui/card';

// Fix for default marker icons in Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  coords: Coordinates;
  places: Place[];
  setBounds: (bounds: { ne: Coordinates; sw: Coordinates }) => void;
  setChildClicked: (index: number | null) => void;
  weatherData: {
    list?: Array<{
      main?: { temp?: number };
      weather?: Array<{ icon?: string; description?: string }>;
    }>;
  } | null;
}

function MapUpdater({ coords }: { coords: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coords.lat && coords.lng) {
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);

  return null;
}

function BoundsUpdater({ setBounds }: { setBounds: (bounds: { ne: Coordinates; sw: Coordinates }) => void }) {
  const map = useMap();

  useEffect(() => {
    const updateBounds = () => {
      try {
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        setBounds({
          ne: { lat: ne.lat, lng: ne.lng },
          sw: { lat: sw.lat, lng: sw.lng },
        });
      } catch (error) {
        console.error('Error updating bounds:', error);
      }
    };

    // Wait for map to be ready
    if (map) {
      map.whenReady(() => {
        updateBounds();
      });

      map.on('moveend', updateBounds);
      map.on('zoomend', updateBounds);
    }

    return () => {
      if (map) {
        map.off('moveend', updateBounds);
        map.off('zoomend', updateBounds);
      }
    };
  }, [map, setBounds]);

  return null;
}

export default function Map({
  coords,
  places,
  setBounds,
  setChildClicked,
  weatherData,
}: MapProps) {

  if (!coords.lat || !coords.lng) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-xl border-0">
      {weatherData && weatherData.list && weatherData.list.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-40"
        >
          <Card className="p-3 bg-white/95 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3">
              {weatherData.list[0].weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/w/${weatherData.list[0].weather[0].icon}.png`}
                  alt={weatherData.list[0].weather[0].description}
                  className="w-10 h-10"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary-600" />
                  <span className="font-semibold text-gray-900">
                    {weatherData.list[0].main?.temp ? Math.round(weatherData.list[0].main.temp - 273.15) : 'N/A'}°C
                  </span>
                </div>
                <div className="text-xs text-gray-600 capitalize">
                  {weatherData.list[0].weather?.[0]?.description || 'N/A'}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater coords={coords} />
        <BoundsUpdater setBounds={setBounds} />
        {places?.map((place, i) => {
          const lat = typeof place.latitude === 'string' ? parseFloat(place.latitude) : place.latitude;
          const lng = typeof place.longitude === 'string' ? parseFloat(place.longitude) : place.longitude;

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={i}
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  setChildClicked(i);
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{place.name}</h3>
                  {place.rating && (
                    <p className="text-xs text-gray-600">⭐ {place.rating}</p>
                  )}
                  {place.address && (
                    <p className="text-xs text-gray-500 mt-1">{place.address}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

