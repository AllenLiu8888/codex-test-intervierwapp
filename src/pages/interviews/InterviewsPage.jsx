import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { listInterviews, deleteInterview } from '../../services/interviewApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';

export default function InterviewsPage() {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState('');
  const { data, loading, error, refetch } = useAsyncData(({ signal }) => listInterviews({ signal }), []);

  const interviews = useMemo(() => data ?? [], [data]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this interview? This cannot be undone.');
    if (!confirmed) return;
    setActionError('');
    try {
      await deleteInterview(id);
      refetch();
    } catch (deleteError) {
      setActionError(deleteError.message || 'Unable to delete interview.');
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Interviews</h2>
          <p className="text-slate-600">
            Review interview templates, track question coverage, and monitor applicant progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center rounded-md border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-500"
          >
            Refresh
          </button>
          <Link
            to="/interviews/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            New Interview
          </Link>
        </div>
      </header>

      {actionError && <p className="text-sm text-rose-600">{actionError}</p>}

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading interviews...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load interviews. {error.message}
        </div>
      )}

      {!loading && !error && interviews.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No interviews available yet. Create one to get started.
        </div>
      )}

      {!loading && !error && interviews.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Questions
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicants
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{interview.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{interview.job_role ?? '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        interview.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {interview.status ?? 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-indigo-600">
                    <button
                      type="button"
                      onClick={() => navigate(`/questions?interview=${interview.id}`)}
                      className="underline-offset-2 hover:underline"
                    >
                      {interview.questions_count ?? interview.questions?.length ?? '—'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-indigo-600">
                    <button
                      type="button"
                      onClick={() => navigate(`/applicants?interview=${interview.id}`)}
                      className="underline-offset-2 hover:underline"
                    >
                      {interview.applicants_count ?? interview.applicants?.length ?? '—'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/interviews/${interview.id}/edit`}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-500"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(interview.id)}
                        className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:border-rose-300 hover:text-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
