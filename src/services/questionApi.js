import { apiClient } from './apiClient.js';

export async function listQuestions(interviewId, { signal } = {}) {
  const params = interviewId ? { interview_id: `eq.${interviewId}`, order: 'created_at.desc' } : { order: 'created_at.desc' };
  return apiClient.get('/question', { signal, params });
}

export async function getQuestion(id, { signal } = {}) {
  return apiClient.get('/question', { signal, params: { id: `eq.${id}` } });
}

export async function createQuestion(payload, { signal } = {}) {
  return apiClient.post('/question', payload, { signal, headers: { Prefer: 'return=representation' } });
}

export async function updateQuestion(id, payload, { signal } = {}) {
  return apiClient.patch('/question', payload, {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}

export async function deleteQuestion(id, { signal } = {}) {
  return apiClient.delete('/question', { signal, params: { id: `eq.${id}` } });
}
