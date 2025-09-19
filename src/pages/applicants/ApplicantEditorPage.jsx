import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicantForm from '../../components/forms/ApplicantForm.jsx';
import { listInterviews } from '../../services/interviewApi.js';
import { createApplicant, getApplicant, updateApplicant } from '../../services/applicantApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { buildApplicantLink } from '../../utils/interviewLinks.js';

export default function ApplicantEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const interviewsResult = useAsyncData(({ signal }) => listInterviews({ signal }), []);
  const applicantResult = useAsyncData(
    ({ signal }) => (isEditing ? getApplicant(id, { signal }) : Promise.resolve(null)),
    [id]
  );

  useEffect(() => {
    const record = Array.isArray(applicantResult.data) ? applicantResult.data[0] : applicantResult.data;
    if (record?.id) {
      setGeneratedLink(buildApplicantLink(record.id));
    } else {
      setGeneratedLink('');
    }
  }, [applicantResult.data]);

  const interviewOptions = useMemo(
    () =>
      (interviewsResult.data ?? []).map((interview) => ({
        value: interview.id,
        label: `${interview.title} (${interview.job_role ?? 'Role'})`
      })),
    [interviewsResult.data]
  );

  const applicant = useMemo(() => {
    const record = Array.isArray(applicantResult.data) ? applicantResult.data[0] : applicantResult.data;
    if (!record) return undefined;
    return {
      ...record,
      interview_id: record.interview_id ? String(record.interview_id) : ''
    };
  }, [applicantResult.data]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setErrorMessage('');
    const { id: _omitId, ...rest } = values;
    const payload = {
      ...rest,
      interview_id: Number(values.interview_id)
    };
    try {
      if (isEditing) {
        await updateApplicant(id, payload);
      } else {
        const created = await createApplicant(payload);
        const createdRecord = Array.isArray(created) ? created[0] : created;
        if (createdRecord?.id) {
          setGeneratedLink(buildApplicantLink(createdRecord.id));
        }
      }
      navigate('/applicants');
    } catch (submissionError) {
      setErrorMessage(submissionError.message || 'Unable to save applicant.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/applicants');

  const handleCopyLink = async () => {
    const link = generatedLink;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        setErrorMessage('');
      }
    } catch (copyError) {
      setErrorMessage('Unable to copy link automatically. Copy it manually.');
    }
  };

  if (interviewsResult.loading || applicantResult.loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Applicant' : 'Create Applicant'}</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading...</div>
      </section>
    );
  }

  if (interviewsResult.error) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Applicant' : 'Create Applicant'}</h2>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load interviews. {interviewsResult.error.message}
        </div>
      </section>
    );
  }

  if (applicantResult.error) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Applicant' : 'Create Applicant'}</h2>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load applicant. {applicantResult.error.message}
        </div>
      </section>
    );
  }

  if (isEditing && !applicant) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">Applicant not found</h2>
        <p className="text-slate-600">The requested applicant could not be located.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold text-slate-900">{isEditing ? 'Edit Applicant' : 'Create Applicant'}</h2>
        <p className="text-slate-600">
          {isEditing ? 'Update applicant contact details and status.' : 'Invite a candidate and share the interview link.'}
        </p>
      </header>

      <ApplicantForm
        initialValues={applicant}
        interviewOptions={interviewOptions}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        errorMessage={errorMessage}
        generatedLink={generatedLink}
        onCopyLink={generatedLink ? handleCopyLink : undefined}
      />
    </section>
  );
}
