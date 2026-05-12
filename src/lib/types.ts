export type Vibe =
  | "Wine Bar"
  | "Cocktail Bar"
  | "Dinner"
  | "Rooftop"
  | "Jazz Club"
  | "Activity"
  | "Comedy"
  | "Experience";

export type Budget = "€" | "€€" | "€€€";

export type Occasion =
  | "First Date"
  | "Anniversary"
  | "Friday Night"
  | "Something Different";

export type Neighborhood =
  | "Koukaki"
  | "Pangrati"
  | "Exarcheia"
  | "Kolonaki"
  | "Petralona"
  | "Kypseli"
  | "Monastiraki"
  | "Psiri"
  | "Thissio"
  | "Glyfada";

export interface Venue {
  id: string;
  name: string;
  nameLatin?: string;
  tagline: string;
  taglineEl?: string;
  neighborhood: Neighborhood;
  vibe: Vibe;
  budget: Budget;
  occasions: Occasion[];
  image: string;
  walkMin?: number;
  bookingUrl: string;
  bookingPartner: "e-table" | "TheList" | "OpenTable" | "GetYourGuide" | "Airbnb" | "Direct";
  lat: number;
  lng: number;
  sponsored?: boolean;
  tags?: string[];
}

export interface FilterState {
  neighborhood: Neighborhood | null;
  vibe: Vibe | null;
  budget: Budget | null;
  occasion: Occasion | null;
}
