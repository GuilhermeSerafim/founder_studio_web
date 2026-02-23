export type FormatType = 'carousel' | 'phrase' | 'postgpt';
export type CardBackground = 'light' | 'dark';

export interface Profile {
  name: string;
  handle: string;
  photoUrl: string | null;
  verified: boolean;
}

export interface CarouselContent {
  slides: string[];
}

export interface PhraseContent {
  text: string;
}

export interface PostGptContent {
  title: string;
  body: string;
  bullets: string[];
}

export interface SavedPost {
  id: string;
  label: string;
  format: FormatType;
  profile: Profile;
  carousel: CarouselContent;
  phrase: PhraseContent;
  postgpt: PostGptContent;
  cardBackground: CardBackground;
  createdAt: number;
}

export interface StudioState {
  format: FormatType;
  profile: Profile;
  carousel: CarouselContent;
  phrase: PhraseContent;
  postgpt: PostGptContent;
  cardBackground: CardBackground;
  importing: boolean;
  imported: boolean;
  savedPosts: SavedPost[];
}

export type StudioAction =
  | { type: 'SET_FORMAT'; payload: FormatType }
  | { type: 'SET_PROFILE'; payload: Partial<Profile> }
  | { type: 'SET_CAROUSEL'; payload: CarouselContent }
  | { type: 'SET_PHRASE'; payload: PhraseContent }
  | { type: 'SET_POSTGPT'; payload: PostGptContent }
  | { type: 'SET_CARD_BG'; payload: CardBackground }
  | { type: 'SET_IMPORTING'; payload: boolean }
  | { type: 'IMPORT_CONTENT'; payload: { format: FormatType; profile: Profile; carousel?: CarouselContent; phrase?: PhraseContent; postgpt?: PostGptContent } }
  | { type: 'SAVE_POST' }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'LOAD_POST'; payload: string }
  | { type: 'RESET' };
