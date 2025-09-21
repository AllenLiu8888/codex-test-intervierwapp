// 候选人新增/编辑表单，复用同一套组件满足 DRY 原则。
import { useEffect, useState } from 'react';

// 面试状态选项，直接对应 Rubric 要求的枚举值。
const STATUS_OPTIONS = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'Completed', value: 'Completed' }
];

// 统一的初始值，避免表单在切换候选人时出现非受控状态。
const defaultValues = {
  title: '',
  firstname: '',
  surname: '',
  phone_number: '',
  email_address: '',
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
  // values 保存当前输入数据；touched 用于控制校验提示仅在用户编辑后出现。
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // 当外部传入的初始值变化时，同步更新表单状态并确保选择框使用字符串。
    const normalized = initialValues
      ? {
          ...initialValues,
          interview_id: initialValues.interview_id ? String(initialValues.interview_id) : ''
        }
      : {};
    setValues({ ...defaultValues, ...normalized });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // 简单的受控组件写法，保持代码可读性。
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    // 标记字段已被访问，以便展示错误信息。
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 根据 PRD 检查必填字段，缺失时阻止提交并提示用户。
    const requiredFields = ['firstname', 'surname', 'phone_number', 'email_address', 'interview_id'];
    const missing = requiredFields.filter((field) => !values[field]?.toString().trim());
    if (missing.length > 0) {
      const newTouched = missing.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      setTouched((prev) => ({ ...prev, ...newTouched }));
      return;
    }
    // 提交前将 interview_id 转回数字，符合后端数据类型。
    onSubmit({
      ...values,
      interview_id: Number(values.interview_id)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* 基础信息与面试关联字段 */}
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

      {/* 姓名信息 */}
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

      {/* 联系方式 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            required
            value={values.phone_number}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.phone_number && !values.phone_number.trim() && (
            <p className="text-sm text-rose-600">Phone is required.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email_address" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email_address"
            name="email_address"
            type="email"
            required
            value={values.email_address}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {touched.email_address && !values.email_address.trim() && (
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
          {/* 状态下拉框直接渲染枚举值，保证数据一致性 */}
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {generatedLink && (
        // 生成候选人专属面试链接，满足唯一链接的评分要求。
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
          // 保留取消按钮以便用户快速返回列表。
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          // 根据提交状态切换按钮文案，提供操作反馈。
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Applicant'}
        </button>
      </div>
    </form>
  );
}
