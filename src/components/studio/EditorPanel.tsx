import React, { useCallback, useRef, useState } from 'react';
import { Plus, Trash2, Upload, User, Camera, RotateCcw, Save, Download, Edit3, Trash } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { StudioState, StudioAction, CardBackground } from '@/types/studio';
import ImageCropper from './ImageCropper';

interface EditorPanelProps {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `há ${days}d`;
  const weeks = Math.floor(days / 7);
  return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;
}

const BG_OPTIONS: { value: CardBackground; label: string; className: string }[] = [
  { value: 'dark', label: 'Escuro', className: 'bg-[#15202b]' },
  { value: 'light', label: 'Claro', className: 'bg-white border-2 border-border' },
];

const EditorPanel = React.memo(function EditorPanel({ state, dispatch, previewRef }: EditorPanelProps) {
  const { format, profile, carousel, phrase, postgpt, cardBackground, savedPosts } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const handlePhoto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setCropImageSrc(url);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    []
  );

  const handleCropComplete = useCallback((croppedUrl: string) => {
    dispatch({ type: 'SET_PROFILE', payload: { photoUrl: croppedUrl } });
    setCropImageSrc(null);
  }, [dispatch]);

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

  const handleDownload = useCallback(async () => {
    if (!previewRef?.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        width: 1170,
        height: 1560,
        pixelRatio: 1,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `tweet-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  }, [previewRef]);

  return (
    <div className="p-5 lg:p-6 space-y-6 overflow-y-auto">
      {/* ──── Perfil ──── */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Perfil</h2>
        <div className="space-y-3">
          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <label
              className="relative w-16 h-16 rounded-full bg-secondary/60 flex flex-col items-center justify-center cursor-pointer overflow-hidden group border-2 border-dashed border-border hover:border-primary transition-colors"
              aria-label="Upload de foto"
            >
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight text-center">JPG/PNG</span>
                </>
              )}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handlePhoto} className="sr-only" />
            </label>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => dispatch({ type: 'SET_PROFILE', payload: { name: e.target.value } })}
                placeholder="Nome de Exibição"
                aria-label="Nome de Exibição"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
              />
              <input
                type="text"
                value={profile.handle}
                onChange={(e) => dispatch({ type: 'SET_PROFILE', payload: { handle: e.target.value } })}
                placeholder="Nome de Usuário"
                aria-label="Nome de Usuário"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──── Criar Tweet ──── */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Criar Tweet</h2>

        {format === 'carousel' && (
          <div className="space-y-3">
            {carousel.slides.map((slide, i) => (
              <div key={i} className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {carousel.slides.length > 1 ? `Slide ${i + 1}` : 'Texto do Tweet'}
                </label>
                <textarea
                  value={slide}
                  onChange={(e) => updateSlide(i, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
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
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
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
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            />
            <textarea
              value={postgpt.body}
              onChange={(e) => dispatch({ type: 'SET_POSTGPT', payload: { ...postgpt, body: e.target.value } })}
              rows={4}
              placeholder="Corpo do post"
              aria-label="Corpo do post"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
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

      {/* ──── Opções (selo + fundo) ──── */}
      <section className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Verified toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={profile.verified}
            onChange={(e) => dispatch({ type: 'SET_PROFILE', payload: { verified: e.target.checked } })}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
          />
          <span className="text-sm text-foreground">Selo verificado</span>
        </label>

        {/* Background selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">Fundo:</span>
          {BG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch({ type: 'SET_CARD_BG', payload: opt.value })}
              aria-label={`Fundo ${opt.label}`}
              className={`w-7 h-7 rounded-md transition-all ${opt.className} ${
                cardBackground === opt.value
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ──── Action buttons ──── */}
      <section className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => dispatch({ type: 'SAVE_POST' })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Salvar
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" /> Baixar
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Resetar
        </button>
      </section>

      {/* ──── Posts Salvos ──── */}
      {savedPosts.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Posts Salvos</h2>
          <div className="space-y-2">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{post.label}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => dispatch({ type: 'LOAD_POST', payload: post.id })}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label="Editar post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_POST', payload: post.id })}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Excluir post"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* ──── Image Cropper Modal ──── */}
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
});

export default EditorPanel;
