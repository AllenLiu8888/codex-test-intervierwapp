/**
 * Placeholder transcription utility. Replace with Transformers.js or Whisper CLI integration.
 * @param {Blob} audioBlob
 * @returns {Promise<string>}
 */
export async function transcribeAudio(audioBlob) {
  if (!audioBlob) {
    throw new Error('Audio blob is required for transcription');
  }
  // TODO: Integrate with actual transcription service.
  return '[Transcription pending integration with Whisper/Transformers]';
}
