import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecorderControls from '../../components/RecorderControls.jsx';
import { useAudioRecorder } from '../../hooks/useAudioRecorder.js';
import { listQuestions } from '../../services/questionApi.js';
import { findApplicantByToken, updateApplicant } from '../../services/applicantApi.js';
import { createAnswer, listAnswers } from '../../services/answerApi.js';
import { transcribeAudio } from '../../utils/transcription.js';

const STEP = {
  LOADING: 'loading',
  ERROR: 'error',
  WELCOME: 'welcome',
  QUESTION: 'question',
  COMPLETE: 'complete'
};

export default function TakeInterviewLanding() {
  const { token } = useParams();
  const [step, setStep] = useState(STEP.LOADING);
  const [errorMessage, setErrorMessage] = useState('');
  const [applicant, setApplicant] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [transcriptionMessage, setTranscriptionMessage] = useState('');

  const recorder = useAudioRecorder();

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setStep(STEP.LOADING);
        const applicantResponse = await findApplicantByToken(token, { signal: controller.signal });
        const applicantRecord = Array.isArray(applicantResponse) ? applicantResponse[0] : applicantResponse;
        if (!applicantRecord) {
          setErrorMessage('We could not find your interview invitation.');
          setStep(STEP.ERROR);
          return;
        }
        setApplicant(applicantRecord);
        const [questionsResponse, answersResponse] = await Promise.all([
          listQuestions(applicantRecord.interview_id, { signal: controller.signal }),
          listAnswers(applicantRecord.id, { signal: controller.signal }).catch(() => [])
        ]);
        const normalizedQuestions = Array.isArray(questionsResponse) ? questionsResponse : [];
        setQuestions(normalizedQuestions);

        let answerMap = {};
        if (Array.isArray(answersResponse)) {
          answerMap = answersResponse.reduce((acc, answer) => {
            if (answer.question_id) {
              acc[answer.question_id] = answer.transcript ?? answer.answer_text ?? answer.response ?? '';
            }
            return acc;
          }, {});
          setAnswers(answerMap);
        }

        if (normalizedQuestions.length === 0) {
          setErrorMessage('No questions were assigned to this interview.');
          setStep(STEP.ERROR);
          return;
        }

        const firstUnansweredIndex = normalizedQuestions.findIndex((question) => !answerMap[question.id]);
        if (firstUnansweredIndex === -1) {
          setCurrentIndex(0);
          setStep(STEP.COMPLETE);
        } else {
          setCurrentIndex(firstUnansweredIndex);
          setStep(STEP.WELCOME);
        }
      } catch (loadError) {
        if (loadError.name === 'AbortError') return;
        setErrorMessage(loadError.message || 'Unable to load interview details.');
        setStep(STEP.ERROR);
      }
    }
    load();
    return () => controller.abort();
  }, [token]);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);
  const totalQuestions = questions.length;

  const startInterview = () => {
    if (!questions.length) {
      setErrorMessage('No questions were assigned to this interview.');
      setStep(STEP.ERROR);
      return;
    }
    setStep(STEP.QUESTION);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    if (!recorder.audioBlob) {
      setErrorMessage('Please record your answer before continuing.');
      return;
    }
    setSaving(true);
    setTranscriptionMessage('Transcribing your answer, please wait...');
    setErrorMessage('');
    try {
      const transcript = await transcribeAudio(recorder.audioBlob);
      const payload = {
        applicant_id: applicant.id,
        question_id: currentQuestion.id,
        transcript
      };
      await createAnswer(payload);
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: transcript }));
      recorder.reset();
      setTranscriptionMessage('Answer saved successfully.');
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setTimeout(() => setTranscriptionMessage(''), 1500);
      } else {
        await updateApplicant(applicant.id, { interview_status: 'Completed' });
        setApplicant((prev) => (prev ? { ...prev, interview_status: 'Completed' } : prev));
        setStep(STEP.COMPLETE);
      }
    } catch (submitError) {
      setErrorMessage(submitError.message || 'Unable to save your answer.');
      setTranscriptionMessage('');
    } finally {
      setSaving(false);
    }
  };

  const renderWelcome = () => (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-indigo-500">Welcome</p>
        <h2 className="text-3xl font-semibold text-slate-900">Hi {applicant?.firstname}!</h2>
        <p className="text-slate-600 max-w-2xl">
          You are about to begin the {applicant?.job_role || 'interview'} experience. Please ensure you are in a quiet
          environment and allow microphone access. You will answer {totalQuestions} questions, one at a time, by recording your
          spoken response. You may pause during recording, but you cannot re-record once finished.
        </p>
      </header>
      <button
        type="button"
        onClick={startInterview}
        className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500"
      >
        Begin interview
      </button>
    </section>
  );

  const renderQuestion = () => (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-indigo-500">
          Question {currentIndex + 1} of {totalQuestions}
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">{currentQuestion?.question}</h2>
        {currentQuestion?.difficulty && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {currentQuestion.difficulty}
          </span>
        )}
      </header>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Record your response</h3>
        <p className="text-sm text-slate-600">
          Press “Start recording” when you are ready. You can pause if needed, then finish to lock in your answer.
        </p>
        {recorder.error && <p className="text-sm text-rose-600">{recorder.error}</p>}
        <RecorderControls
          isRecording={recorder.isRecording}
          isPaused={recorder.isPaused}
          hasRecording={recorder.hasRecording}
          onStart={recorder.start}
          onPause={recorder.pause}
          onResume={recorder.resume}
          onStop={recorder.stop}
          disabled={saving}
        />
        {recorder.hasRecording && recorder.audioUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Review your recording</p>
            <audio src={recorder.audioUrl} controls className="w-full" />
            <p className="text-xs text-slate-500">
              Once satisfied, continue to transcribe and submit your answer. Re-recording is disabled by design.
            </p>
          </div>
        )}
      </div>

      {transcriptionMessage && <p className="text-sm text-indigo-600">{transcriptionMessage}</p>}
      {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmitAnswer}
          disabled={saving || !recorder.hasRecording}
          className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving answer...' : 'Submit answer'}
        </button>
      </div>
    </section>
  );

  const renderComplete = () => (
    <section className="space-y-6 text-center">
      <h2 className="text-3xl font-semibold text-slate-900">Thank you!</h2>
      <p className="text-slate-600">
        Your responses have been submitted successfully. The hiring team will review your interview shortly.
      </p>
    </section>
  );

  if (step === STEP.LOADING) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Preparing your interview...</h2>
        <p className="text-slate-600">Please wait while we load the necessary questions.</p>
      </section>
    );
  }

  if (step === STEP.ERROR) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-rose-600">We hit a snag</h2>
        <p className="text-slate-600">{errorMessage}</p>
      </section>
    );
  }

  if (step === STEP.WELCOME) {
    return renderWelcome();
  }

  if (step === STEP.QUESTION) {
    return renderQuestion();
  }

  if (step === STEP.COMPLETE) {
    return renderComplete();
  }

  return null;
}
