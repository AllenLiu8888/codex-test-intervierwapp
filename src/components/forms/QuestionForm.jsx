// 面试题目表单，支持新增与编辑操作。
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
  // 管理表单状态并避免非受控输入。
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // 当切换到新的题目时重置表单。
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
    // 题干与所属面试为必填字段。
    if (!values.question.trim() || !values.interview_id) {
      setTouched({ question: true, interview_id: true });
      return;
    }
    // 将 interview_id 转换为数字以匹配后端类型。
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
          {/* 难度选项固定写死，符合 PRD 要求 */}
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
          // 返回列表或上一页。
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          // Loading 状态反馈。
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}
