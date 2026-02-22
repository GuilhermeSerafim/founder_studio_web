import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import type { StudioState } from '@/types/studio';

interface PostPreviewProps {
  state: StudioState;
}

const Avatar = React.memo(function Avatar({ url, name }: { url: string | null; name: string }) {
  if (url) {
    return <img src={url} alt={name} className="w-10 h-10 rounded-full object-cover" />;
  }
  return (
    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
      <User className="w-5 h-5 text-muted-foreground" />
    </div>
  );
});

const ProfileBar = React.memo(function ProfileBar({ name, handle, photoUrl }: { name: string; handle: string; photoUrl: string | null }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar url={photoUrl} name={name} />
      <div>
        <p className="font-display font-semibold text-sm text-foreground">{name || 'Seu Nome'}</p>
        <p className="text-xs text-muted-foreground">{handle ? `@${handle}` : '@handle'}</p>
      </div>
    </div>
  );
});

const CarouselPreview = React.memo(function CarouselPreview({ slides, profile }: { slides: string[]; profile: StudioState['profile'] }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(slides.length - 1, c + 1)), [slides.length]);

  const safeSlides = slides.length > 0 ? slides : [''];

  return (
    <div className="space-y-4">
      <div className="relative bg-card rounded-xl border border-border p-6 min-h-[280px] studio-shadow-md">
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-primary" />
        <ProfileBar {...profile} />
        <p className="text-foreground whitespace-pre-wrap leading-relaxed mt-2">
          {safeSlides[current] || <span className="text-muted-foreground italic">Slide vazio…</span>}
        </p>

        {safeSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Slide anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-card border border-border hover:bg-secondary disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={current === safeSlides.length - 1}
              aria-label="Próximo slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-card border border-border hover:bg-secondary disabled:opacity-30 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {safeSlides.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary scale-125' : 'bg-border'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const PhrasePreview = React.memo(function PhrasePreview({ text, profile }: { text: string; profile: StudioState['profile'] }) {
  return (
    <div className="bg-card rounded-xl border border-border p-8 min-h-[280px] flex flex-col justify-center studio-shadow-md relative">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-accent" />
      <ProfileBar {...profile} />
      <blockquote className="font-display text-2xl font-bold text-foreground leading-snug mt-4">
        {text ? `"${text}"` : <span className="text-muted-foreground italic text-lg font-normal">Sua frase de efeito aqui…</span>}
      </blockquote>
    </div>
  );
});

const PostGptPreview = React.memo(function PostGptPreview({ title, body, bullets, profile }: { title: string; body: string; bullets: string[]; profile: StudioState['profile'] }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 min-h-[280px] studio-shadow-md relative">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-accent-orange" />
      <ProfileBar {...profile} />
      <h3 className="font-display font-bold text-lg text-foreground mt-2">
        {title || <span className="text-muted-foreground italic font-normal">Título do post…</span>}
      </h3>
      <p className="text-foreground text-sm mt-2 whitespace-pre-wrap leading-relaxed">
        {body || <span className="text-muted-foreground italic">Corpo do post…</span>}
      </p>
      {bullets.some(b => b.trim()) && (
        <ul className="mt-4 space-y-1.5">
          {bullets.filter(b => b.trim()).map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-orange flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const PostPreview = React.memo(function PostPreview({ state }: PostPreviewProps) {
  const { format, profile, carousel, phrase, postgpt } = state;

  if (!state.imported && !profile.name) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-display font-semibold text-foreground">Nenhum conteúdo ainda</p>
        <p className="text-sm text-muted-foreground mt-1">Cole uma URL acima para importar ou comece a editar</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Preview</p>
      {format === 'carousel' && <CarouselPreview slides={carousel.slides} profile={profile} />}
      {format === 'phrase' && <PhrasePreview text={phrase.text} profile={profile} />}
      {format === 'postgpt' && <PostGptPreview {...postgpt} profile={profile} />}
    </div>
  );
});

// Need Layers for empty state
import { Layers } from 'lucide-react';

export default PostPreview;
