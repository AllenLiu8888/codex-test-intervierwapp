import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InterviewForm from '../../components/forms/InterviewForm.jsx';
import { createInterview, getInterview, updateInterview } from '../../services/interviewApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';

export default function InterviewEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error } = useAsyncData(
    ({ signal }) => (isEditing ? getInterview(id, { signal }) : Promise.resolve(null)),
    [id]
  );

  const interview = useMemo(() => (Array.isArray(data) ? data[0] : data), [data]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      if (isEditing) {
        await updateInterview(id, values);
      } else {
        await createInterview(values);
      }
      navigate('/interviews');
    } catch (submissionError) {
      setErrorMessage(submissionError.message || 'Unable to save interview.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/interviews');

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Interview' : 'Create Interview'}</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Interview' : 'Create Interview'}</h2>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load interview. {error.message}
        </div>
      </section>
    );
  }

  if (isEditing && !interview) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">Interview not found</h2>
        <p className="text-slate-600">The requested interview could not be located.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Interview' : 'Create Interview'}</h2>
        <p className="text-slate-600">
          {isEditing ? 'Update interview details and status.' : 'Define a new interview template for your team.'}
        </p>
      </header>

      <InterviewForm
        initialValues={interview}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        errorMessage={errorMessage}
      />
    </section>
  );
}
