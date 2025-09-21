// 题目新增/编辑页面，加载面试列表并复用 QuestionForm。
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionForm from '../../components/forms/QuestionForm.jsx';
import { listInterviews } from '../../services/interviewApi.js';
import { createQuestion, getQuestion, updateQuestion } from '../../services/questionApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';

export default function QuestionEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const interviewsResult = useAsyncData(({ signal }) => listInterviews({ signal }), []);
  const questionResult = useAsyncData(
    ({ signal }) => (isEditing ? getQuestion(id, { signal }) : Promise.resolve(null)),
    [id]
  );

  const interviewOptions = useMemo(
    () =>
      (interviewsResult.data ?? []).map((interview) => ({
        value: interview.id,
        label: `${interview.title} (${interview.job_role ?? 'Role'})`
      })),
    [interviewsResult.data]
  );

  // API 返回结构不固定，统一处理为对象。
  const question = useMemo(() => (Array.isArray(questionResult.data) ? questionResult.data[0] : questionResult.data), [
    questionResult.data
  ]);

  const handleSubmit = async (values) => {
    // 创建或更新题目后返回列表。
    setSubmitting(true);
    setErrorMessage('');
    try {
      if (isEditing) {
        await updateQuestion(id, values);
      } else {
        await createQuestion(values);
      }
      navigate('/questions');
    } catch (submissionError) {
      setErrorMessage(submissionError.message || 'Unable to save question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/questions');

  if (interviewsResult.loading || questionResult.loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Question' : 'Create Question'}</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading...</div>
      </section>
    );
  }

  if (interviewsResult.error) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Question' : 'Create Question'}</h2>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load interviews. {interviewsResult.error.message}
        </div>
      </section>
    );
  }

  if (questionResult.error) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Question' : 'Create Question'}</h2>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load question. {questionResult.error.message}
        </div>
      </section>
    );
  }

  if (isEditing && !question) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">Question not found</h2>
        <p className="text-slate-600">The requested question could not be located.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Question' : 'Create Question'}</h2>
        <p className="text-slate-600">
          {isEditing ? 'Update the question prompt and difficulty.' : 'Add a new question to your interview bank.'}
        </p>
      </header>

      <QuestionForm
        initialValues={question}
        interviewOptions={interviewOptions}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        errorMessage={errorMessage}
      />
    </section>
  );
}
