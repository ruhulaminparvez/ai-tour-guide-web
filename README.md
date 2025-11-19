# AI Tour Guide - Next.js Edition

A modern, intelligent travel guide application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Discover amazing restaurants, hotels, and attractions around you with an interactive map powered by advanced filtering and search capabilities.

## Features

- 🗺️ **Interactive Map**: View all places on an interactive map powered by Leaflet
- 🔍 **Location Search**: Search for any location worldwide using Travel Advisor API v2 autocomplete
- 🎯 **Advanced Filtering**: Filter hotels, restaurants, and attractions with comprehensive filter options
- 📊 **Detailed Information**: Get detailed information about hotels, restaurants, and attractions
- 🏨 **Hotel Booking**: View hotel details with check-in/check-out dates and room options
- 🍽️ **Restaurant Reservations**: See restaurant details with party size and reservation times
- 🎪 **Attraction Tours**: Browse attractions with date ranges and passenger information
- 📍 **Auto Geolocation**: Automatically detects your current location (with fallback)
- 🏨 **Multiple Categories**: Browse restaurants, hotels, and attractions
- ⭐ **Rating Filter**: Filter places by minimum rating
- 🌤️ **Weather Display**: See current weather conditions for the selected location
- ✨ **Modern UI**: Beautiful, responsive design with smooth animations
- 🎨 **Tailwind CSS**: Styled with Tailwind CSS and shadcn/ui components
- 🎭 **Animations**: Smooth animations powered by Framer Motion
- 🎯 **Lucide Icons**: Beautiful icons from Lucide React

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Maps**: React Leaflet
- **API**: Travel Advisor API v2 (RapidAPI), OpenWeatherMap API (via RapidAPI)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- RapidAPI account with Travel Advisor API subscription

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ruhulaminparvez/ai-tour-guide-web.git
cd ai-tour-guide-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_RAPID_API_TRAVEL_API_KEY=your_travel_api_key_here
NEXT_PUBLIC_RAPID_API_WEATHER_API_KEY=your_weather_api_key_here
```

**Important**: Replace `your_travel_api_key_here` with your actual RapidAPI key from the Travel Advisor API.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Setup

### Travel Advisor API
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Travel Advisor API](https://rapidapi.com/apidojo/api/travel-advisor)
3. Get your API key from the RapidAPI dashboard
4. Add it to `.env.local` as `NEXT_PUBLIC_RAPID_API_TRAVEL_API_KEY`

**Note**: The API key provided in examples should be replaced with your own key from RapidAPI.

### Weather API (Optional)
1. Subscribe to the [OpenWeatherMap API](https://rapidapi.com/community/api/open-weather-map) on RapidAPI
2. Get your API key and add it to `.env.local` as `NEXT_PUBLIC_RAPID_API_WEATHER_API_KEY`

## API Endpoints Used

The application uses the following Travel Advisor API v2 endpoints:

### Location APIs
1. **Auto-complete** (`GET /locations/v2/auto-complete`)
   - Used for location search autocomplete
   - Returns location suggestions with coordinates

2. **Search** (`POST /locations/v2/search`)
   - Used to search for places in a location
   - Returns restaurants, hotels, and attractions

3. **List Nearby** (`POST /locations/v2/list-nearby`)
   - Used to get places near a specific location
   - Returns places with map pins and detailed information

### Hotel APIs
4. **Hotel Filters** (`POST /hotel-filters/v2/list`)
   - Get available filters for hotels (amenities, price, rating, etc.)

5. **Hotel List** (`POST /hotels/v2/list`)
   - Get list of hotels with applied filters
   - Supports check-in/check-out dates and room configurations

6. **Hotel Details** (`POST /hotels/v2/get-details`)
   - Get detailed information about a specific hotel

### Restaurant APIs
7. **Restaurant Filters** (`POST /restaurant-filters/v2/list`)
   - Get available filters for restaurants (cuisine, price, features, etc.)

8. **Restaurant List** (`POST /restaurants/v2/list`)
   - Get list of restaurants with applied filters
   - Supports party size and reservation times

9. **Restaurant Details** (`POST /restaurants/v2/get-details`)
   - Get detailed information about a specific restaurant

### Attraction APIs
10. **Attraction Filters** (`POST /attraction-filters/v2/list`)
    - Get available filters for attractions (category, rating, tags, etc.)

11. **Attraction List** (`POST /attractions/v2/list`)
    - Get list of attractions with applied filters
    - Supports date ranges and passenger information

12. **Attraction Details** (`POST /attractions/v2/get-details`)
    - Get detailed information about a specific attraction

### Weather API
13. **Weather** (`GET /weather`)
    - Get current weather conditions for a location
    - Returns temperature, conditions, wind, and more

## Project Structure

```
project_travel_advisor/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Header.tsx          # Search header component
│   ├── List.tsx            # Places list component
│   ├── Map.tsx             # Map component
│   └── PlaceDetails.tsx   # Place card component
├── lib/
│   ├── api/               # API utilities
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Usage

1. **Search Location**: Type a location name in the search bar to find places worldwide
2. **Browse Categories**: Use the dropdown to switch between restaurants, hotels, and attractions
3. **Filter by Rating**: Select a minimum rating to filter results
4. **View on Map**: Click on any place in the list to see it highlighted on the map
5. **View Details**: Click on map markers to see place details in a popup

## Default Behavior

If no location is searched, the app will:
- Automatically detect your device location
- Show places near your current location (when available)
- Fall back to New York City if geolocation is unavailable or denied

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Make sure to set the following environment variables in `.env.local`:

- `NEXT_PUBLIC_RAPID_API_TRAVEL_API_KEY`: Your Travel Advisor API key from RapidAPI
- `NEXT_PUBLIC_RAPID_API_WEATHER_API_KEY`: (Optional) Your Weather API key from RapidAPI

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
