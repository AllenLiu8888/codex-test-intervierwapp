import { apiClient } from './apiClient.js';


export async function listApplicants(interviewId, { signal } = {}) {
  const params = interviewId ? { interview_id: `eq.${interviewId}`, order: 'created_at.desc' } : { order: 'created_at.desc' };

  return apiClient.get('/applicant', { signal, params });
}

export async function getApplicant(id, { signal } = {}) {

  return apiClient.get('/applicant', { signal, params: { id: `eq.${id}` } });
}

export async function findApplicantByToken(token, { signal } = {}) {
  if (!token) {
    throw new Error('Applicant token is required');
  }
  const params = {
    or: `invite_token.eq.${token},token.eq.${token},link_token.eq.${token},access_token.eq.${token}`,
    limit: 1
  };

  return apiClient.get('/applicant', { signal, params });
}

export async function createApplicant(payload, { signal } = {}) {

  return apiClient.post('/applicant', payload, { signal, headers: { Prefer: 'return=representation' } });
}

export async function updateApplicant(id, payload, { signal } = {}) {
  return apiClient.patch('/applicant', payload, {

    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}
