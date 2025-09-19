import { apiClient } from './apiClient.js';
import { getApiUsername } from '../utils/env.js';
import { withOwner } from './payloadUtils.js';

export async function listInterviews({ signal } = {}) {
  const params = { order: 'id.desc' };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/interview', { signal, params });
}

export async function getInterview(id, { signal } = {}) {
  const params = { id: `eq.${id}` };
  const username = getApiUsername();
  if (username) {
    params.username = `eq.${username}`;
  }
  return apiClient.get('/interview', { signal, params });
}

export async function createInterview(payload, { signal } = {}) {
  return apiClient.post('/interview', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateInterview(id, payload, { signal } = {}) {
  return apiClient.patch('/interview', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}

export async function deleteInterview(id, { signal } = {}) {
  return apiClient.delete('/interview', { signal, params: { id: `eq.${id}` } });
}
