import { useEffect, useState } from 'react';

const STATUS_OPTIONS = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'Completed', value: 'Completed' }
];

const defaultValues = {
  title: '',
  firstname: '',
  surname: '',
  phone: '',
  email: '',
  interview_id: '',
  interview_status: 'Not Started'
};

export default function ApplicantForm({
  initialValues,
  interviewOptions,
  onSubmit,
  onCancel,
  submitting,
  errorMessage,
  generatedLink,
  onCopyLink
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
    const requiredFields = ['firstname', 'surname', 'phone', 'email', 'interview_id'];
    const missing = requiredFields.filter((field) => !values[field]?.toString().trim());
    if (missing.length > 0) {
      const newTouched = missing.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      setTouched((prev) => ({ ...prev, ...newTouched }));
      return;
    }
    onSubmit({ ...values, interview_id: Number(values.interview_id) });
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
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

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
            <p className="text-sm text-rose-600">Interview selection is required.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstname" className="block text-sm font-medium text-slate-700">
            First name
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            required
            value={values.firstname}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.firstname && !values.firstname.trim() && (
            <p className="text-sm text-rose-600">First name is required.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="surname" className="block text-sm font-medium text-slate-700">
            Surname
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            required
            value={values.surname}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.surname && !values.surname.trim() && (
            <p className="text-sm text-rose-600">Surname is required.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.phone && !values.phone.trim() && (
            <p className="text-sm text-rose-600">Phone is required.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.email && !values.email.trim() && (
            <p className="text-sm text-rose-600">Email is required.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="interview_status" className="block text-sm font-medium text-slate-700">
          Interview status
        </label>
        <select
          id="interview_status"
          name="interview_status"
          value={values.interview_status}
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

      {generatedLink && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium">Interview link:</span>
            <code className="break-all text-xs sm:text-sm">{generatedLink}</code>
          </div>
          {onCopyLink && (
            <button
              type="button"
              onClick={onCopyLink}
              className="mt-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Copy link
            </button>
          )}
        </div>
      )}

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
          {submitting ? 'Saving...' : 'Save Applicant'}
        </button>
      </div>
    </form>
  );
}
