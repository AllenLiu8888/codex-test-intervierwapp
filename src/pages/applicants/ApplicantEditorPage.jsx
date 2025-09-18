import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicantForm from '../../components/forms/ApplicantForm.jsx';
import { listInterviews } from '../../services/interviewApi.js';
import { createApplicant, getApplicant, updateApplicant } from '../../services/applicantApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { buildApplicantLink, generateApplicantToken } from '../../utils/interviewLinks.js';

export default function ApplicantEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [linkToken, setLinkToken] = useState('');

  const interviewsResult = useAsyncData(({ signal }) => listInterviews({ signal }), []);
  const applicantResult = useAsyncData(
    ({ signal }) => (isEditing ? getApplicant(id, { signal }) : Promise.resolve(null)),
    [id]
  );

  useEffect(() => {
    const record = Array.isArray(applicantResult.data) ? applicantResult.data[0] : applicantResult.data;
    if (!record) return;
    const tokenCandidate = record?.invite_token || record?.token || record?.link_token || record?.access_token;
    if (tokenCandidate) {
      setLinkToken(tokenCandidate);
    }
  }, [applicantResult.data]);

  useEffect(() => {
    if (!isEditing && !linkToken) {
      setLinkToken(generateApplicantToken());
    }
  }, [isEditing, linkToken]);

  const interviewOptions = useMemo(
    () =>
      (interviewsResult.data ?? []).map((interview) => ({
        value: interview.id,
        label: `${interview.title} (${interview.job_role ?? 'Role'})`
      })),
    [interviewsResult.data]
  );

  const applicant = useMemo(
    () => (Array.isArray(applicantResult.data) ? applicantResult.data[0] : applicantResult.data),
    [applicantResult.data]
  );

  const ensureToken = () => {
    if (!linkToken) {
      const token = generateApplicantToken();
      setLinkToken(token);
      return token;
    }
    return linkToken;
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setErrorMessage('');
    const token = ensureToken();
    const payload = { ...values, invite_token: token };
    try {
      if (isEditing) {
        await updateApplicant(id, payload);
      } else {
        await createApplicant(payload);
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
    const token = ensureToken();
    const link = buildApplicantLink(token);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        setErrorMessage('');
      }
    } catch (copyError) {
      setErrorMessage('Unable to copy link automatically. Copy it manually.');
    }
  };

  const generatedLink = linkToken ? buildApplicantLink(linkToken) : '';

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
