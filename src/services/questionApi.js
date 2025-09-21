// 问题接口封装，附加用户名过滤和排序。
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
  // 新建题目后返回完整数据供界面刷新。
  return apiClient.post('/question', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateQuestion(id, payload, { signal } = {}) {
  // 保持与创建一致的 owner 字段，确保权限校验。
  return apiClient.patch('/question', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}

export async function deleteQuestion(id, { signal } = {}) {
  // 删除时不需要 body，直接传入筛选条件。
  return apiClient.delete('/question', { signal, params: { id: `eq.${id}` } });
}
