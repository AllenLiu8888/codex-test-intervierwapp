import { useEffect, useState } from 'react';

const DIFFICULTY_OPTIONS = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
];

const defaultValues = {
  question: '',
  difficulty: 'Easy',
  interview_id: ''
};

export default function QuestionForm({
  initialValues,
  interviewOptions,
  onSubmit,
  onCancel,
  submitting,
  errorMessage
}) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.question.trim() || !values.interview_id) {
      setTouched({ question: true, interview_id: true });
      return;
    }
    onSubmit({ ...values, interview_id: Number(values.interview_id) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label htmlFor="interview_id" className="block text-sm font-medium text-slate-700">
          Interview
        </label>
        <select
          id="interview_id"
          name="interview_id"
          required
          value={values.interview_id}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="" disabled>
            Select interview
          </option>
          {interviewOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {touched.interview_id && !values.interview_id && (
          <p className="text-sm text-rose-600">An interview is required.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="question" className="block text-sm font-medium text-slate-700">
          Question
        </label>
        <textarea
          id="question"
          name="question"
          rows={4}
          required
          value={values.question}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        {touched.question && !values.question.trim() && (
          <p className="text-sm text-rose-600">Question text is required.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">
          Difficulty
        </label>
        <select
          id="difficulty"
          name="difficulty"
          value={values.difficulty}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {DIFFICULTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}
