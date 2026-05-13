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
  no?: number;           // editorial BAM number e.g. 14
  name: string;
  nameLatin?: string;
  tagline: string;       // the "why it's date-worthy" one-liner
  taglineEl?: string;
  note?: string;         // BAM Notes — founder voice
  neighborhood: Neighborhood;
  vibe: Vibe;
  budget: Budget;
  occasions: Occasion[];
  image: string;
  openNow?: boolean;
  hours?: string;        // e.g. "19:00 – 02:00"
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
  openNow: boolean;
  walk: number | null;   // max walk minutes
}
