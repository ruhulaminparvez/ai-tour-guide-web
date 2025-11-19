/* eslint-disable consistent-return */
import axios from 'axios';
import { Place, Coordinates } from '@/types';

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_TRAVEL_API_KEY;
const RAPID_API_HOST = 'travel-advisor.p.rapidapi.com';

// Simple autocomplete using OpenStreetMap Nominatim (free, no API key needed)
export const searchLocationAutocomplete = async (query: string) => {
  try {
    if (query.length < 3) return [];

    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'AI Tour Guide App',
      },
    });

    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      name: item.display_name,
      locationId: item.place_id,
      placeType: item.type || 'location',
    }));
  } catch (error) {
    console.error('Error fetching autocomplete:', error);
    return [];
  }
};

// Get places data using list-in-boundary endpoint
export const getPlacesData = async (
  type: 'restaurants' | 'hotels' | 'attractions',
  sw: Coordinates,
  ne: Coordinates,
): Promise<Place[]> => {
  try {
    const { data } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
        },
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': RAPID_API_HOST,
        },
      },
    );

    // Transform the response to Place format
    // Handle both { data: { data: [...] } } and { data: [...] } structures
    const placesArray = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

    if (placesArray.length > 0) {
      return placesArray
        .filter((item: any) => item && (item.latitude || item.lat) && (item.longitude || item.lng))
        .map((item: any) => ({
          name: item.name || 'Unknown',
          latitude: item.latitude || item.lat || 0,
          longitude: item.longitude || item.lng || 0,
          rating: item.rating || 0,
          num_reviews: item.num_reviews || 0,
          address: item.address || item.address_obj?.street1 || item.address_string || '',
          photo: item.photo
            ? {
              images: {
                large: {
                  url: item.photo.images?.large?.url || item.photo.images?.original?.url || item.photo.images?.medium?.url || '',
                },
              },
            }
            : undefined,
          contentId: item.location_id?.toString() || item.locationId?.toString() || '',
          contentType: type === 'restaurants' ? 'restaurant' : type === 'hotels' ? 'hotel' : 'attraction',
          distance: item.distance,
        }));
    }

    return [];
  } catch (error: any) {
    console.error(`Error fetching ${type}:`, error?.response?.data || error?.message || error);
    return [];
  }
};

// Get weather data using /find endpoint
export const getWeatherData = async (lat: number | undefined, lng: number | undefined) => {
  try {
    if (lat && lng) {
      const weatherApiKey = process.env.NEXT_PUBLIC_RAPID_API_WEATHER_API_KEY;

      if (!weatherApiKey) {
        console.warn('Weather API key not found');
        return null;
      }

      const { data } = await axios.get('https://community-open-weather-map.p.rapidapi.com/find', {
        params: { lat, lon: lng },
        headers: {
          'x-rapidapi-key': weatherApiKey,
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        },
      });

      return data;
    }
  } catch (error: any) {
    console.error('Error fetching weather data:', error?.response?.data || error?.message || error);
    return null;
  }
};
