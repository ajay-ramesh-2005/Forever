/**
 * Utility functions for public story URLs and GitHub Pages compatibility.
 */

export function getPublicUrl(slug = 'forever-us') {
  if (typeof window === 'undefined') return `/love/${slug}`;
  const isGithub = window.location.hostname.includes('github.io');
  if (isGithub) {
    return `${window.location.origin}/frever/#/love/${slug}`;
  }
  return `${window.location.origin}/love/${slug}`;
}

export function getPublicHref(slug = 'forever-us') {
  if (typeof window === 'undefined') return `/love/${slug}`;
  const isGithub = window.location.hostname.includes('github.io');
  if (isGithub) {
    return `#/love/${slug}`;
  }
  return `/love/${slug}`;
}
