export function generateApplicantToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function buildApplicantLink(token) {
  if (!token) return '';
  const url = new URL(window.location.href);
  url.pathname = `/take/${token}`;
  url.search = '';
  url.hash = '';
  return url.toString();
}
