import { getApiAuthToken } from '../utils/env.js';

// 默认的 API 基址，确保在没有配置环境变量时也能正常访问课程提供的后端。
const DEFAULT_BASE_URL = 'https://comp2140a2.uqcloud.net/api';

// 自定义错误类型，用于在服务层向上抛出更友好的网络异常。
class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// 通用的 API 客户端，负责拼接 URL、附加 JWT、统一处理返回值与错误。
class ApiClient {
  constructor({ baseUrl = DEFAULT_BASE_URL } = {}) {
    // 规范化基址，避免出现双斜杠导致的 404 问题。
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // 每次请求前都重新读取最新的 JWT，确保用户更新 .env.local 后无需重新构建即可生效。
  getAuthHeader() {
    const token = getApiAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
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
    // 合并调用方自定义头，同时确保默认附带 Authorization 头。
    const authHeader = this.getAuthHeader();
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
    // 为兼容空响应体，这里先读取字符串再尝试解析 JSON。
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
  // 工具函数：为异步请求创建 AbortController，方便调用方在组件卸载时中止请求。
  const controller = new AbortController();
  if (signalRef) {
    signalRef.current = controller;
  }
  return asyncFn(controller.signal);
}
