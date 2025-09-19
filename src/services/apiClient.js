import { getApiAuthToken } from '../utils/env.js';

const DEFAULT_BASE_URL = 'https://comp2140a2.uqcloud.net/api';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  constructor({ baseUrl = DEFAULT_BASE_URL, authToken } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.authToken = authToken ?? getApiAuthToken();
  }

  buildUrl(path, params) {
    const url = new URL(`${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  async request(path, { method = 'GET', params, data, signal, headers } = {}) {
    const url = this.buildUrl(path, params);
    const authHeader = this.authToken ? { Authorization: `Bearer ${this.authToken}` } : undefined;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined,
      signal
    });

    if (!response.ok) {
      const details = await this.safeParseJson(response);
      throw new ApiError(details?.message || response.statusText, response.status, details);
    }

    if (response.status === 204) {
      return null;
    }

    return this.safeParseJson(response);
  }

  async safeParseJson(response) {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch (error) {
      return text;
    }
  }

  get(path, options) {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path, data, options) {
    return this.request(path, { ...options, method: 'POST', data });
  }

  patch(path, data, options) {
    return this.request(path, { ...options, method: 'PATCH', data });
  }

  delete(path, options) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL
});

export { ApiError, ApiClient };

export function withAbort(signalRef, asyncFn) {
  const controller = new AbortController();
  if (signalRef) {
    signalRef.current = controller;
  }
  return asyncFn(controller.signal);
}
