import { StudioState, StudioAction, SavedPost } from '@/types/studio';

const STORAGE_KEY = 'studio-saved-posts';

function loadSavedPosts(): SavedPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistPosts(posts: SavedPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch { /* storage full — silently fail */ }
}

export const initialState: StudioState = {
  format: 'carousel',
  profile: { name: '', handle: '', photoUrl: null, verified: true },
  carousel: { slides: [''] },
  phrase: { text: '' },
  postgpt: { title: '', body: '', bullets: [''] },
  cardBackground: 'light',
  importing: false,
  imported: false,
  savedPosts: loadSavedPosts(),
};

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_FORMAT':
      return { ...state, format: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'SET_CAROUSEL':
      return { ...state, carousel: action.payload };
    case 'SET_PHRASE':
      return { ...state, phrase: action.payload };
    case 'SET_POSTGPT':
      return { ...state, postgpt: action.payload };
    case 'SET_CARD_BG':
      return { ...state, cardBackground: action.payload };
    case 'SET_IMPORTING':
      return { ...state, importing: action.payload };
    case 'IMPORT_CONTENT':
      return {
        ...state,
        format: action.payload.format,
        profile: action.payload.profile,
        carousel: action.payload.carousel ?? state.carousel,
        phrase: action.payload.phrase ?? state.phrase,
        postgpt: action.payload.postgpt ?? state.postgpt,
        importing: false,
        imported: true,
      };
    case 'SAVE_POST': {
      const label =
        state.format === 'carousel'
          ? state.carousel.slides[0]?.slice(0, 50) || 'Carrossel sem título'
          : state.format === 'phrase'
          ? state.phrase.text.slice(0, 50) || 'Frase sem título'
          : state.postgpt.title.slice(0, 50) || 'Post sem título';
      const newPost: SavedPost = {
        id: crypto.randomUUID(),
        label,
        format: state.format,
        profile: { ...state.profile },
        carousel: { ...state.carousel },
        phrase: { ...state.phrase },
        postgpt: { ...state.postgpt },
        cardBackground: state.cardBackground,
        createdAt: Date.now(),
      };
      const posts = [newPost, ...state.savedPosts];
      persistPosts(posts);
      return { ...state, savedPosts: posts };
    }
    case 'DELETE_POST': {
      const posts = state.savedPosts.filter((p) => p.id !== action.payload);
      persistPosts(posts);
      return { ...state, savedPosts: posts };
    }
    case 'LOAD_POST': {
      const post = state.savedPosts.find((p) => p.id === action.payload);
      if (!post) return state;
      return {
        ...state,
        format: post.format,
        profile: { ...post.profile },
        carousel: { ...post.carousel },
        phrase: { ...post.phrase },
        postgpt: { ...post.postgpt },
        cardBackground: post.cardBackground,
        imported: true,
      };
    }
    case 'RESET':
      return { ...initialState, savedPosts: state.savedPosts };
    default:
      return state;
  }
}
