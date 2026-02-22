import React, { useCallback } from 'react';
import { Plus, Trash2, Upload, User } from 'lucide-react';
import type { StudioState, StudioAction } from '@/types/studio';

interface EditorPanelProps {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

const EditorPanel = React.memo(function EditorPanel({ state, dispatch }: EditorPanelProps) {
  const { format, profile, carousel, phrase, postgpt } = state;

  const handlePhoto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        dispatch({ type: 'SET_PROFILE', payload: { photoUrl: url } });
      }
    },
    [dispatch]
  );

  const updateSlide = useCallback(
    (index: number, value: string) => {
      const slides = [...carousel.slides];
      slides[index] = value;
      dispatch({ type: 'SET_CAROUSEL', payload: { slides } });
    },
    [carousel.slides, dispatch]
  );

  const addSlide = useCallback(() => {
    dispatch({ type: 'SET_CAROUSEL', payload: { slides: [...carousel.slides, ''] } });
  }, [carousel.slides, dispatch]);

  const removeSlide = useCallback(
    (index: number) => {
      if (carousel.slides.length <= 1) return;
      dispatch({ type: 'SET_CAROUSEL', payload: { slides: carousel.slides.filter((_, i) => i !== index) } });
    },
    [carousel.slides, dispatch]
  );

  const updateBullet = useCallback(
    (index: number, value: string) => {
      const bullets = [...postgpt.bullets];
      bullets[index] = value;
      dispatch({ type: 'SET_POSTGPT', payload: { ...postgpt, bullets } });
    },
    [postgpt, dispatch]
  );

  const addBullet = useCallback(() => {
    dispatch({ type: 'SET_POSTGPT', payload: { ...postgpt, bullets: [...postgpt.bullets, ''] } });
  }, [postgpt, dispatch]);

  const removeBullet = useCallback(
    (index: number) => {
      if (postgpt.bullets.length <= 1) return;
      dispatch({ type: 'SET_POSTGPT', payload: { ...postgpt, bullets: postgpt.bullets.filter((_, i) => i !== index) } });
    },
    [postgpt, dispatch]
  );

  return (
    <div className="p-4 lg:p-5 space-y-6 overflow-y-auto">
      {/* Profile */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Perfil</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label
              className="relative w-12 h-12 rounded-full bg-secondary flex items-center justify-center cursor-pointer overflow-hidden group border-2 border-border hover:border-primary transition-colors"
              aria-label="Upload de foto"
            >
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
            </label>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => dispatch({ type: 'SET_PROFILE', payload: { name: e.target.value } })}
                placeholder="Nome"
                aria-label="Nome do perfil"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
              />
              <input
                type="text"
                value={profile.handle}
                onChange={(e) => dispatch({ type: 'SET_PROFILE', payload: { handle: e.target.value } })}
                placeholder="@handle"
                aria-label="Handle do perfil"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Conteúdo</h2>

        {format === 'carousel' && (
          <div className="space-y-3">
            {carousel.slides.map((slide, i) => (
              <div key={i} className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">Slide {i + 1}</label>
                <textarea
                  value={slide}
                  onChange={(e) => updateSlide(i, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
                  aria-label={`Slide ${i + 1}`}
                />
                {carousel.slides.length > 1 && (
                  <button
                    onClick={() => removeSlide(i)}
                    aria-label={`Remover slide ${i + 1}`}
                    className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addSlide}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Adicionar slide
            </button>
          </div>
        )}

        {format === 'phrase' && (
          <textarea
            value={phrase.text}
            onChange={(e) => dispatch({ type: 'SET_PHRASE', payload: { text: e.target.value } })}
            rows={5}
            placeholder="Sua frase de efeito…"
            aria-label="Frase de efeito"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
          />
        )}

        {format === 'postgpt' && (
          <div className="space-y-3">
            <input
              type="text"
              value={postgpt.title}
              onChange={(e) => dispatch({ type: 'SET_POSTGPT', payload: { ...postgpt, title: e.target.value } })}
              placeholder="Título"
              aria-label="Título do post"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            />
            <textarea
              value={postgpt.body}
              onChange={(e) => dispatch({ type: 'SET_POSTGPT', payload: { ...postgpt, body: e.target.value } })}
              rows={4}
              placeholder="Corpo do post"
              aria-label="Corpo do post"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            />
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Bullets</label>
              {postgpt.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => updateBullet(i, e.target.value)}
                    placeholder={`Bullet ${i + 1}`}
                    aria-label={`Bullet ${i + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
                  />
                  {postgpt.bullets.length > 1 && (
                    <button onClick={() => removeBullet(i)} aria-label={`Remover bullet ${i + 1}`} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addBullet} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                <Plus className="w-4 h-4" /> Adicionar bullet
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
});

export default EditorPanel;
