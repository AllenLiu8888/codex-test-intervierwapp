// 根据候选人 ID 生成唯一的面试链接。
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
