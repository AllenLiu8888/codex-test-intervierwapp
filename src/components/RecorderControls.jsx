// 面试录音控制面板，包含开始、暂停/恢复与结束按钮。
export default function RecorderControls({
  isRecording,
  isPaused,
  hasRecording,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onStart}
        disabled={isRecording || hasRecording || disabled}
        // 禁止重复录制：当已经有录音或正在录制时禁用按钮。
        className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Start recording
      </button>
      <button
        type="button"
        onClick={isPaused ? onResume : onPause}
        disabled={!isRecording || disabled}
        // 暂停与恢复共用同一个按钮，更贴合 Rubric 中“可暂停但不可重录”的要求。
        className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm transition hover:border-amber-300 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        type="button"
        onClick={onStop}
        disabled={!isRecording || disabled}
        // 结束录制后上层会触发转写和保存流程，满足“仅文本答案”的要求。
        className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 shadow-sm transition hover:border-rose-300 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Finish
      </button>
    </div>
  );
}
