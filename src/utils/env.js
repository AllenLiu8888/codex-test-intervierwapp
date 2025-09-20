let cachedUsername = undefined;
let hasResolvedUsername = false;

function decodeBase64Url(value) {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    if (typeof atob === 'function') {
      return atob(normalized);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(normalized, 'base64').toString('utf-8');
    }
  } catch (error) {
    return '';
  }
  return '';
}

export function getApiAuthToken() {
  const token = import.meta.env.VITE_API_JWT;
  return typeof token === 'string' ? token.trim() : '';
}

export function getApiUsername() {
  if (hasResolvedUsername) {
    return cachedUsername;
  }

  const envUsername = import.meta.env.VITE_API_USERNAME;
  if (typeof envUsername === 'string' && envUsername.trim()) {
    cachedUsername = envUsername.trim();
    hasResolvedUsername = true;
    return cachedUsername;
  }

  const token = getApiAuthToken();
  if (!token) {
    hasResolvedUsername = true;
    cachedUsername = undefined;
    return cachedUsername;
  }

  try {
    const [, payloadSegment] = token.split('.');
    if (!payloadSegment) {
      hasResolvedUsername = true;
      cachedUsername = undefined;
      return cachedUsername;
    }
    const decoded = decodeBase64Url(payloadSegment);
    const parsed = decoded ? JSON.parse(decoded) : {};
    const derived = parsed.username || parsed.user || parsed.sub || undefined;
    cachedUsername = typeof derived === 'string' && derived.trim() ? derived.trim() : undefined;
    hasResolvedUsername = true;
    return cachedUsername;
  } catch (error) {
    hasResolvedUsername = true;
    cachedUsername = undefined;
    return cachedUsername;
  }
}
