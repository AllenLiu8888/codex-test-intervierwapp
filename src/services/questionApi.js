import { apiClient } from './apiClient.js';
import { getApiUsername } from '../utils/env.js';
import { withOwner } from './payloadUtils.js';

export async function listQuestions(interviewId, { signal } = {}) {
  const params = interviewId ? { interview_id: `eq.${interviewId}`, order: 'id.desc' } : { order: 'id.desc' };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/question', { signal, params });
}

export async function getQuestion(id, { signal } = {}) {
  const params = { id: `eq.${id}` };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/question', { signal, params });
}

export async function createQuestion(payload, { signal } = {}) {
  return apiClient.post('/question', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateQuestion(id, payload, { signal } = {}) {
  return apiClient.patch('/question', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}

export async function deleteQuestion(id, { signal } = {}) {
  return apiClient.delete('/question', { signal, params: { id: `eq.${id}` } });
}
