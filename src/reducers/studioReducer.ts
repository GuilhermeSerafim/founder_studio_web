import { StudioState, StudioAction } from '@/types/studio';

export const initialState: StudioState = {
  format: 'carousel',
  profile: { name: '', handle: '', photoUrl: null },
  carousel: { slides: [''] },
  phrase: { text: '' },
  postgpt: { title: '', body: '', bullets: [''] },
  importing: false,
  imported: false,
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
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
