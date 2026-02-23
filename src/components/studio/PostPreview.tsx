import React, { useState, useCallback, forwardRef } from 'react';
import { ChevronLeft, ChevronRight, User, Layers } from 'lucide-react';
import type { StudioState, CardBackground } from '@/types/studio';

interface PostPreviewProps {
  state: StudioState;
}

/* ─── Avatar ─── */
const Avatar = React.memo(function Avatar({ url, name }: { url: string | null; name: string }) {
  if (url) {
    return <img src={url} alt={name} className="w-12 h-12 rounded-full object-cover" />;
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
      <User className="w-6 h-6 text-gray-400" />
    </div>
  );
});

/* ─── Verified Badge ─── */
const TwitterVerifiedBadge = () => (
  <svg viewBox="0 0 22 22" aria-label="Conta verificada" role="img" className="w-[1.25em] h-[1.25em] text-[#1D9BF0]" fill="currentColor">
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
  </svg>
);

/* ─── Profile Bar (inside card — colors adapt to background) ─── */
const ProfileBar = React.memo(function ProfileBar({
  name,
  handle,
  photoUrl,
  verified,
  dark,
}: {
  name: string;
  handle: string;
  photoUrl: string | null;
  verified: boolean;
  dark: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar url={photoUrl} name={name} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-[2px]">
          <p className={`font-bold text-[15px] leading-5 ${dark ? 'text-white' : 'text-[#0f1419]'}`}>
            {name || 'Seu Nome'}
          </p>
          {verified && <TwitterVerifiedBadge />}
        </div>
        <p className={`text-[15px] leading-5 ${dark ? 'text-[#71767b]' : 'text-[#536471]'}`}>
          {handle ? `@${handle}` : '@handle'}
        </p>
      </div>
    </div>
  );
});

/* ─── Background helpers ─── */
function cardBg(bg: CardBackground) {
  return bg === 'dark' ? 'bg-[#15202b]' : 'bg-white';
}

function textColor(bg: CardBackground) {
  return bg === 'dark' ? 'text-gray-100' : 'text-gray-900';
}

/* ─── Tweet Card (the actual exportable card) ─── */
const TweetCard = forwardRef<HTMLDivElement, {
  text: string;
  profile: StudioState['profile'];
  cardBackground: CardBackground;
}>(function TweetCard({ text, profile, cardBackground }, ref) {
  const dark = cardBackground === 'dark';

  return (
    <div
      ref={ref}
      className={`${cardBg(cardBackground)} flex flex-col justify-center px-10 py-12`}
      style={{ aspectRatio: '1170 / 1560', width: '100%' }}
    >
      <ProfileBar
        name={profile.name}
        handle={profile.handle}
        photoUrl={profile.photoUrl}
        verified={profile.verified}
        dark={dark}
      />
      <p className={`${textColor(cardBackground)} text-[17px] sm:text-[19px] whitespace-pre-wrap leading-relaxed mt-2`}>
        {text || <span className={`italic ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Slide vazio…</span>}
      </p>
    </div>
  );
});

/* ─── Carousel Preview ─── */
const CarouselPreview = React.memo(function CarouselPreview({
  slides,
  profile,
  cardBackground,
  cardRef,
}: {
  slides: string[];
  profile: StudioState['profile'];
  cardBackground: CardBackground;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(slides.length - 1, c + 1)), [slides.length]);

  const safeSlides = slides.length > 0 ? slides : [''];

  return (
    <div className="space-y-3">
      {/* Card container */}
      <div className="relative max-w-[420px] mx-auto rounded-xl overflow-hidden shadow-2xl border border-border/40">
        <TweetCard
          ref={cardRef}
          text={safeSlides[current]}
          profile={profile}
          cardBackground={cardBackground}
        />

        {/* Navigation arrows */}
        {safeSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Slide anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm disabled:opacity-20 hover:bg-black/60 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={current === safeSlides.length - 1}
              aria-label="Próximo slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm disabled:opacity-20 hover:bg-black/60 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
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

/* ─── Phrase Preview ─── */
const PhrasePreview = React.memo(function PhrasePreview({
  text,
  profile,
  cardBackground,
}: {
  text: string;
  profile: StudioState['profile'];
  cardBackground: CardBackground;
}) {
  const dark = cardBackground === 'dark';
  return (
    <div
      className={`${cardBg(cardBackground)} rounded-xl overflow-hidden shadow-2xl border border-border/40 max-w-[420px] mx-auto flex flex-col justify-center px-10 py-12`}
      style={{ aspectRatio: '1170 / 1560' }}
    >
      <ProfileBar name={profile.name} handle={profile.handle} photoUrl={profile.photoUrl} verified={profile.verified} dark={dark} />
      <blockquote className={`font-bold text-2xl leading-snug mt-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
        {text ? `"${text}"` : <span className={`italic text-lg font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Sua frase de efeito aqui…</span>}
      </blockquote>
    </div>
  );
});

/* ─── PostGPT Preview ─── */
const PostGptPreview = React.memo(function PostGptPreview({
  title,
  body,
  bullets,
  profile,
  cardBackground,
}: {
  title: string;
  body: string;
  bullets: string[];
  profile: StudioState['profile'];
  cardBackground: CardBackground;
}) {
  const dark = cardBackground === 'dark';
  return (
    <div
      className={`${cardBg(cardBackground)} rounded-xl overflow-hidden shadow-2xl border border-border/40 max-w-[420px] mx-auto flex flex-col justify-start px-10 py-12`}
      style={{ aspectRatio: '1170 / 1560' }}
    >
      <ProfileBar name={profile.name} handle={profile.handle} photoUrl={profile.photoUrl} verified={profile.verified} dark={dark} />
      <h3 className={`font-bold text-lg mt-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
        {title || <span className={`italic font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Título do post…</span>}
      </h3>
      <p className={`text-sm mt-2 whitespace-pre-wrap leading-relaxed ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
        {body || <span className={`italic ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Corpo do post…</span>}
      </p>
      {bullets.some((b) => b.trim()) && (
        <ul className="mt-4 space-y-1.5">
          {bullets
            .filter((b) => b.trim())
            .map((b, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1d9bf0] flex-shrink-0" />
                {b}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
});

/* ─── Main PostPreview ─── */
const PostPreview = forwardRef<HTMLDivElement, PostPreviewProps>(function PostPreview({ state }, ref) {
  const { format, profile, carousel, phrase, postgpt, cardBackground } = state;

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
    <div className="p-4 lg:p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-[460px] flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
        <p className="text-xs font-medium text-muted-foreground">1170 × 1560px</p>
      </div>

      {/* Card */}
      {format === 'carousel' && (
        <CarouselPreview slides={carousel.slides} profile={profile} cardBackground={cardBackground} cardRef={ref as React.RefObject<HTMLDivElement | null>} />
      )}
      {format === 'phrase' && <PhrasePreview text={phrase.text} profile={profile} cardBackground={cardBackground} />}
      {format === 'postgpt' && <PostGptPreview {...postgpt} profile={profile} cardBackground={cardBackground} />}

      {/* Info subtitle */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Preview reduzido. A imagem baixada terá 1170×1560px.
      </p>
    </div>
  );
});

export default PostPreview;
