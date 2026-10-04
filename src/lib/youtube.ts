import { getYouTubeVideoId } from '@/data/constants';

/**
 * Einbettungs-Link über youtube-nocookie.com (ohne Tracking-Cookies, bis man abspielt).
 * Wird erst nach dem Klick auf «Abspielen» verwendet.
 */
export function youTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
}
