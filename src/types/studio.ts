export type FormatType = 'carousel' | 'phrase' | 'postgpt';

export interface Profile {
  name: string;
  handle: string;
  photoUrl: string | null;
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

export interface StudioState {
  format: FormatType;
  profile: Profile;
  carousel: CarouselContent;
  phrase: PhraseContent;
  postgpt: PostGptContent;
  importing: boolean;
  imported: boolean;
}

export type StudioAction =
  | { type: 'SET_FORMAT'; payload: FormatType }
  | { type: 'SET_PROFILE'; payload: Partial<Profile> }
  | { type: 'SET_CAROUSEL'; payload: CarouselContent }
  | { type: 'SET_PHRASE'; payload: PhraseContent }
  | { type: 'SET_POSTGPT'; payload: PostGptContent }
  | { type: 'SET_IMPORTING'; payload: boolean }
  | { type: 'IMPORT_CONTENT'; payload: { format: FormatType; profile: Profile; carousel?: CarouselContent; phrase?: PhraseContent; postgpt?: PostGptContent } }
  | { type: 'RESET' };
