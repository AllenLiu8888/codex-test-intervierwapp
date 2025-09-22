/**
 * 占位转写工具：未来可替换为 Transformers.js 或 Whisper CLI 实现。
 * @param {Blob} audioBlob 录音生成的音频数据
 * @returns {Promise<string>} 返回文本答案
 */
export async function transcribeAudio(audioBlob) {
  if (!audioBlob) {
    throw new Error('Audio blob is required for transcription');
  }
  // TODO: 接入真实的语音转写服务，替换占位文本。
  return '[Transcription pending integration with Whisper/Transformers]';
}
