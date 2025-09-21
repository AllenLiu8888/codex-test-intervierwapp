// 公共工具：为请求载荷附加 username，满足后端授权要求。
import { getApiUsername } from '../utils/env.js';

export function withOwner(payload = {}) {
  const username = getApiUsername();
  if (!username || payload.username) {
    return payload;
  }
  return { ...payload, username };
}
