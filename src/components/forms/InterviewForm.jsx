// 面试信息表单，负责处理标题、职位、描述和状态字段。
import { useEffect, useState } from 'react';

// 状态选项对应后端允许的值。
const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Published', value: 'Published' }
];

const defaultValues = {
  title: '',
  job_role: '',
  description: '',
  status: 'Draft'
};

export default function InterviewForm({ initialValues, onSubmit, onCancel, submitting, errorMessage }) {
  // 使用受控表单保证组件的可预测性。
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // 当外部传入的数据更新时同步表单。
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
    // PRD 要求所有字段必填，因此统一校验后再提交。
    if (!values.title.trim() || !values.job_role.trim() || !values.description.trim()) {
      setTouched({ title: true, job_role: true, description: true });
      return;
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.title && !values.title.trim() && (
            <p className="text-sm text-rose-600">Title is required.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="job_role" className="block text-sm font-medium text-slate-700">
            Job Role
          </label>
          <input
            id="job_role"
            name="job_role"
            type="text"
            required
            value={values.job_role}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.job_role && !values.job_role.trim() && (
            <p className="text-sm text-rose-600">Job role is required.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        {touched.description && !values.description.trim() && (
          <p className="text-sm text-rose-600">Description is required.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {/* 状态列表为固定集合，遍历渲染即可 */}
          {STATUS_OPTIONS.map((option) => (
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
          // 取消操作允许用户返回上一层页面。
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          // 提交按钮根据 loading 状态切换文案。
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Interview'}
        </button>
      </div>
    </form>
  );
}
