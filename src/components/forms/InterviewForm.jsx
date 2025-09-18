import { useEffect, useState } from 'react';

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
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Interview'}
        </button>
      </div>
    </form>
  );
}
