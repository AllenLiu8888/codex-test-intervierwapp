// 面试相关接口，封装过滤条件与通用头部。
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
  // 创建后立即返回记录，便于更新列表。
  return apiClient.post('/interview', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateInterview(id, payload, { signal } = {}) {
  // Patch 时带上 username，保证权限一致。
  return apiClient.patch('/interview', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}

export async function deleteInterview(id, { signal } = {}) {
  // 删除操作直接返回 204，无需额外处理响应体。
  return apiClient.delete('/interview', { signal, params: { id: `eq.${id}` } });
}
