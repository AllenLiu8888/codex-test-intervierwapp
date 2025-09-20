import { apiClient } from './apiClient.js';

export async function listAnswers(applicantId, { signal } = {}) {
  return apiClient.get('/answer', {
    signal,
    params: applicantId ? { applicant_id: `eq.${applicantId}` } : undefined
  });
}

export async function createAnswer(payload, { signal } = {}) {
  return apiClient.post('/answer', payload, { signal, headers: { Prefer: 'return=representation' } });
}

export async function updateAnswer(id, payload, { signal } = {}) {
  return apiClient.patch('/answer', payload, {

    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}
