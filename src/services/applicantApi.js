import { apiClient } from './apiClient.js';
import { getApiUsername } from '../utils/env.js';
import { withOwner } from './payloadUtils.js';

export async function listApplicants(interviewId, { signal } = {}) {
  const params = interviewId ? { interview_id: `eq.${interviewId}`, order: 'id.desc' } : { order: 'id.desc' };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/applicant', { signal, params });
}

export async function getApplicant(id, { signal } = {}) {
  const params = { id: `eq.${id}` };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/applicant', { signal, params });
}

export async function createApplicant(payload, { signal } = {}) {
  return apiClient.post('/applicant', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateApplicant(id, payload, { signal } = {}) {
  return apiClient.patch('/applicant', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}
