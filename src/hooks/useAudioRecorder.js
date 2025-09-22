// 录音逻辑 Hook，封装 MediaRecorder 的生命周期、状态管理与错误处理。
import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [error, setError] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const reset = useCallback(() => {
    // 恢复初始状态，并释放已创建的资源。
    chunksRef.current = [];
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl('');
    setHasRecording(false);
    setIsRecording(false);
    setIsPaused(false);
    setError('');
    cleanup();
  }, [audioUrl, cleanup]);

  useEffect(() => () => reset(), [reset]);

  const ensureRecorder = useCallback(async () => {
    if (mediaRecorderRef.current) return mediaRecorderRef.current;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Audio recording is not supported in this browser.');
    }
    // 申请麦克风权限并创建 MediaRecorder 实例。
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    recorder.onstop = () => {
      // 合并录音片段并生成可供下载/回放的 URL。
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      const objectUrl = URL.createObjectURL(blob);
      setAudioUrl(objectUrl);
      setHasRecording(true);
      setIsRecording(false);
      setIsPaused(false);
      cleanup();
    };
    recorder.onerror = (event) => {
      setError(event.error?.message || 'Recording failed');
      cleanup();
    };
    mediaRecorderRef.current = recorder;
    return recorder;
  }, [cleanup]);

  const start = useCallback(async () => {
    try {
      const recorder = await ensureRecorder();
      chunksRef.current = [];
      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setHasRecording(false);
      setAudioBlob(null);
      setAudioUrl('');
    } catch (startError) {
      setError(startError.message);
    }
  }, [ensureRecorder]);

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'recording') return;
    // MediaRecorder 自带 pause/resume，我们只同步 UI 状态。
    recorder.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'paused') return;
    recorder.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;
    recorder.stop();
  }, []);

  // 向外暴露操作函数和状态，供录音组件调用。
  return {
    start,
    pause,
    resume,
    stop,
    reset,
    isRecording,
    isPaused,
    hasRecording,
    audioBlob,
    audioUrl,
    error
  };
}
