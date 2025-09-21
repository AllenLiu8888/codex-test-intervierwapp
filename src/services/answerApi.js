// 答案接口封装，统一附加所有者信息与排序。
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
  // 创建答案时附带用户标识，并请求返回完整记录以便前端更新状态。
  return apiClient.post('/applicant_answer', withOwner(payload), {
    signal,
    headers: { Prefer: 'return=representation' }
  });
}

export async function updateAnswer(id, payload, { signal } = {}) {
  // 按照 PostgREST 约定通过查询参数筛选需要更新的记录。
  return apiClient.patch('/applicant_answer', withOwner(payload), {
    signal,
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' }
  });
}
