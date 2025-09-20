import { apiClient } from './apiClient.js';


export async function listInterviews({ signal } = {}) {
  return apiClient.get('/interview', { signal, params: { order: 'created_at.desc' } });
}

export async function getInterview(id, { signal } = {}) {
  return apiClient.get('/interview', { signal, params: { id: `eq.${id}` } });
}

export async function createInterview(payload, { signal } = {}) {
  return apiClient.post('/interview', payload, { signal, headers: { Prefer: 'return=representation' } });
}

export async function updateInterview(id, payload, { signal } = {}) {
  return apiClient.patch('/interview', payload, {

    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}

export async function deleteInterview(id, { signal } = {}) {
  return apiClient.delete('/interview', { signal, params: { id: `eq.${id}` } });
}
