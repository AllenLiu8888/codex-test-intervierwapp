import { getApiUsername } from '../utils/env.js';

export function withOwner(payload = {}) {
  const username = getApiUsername();
  if (!username || payload.username) {
    return payload;
  }
  return { ...payload, username };
}
