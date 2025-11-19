// Type definitions for the AI Tour Guide application

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bounds {
  ne: Coordinates;
  sw: Coordinates;
}

// New API Types
export interface LocationAutocompleteResult {
  __typename: string;
  documentId: string;
  detailsV2?: {
    __typename: string;
    locationId: number;
    isGeo: boolean;
    placeType: string;
    names: {
      __typename: string;
      name: string;
      longOnlyHierarchyTypeaheadV2: string;
    };
    geocode: {
      __typename: string;
      latitude: number;
      longitude: number;
    };
    contact?: {
      __typename: string;
      streetAddress?: {
        __typename: string;
        street1: string;
      };
    };
  };
  image?: {
    __typename: string;
    photo: {
      __typename: string;
      photoSizeDynamic?: {
        __typename: string;
        urlTemplate: string;
      };
      photoSizes?: Array<{
        __typename: string;
        height: number;
        width: number;
        url: string;
      }>;
    };
  };
}

export interface AutocompleteResponse {
  data: {
    Typeahead_autocomplete: {
      __typename: string;
      resultsId: string;
      results: LocationAutocompleteResult[];
    };
  };
}

export interface SearchCard {
  __typename: string;
  singleCardContent?: {
    __typename: string;
    cardTitle: {
      string: string;
    };
    primaryInfo?: {
      text: string;
    };
    bubbleRating?: {
      rating: number;
      numberReviews: {
        string: string;
      };
    };
    cardPhoto?: {
      sizes: {
        urlTemplate: string;
      };
    };
    cardLink?: {
      route: {
        typedParams: {
          geoId?: number;
          contentId?: string;
          contentType?: string;
        };
      };
    };
  };
}

export interface SearchResponse {
  data: {
    AppPresentation_queryAppSearch: {
      sections: SearchCard[];
    };
  };
}

export interface MapPin {
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  trackingKey: string;
  icon?: {
    activeName: string;
    name: string;
  };
}

export interface NearbyPlace {
  trackingKey: string;
  cardTitle: {
    string: string;
  };
  primaryInfo?: {
    text: string;
  };
  bubbleRating?: {
    rating: number;
    numberReviews: {
      string: string;
    };
  };
  distance?: {
    string: string;
  };
  cardPhoto?: {
    sizes: {
      urlTemplate: string;
    };
  };
  cardLink?: {
    route: {
      typedParams: {
        contentId: string;
        contentType: string;
      };
    };
  };
}

export interface NearbyResponse {
  data: {
    AppPresentation_queryNearToALocation: {
      mapSections: Array<{
        pins: MapPin[];
        content?: NearbyPlace[];
      }>;
    };
  };
}

// Legacy types for compatibility
export interface PlacePhoto {
  images: {
    large: {
      url: string;
    };
    medium?: {
      url: string;
    };
    small?: {
      url: string;
    };
  };
}

export interface PlaceCuisine {
  name: string;
}

export interface PlaceAward {
  display_name: string;
  images: {
    small: string;
  };
}

export interface Place {
  name: string;
  latitude: string | number;
  longitude: string | number;
  rating?: string | number;
  num_reviews: number;
  price_level?: number;
  ranking?: string;
  photo?: PlacePhoto;
  cuisine?: PlaceCuisine[];
  awards?: PlaceAward[];
  address?: string;
  phone?: string;
  web_url?: string;
  website?: string;
  contentId?: string;
  contentType?: string;
  distance?: string;
}

