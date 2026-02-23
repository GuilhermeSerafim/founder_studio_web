import React, { useReducer, useCallback, useState, useRef } from 'react';
import { Layers, Quote, FileText } from 'lucide-react';
import { studioReducer, initialState } from '@/reducers/studioReducer';
import type { FormatType } from '@/types/studio';
import ImportHeader from './ImportHeader';
import FormatSidebar from './FormatSidebar';
import PostPreview from './PostPreview';
import EditorPanel from './EditorPanel';
import StudioToast from './StudioToast';

const TWITTER_MOCK = {
  format: 'carousel' as FormatType,
  profile: { name: 'Alex Hormozi', handle: 'AlexHormozi', photoUrl: null, verified: true },
  carousel: {
    slides: [
      'A maioria dos founders falha porque tenta fazer 10 coisas ao mesmo tempo.\n\nFoque em UMA coisa. Domine. Depois expanda.',
      'Seu produto não precisa ser perfeito.\n\nEle precisa resolver UM problema tão bem que as pessoas paguem por ele ANTES de você terminar.',
      'A diferença entre um founder de $10K/mês e um de $100K/mês?\n\nO segundo aprendeu a dizer NÃO para quase tudo.',
    ],
  },
};

const INSTAGRAM_MOCK = {
  format: 'phrase' as FormatType,
  profile: { name: 'Gary Vee', handle: 'garyvee', photoUrl: null, verified: true },
  phrase: { text: 'Pare de procurar atalhos. O atalho é o trabalho duro feito com consistência durante anos.' },
};

type MobileTab = 'formats' | 'preview' | 'editor';

const mobileTabs: { id: MobileTab; icon: typeof Layers; label: string }[] = [
  { id: 'formats', icon: Layers, label: 'Formatos' },
  { id: 'preview', icon: Quote, label: 'Preview' },
  { id: 'editor', icon: FileText, label: 'Editar' },
];

export default function StudioDashboard() {
  const [state, dispatch] = useReducer(studioReducer, initialState);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('preview');
  const previewCardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const handleImport = useCallback(
    (url: string) => {
      const trimmed = url.trim().toLowerCase();
      if (!trimmed) {
        showToast('Cole uma URL válida do Instagram ou Twitter.', 'error');
        return;
      }

      dispatch({ type: 'SET_IMPORTING', payload: true });

      // Simulated loading
      setTimeout(() => {
        if (trimmed.includes('twitter') || trimmed.includes('x.com')) {
          dispatch({ type: 'IMPORT_CONTENT', payload: TWITTER_MOCK });
          showToast('Conteúdo do Twitter importado!');
        } else if (trimmed.includes('instagram')) {
          dispatch({ type: 'IMPORT_CONTENT', payload: INSTAGRAM_MOCK });
          showToast('Conteúdo do Instagram importado!');
        } else {
          dispatch({ type: 'SET_IMPORTING', payload: false });
          showToast('URL não reconhecida. Use Instagram ou Twitter.', 'error');
        }
      }, 800);
    },
    [showToast]
  );

  const handleFormatSelect = useCallback((format: FormatType) => {
    dispatch({ type: 'SET_FORMAT', payload: format });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ImportHeader importing={state.importing} onImport={handleImport} />

      {/* Desktop / Tablet layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-14 lg:w-52 border-r border-border bg-card flex-shrink-0">
          <FormatSidebar selected={state.format} onSelect={handleFormatSelect} />
        </div>

        {/* Editor */}
        <div className="w-80 lg:w-[480px] xl:w-[600px] border-r border-border bg-background flex-shrink-0 overflow-y-auto">
          <EditorPanel state={state} dispatch={dispatch} previewRef={previewCardRef} />
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto bg-muted/20">
          <PostPreview ref={previewCardRef} state={state} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col flex-1 md:hidden overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {mobileTab === 'formats' && <FormatSidebar selected={state.format} onSelect={(f) => { handleFormatSelect(f); setMobileTab('preview'); }} />}
          {mobileTab === 'preview' && <PostPreview ref={previewCardRef} state={state} />}
          {mobileTab === 'editor' && <EditorPanel state={state} dispatch={dispatch} previewRef={previewCardRef} />}
        </div>

        {/* Mobile tab bar */}
        <nav className="flex border-t border-border bg-card" aria-label="Navegação mobile">
          {mobileTabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                mobileTab === id ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <StudioToast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
