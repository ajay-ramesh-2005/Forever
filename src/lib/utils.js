/**
 * Utility functions for public story URLs and GitHub Pages compatibility.
 * ALWAYS uses HashRouter fragments (#/love/slug) so links stay inside the repository.
 */

export function getPublicUrl(slug = 'forever-us') {
  if (typeof window === 'undefined') return `/#/love/${slug}`;
  const isGithub = window.location.hostname.includes('github.io');
  if (isGithub) {
    return `${window.location.origin}/Forever/#/love/${slug}`;
  }
  return `${window.location.origin}/#/love/${slug}`;
}

export function getPublicHref(slug = 'forever-us') {
  return `#/love/${slug}`;
}
