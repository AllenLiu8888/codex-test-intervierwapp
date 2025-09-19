export function buildApplicantLink(applicantId) {
  if (!applicantId) return '';
  if (typeof window === 'undefined') {
    return '';
  }
  const url = new URL(window.location.href);
  url.pathname = `/take/${applicantId}`;
  url.search = '';
  url.hash = '';
  return url.toString();
}