export interface WeatherCoord {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like?: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg?: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherSys {
  type?: number;
  id?: number;
  message?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherItem {
  coord: WeatherCoord;
  weather: WeatherCondition[];
  main?: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
}

// Single weather response from /weather endpoint
export interface WeatherResponse {
  coord: WeatherCoord;
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility?: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Legacy WeatherData for backward compatibility (used by /find endpoint)
export interface WeatherData {
  list: WeatherItem[];
  cod?: string;
  message?: string;
}

// Hotel Filter API Types
export interface HotelFilterRequest {
  geoId: number;
  checkIn?: string; // Format: YYYY-MM-DD
  checkOut?: string; // Format: YYYY-MM-DD
  sort?: string; // e.g., "PRICE_LOW_TO_HIGH"
  sortOrder?: 'asc' | 'desc';
  filters?: Array<{
    id: string;
    value: string[];
  }>;
  rooms?: Array<{
    adults: number;
    childrenAges?: number[];
  }>;
}

export interface LocalizedString {
  __typename: string;
  string: string;
  debugValueKey?: string | null;
}

export interface Tooltip {
  __typename: string;
  icon?: string;
  labelText?: string | null;
  popUpText?: LocalizedString;
  dialog?: {
    __typename: string;
    dialogType: string;
    title?: string | null;
    content?: {
      __typename: string;
      htmlString: string;
    };
    buttonV2?: {
      __typename: string;
      commerceTrackingUrl?: string | null;
      link?: {
        __typename: string;
        externalUrl: string;
        text: LocalizedString;
        accessibilityString?: string | null;
        trackingContext?: string;
      };
      variant?: string;
    };
  };
}

export interface TagInformation {
  __typename: string;
  localizedName: string;
  tagId: number;
}

export interface FilterValue {
  __typename: string;
  text?: string;
  tag?: TagInformation;
}

export interface EnumeratedValueWithCount {
  __typename: string;
  count?: number | null;
  value: string;
  isSelected: boolean;
  object: FilterValue;
  selectedAccessibilityString: LocalizedString;
  unselectedAccessibilityString: LocalizedString;
}

export interface FilterReferenceWithCount {
  __typename: string;
  count?: number | null;
  filterName: string;
  isSelected: boolean;
  value: string;
  object: {
    __typename: string;
    tag: TagInformation;
  };
  selectedAccessibilityString: LocalizedString;
  unselectedAccessibilityString: LocalizedString;
}

export interface MultiValueFilter {
  __typename: 'AppPresentation_MultiValueFilter';
  trackingKey: string;
  trackingTitle: string;
  title: string;
  name: string;
  surfaces: string[];
  tooltip?: Tooltip | null;
  values: EnumeratedValueWithCount[];
}

export interface RangedSliderFilter {
  __typename: 'AppPresentation_RangedSliderFilter';
  trackingKey: string;
  trackingTitle: string;
  name: string;
  title?: string | null;
  filterType: string;
  minValue: number;
  maxValue: number;
  selectedRangeStart: number;
  selectedRangeEnd: number;
  surfaces: string[];
  collapsed: boolean;
  tooltip?: Tooltip | null;
}

export interface ReferenceFilter {
  __typename: 'AppPresentation_ReferenceFilter';
  trackingKey: string;
  trackingTitle: string;
  title: string;
  name: string;
  surfaces: string[];
  tooltip?: Tooltip | null;
  values: FilterReferenceWithCount[];
}

export type FilterGroup = MultiValueFilter | RangedSliderFilter | ReferenceFilter;

export interface StandardFilterGroup {
  __typename: string;
  name: string;
  groupType: string;
  tooltip?: Tooltip | null;
  filters: FilterGroup[];
}

export interface FilterResponse {
  __typename: string;
  showAllText: LocalizedString;
  availableFilterGroups: StandardFilterGroup[];
}

export interface ImpressionLog {
  __typename: string;
  data: string;
}

export interface QueryAppListResponse {
  __typename: string;
  impressions: ImpressionLog[];
  filters: FilterResponse;
}

export interface HotelFilterResponse {
  data: {
    AppPresentation_queryAppListV2: QueryAppListResponse[];
  };
}

// Restaurant Filter API Types
export interface RestaurantFilterRequest {
  geoId: number;
  partySize?: number;
  reservationTime?: string; // Format: YYYY-MM-DDTHH:mm (e.g., "2022-03-07T20:00")
  sort?: string; // e.g., "RELEVANCE"
  sortOrder?: 'asc' | 'desc';
  filters?: Array<{
    id: string;
    value: string[];
  }>;
}

export interface RestaurantFilterResponse {
  data: {
    AppPresentation_queryAppListV2: QueryAppListResponse[];
  };
}

// Attraction Filter API Types
export interface AttractionPax {
  ageBand: string; // e.g., "ADULT"
  count: number;
}

export interface AttractionFilterRequest {
  geoId: number;
  startDate?: string; // Format: YYYY-MM-DD (e.g., "2022-03-10")
  endDate?: string; // Format: YYYY-MM-DD (e.g., "2022-03-15")
  pax?: AttractionPax[]; // Array of age band selections
  sort?: string; // e.g., "TRAVELER_FAVORITE_V2"
  sortOrder?: 'asc' | 'desc';
  filters?: Array<{
    id: string;
    value: string[];
  }>;
  boundingBox?: {
    northEastCorner: {
      latitude: number;
      longitude: number;
    };
    southWestCorner: {
      latitude: number;
      longitude: number;
    };
  };
  updateToken?: string;
}

export interface AttractionFilterResponse {
  data: {
    AppPresentation_queryAppListV2: QueryAppListResponse[];
  };
}
