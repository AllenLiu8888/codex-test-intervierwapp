// 通用异步数据 Hook，封装加载状态、错误处理与请求取消逻辑。
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../services/apiClient.js';

export function useAsyncData(asyncFn, dependencies = []) {
  const abortRef = useRef();
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const execute = useCallback(async () => {
    // 触发新的请求前先中止旧的请求，防止竞态导致状态错乱。
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn({ signal: controller.signal });
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      if (error.name === 'AbortError') return;
      if (error instanceof ApiError) {
        setState({ data: null, loading: false, error });
      } else {
        setState({ data: null, loading: false, error: new Error(error.message || 'Unexpected error') });
      }
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    execute();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [execute]);

  return {
    ...state,
    refetch: execute
  };
}
