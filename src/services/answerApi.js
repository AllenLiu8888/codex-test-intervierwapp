import { apiClient } from './apiClient.js';
import { getApiUsername } from '../utils/env.js';
import { withOwner } from './payloadUtils.js';

export async function listAnswers(applicantId, { signal } = {}) {
  if (!applicantId) {
    return [];
  }
  const params = { applicant_id: `eq.${applicantId}`, order: 'question_id.asc' };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/applicant_answer', { signal, params });
}

export async function createAnswer(payload, { signal } = {}) {
  return apiClient.post('/applicant_answer', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateAnswer(id, payload, { signal } = {}) {
  return apiClient.patch('/applicant_answer', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}
