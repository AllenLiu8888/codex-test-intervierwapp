// 候选人列表页面，提供筛选、邀请链接、AI 总结等功能。
import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import { listApplicants } from '../../services/applicantApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { buildApplicantLink } from '../../utils/interviewLinks.js';
import { listAnswers } from '../../services/answerApi.js';
import { generateApplicantSummary } from '../../services/genAiApi.js';
import ApplicantSummaryPanel from '../../components/ApplicantSummaryPanel.jsx';

const statusStyles = {
  'Not Started': 'bg-slate-200 text-slate-700',
  Completed: 'bg-emerald-100 text-emerald-700'
};

export default function ApplicantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const interviewId = searchParams.get('interview') || undefined;
  // 通过 useAsyncData 统一处理加载、错误和数据。
  const { data, loading, error, refetch } = useAsyncData(
    ({ signal }) => listApplicants(interviewId, { signal }),
    [interviewId]
  );
  const applicants = useMemo(() => data ?? [], [data]);
  const [copyMessage, setCopyMessage] = useState('');
  const [summaryApplicant, setSummaryApplicant] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const handleCopyLink = async (applicantId) => {
    // 构造候选人独立面试链接并复制到剪贴板。
    const link = buildApplicantLink(applicantId);
    try {
      if (navigator.clipboard?.writeText && link) {
        await navigator.clipboard.writeText(link);
        setCopyMessage('Link copied to clipboard.');
        setTimeout(() => setCopyMessage(''), 2000);
      }
    } catch (copyError) {
      setCopyMessage('Unable to copy link automatically.');
    }
  };

  const clearFilter = () => {
    // 清除筛选参数，展示全部候选人。
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('interview');
    setSearchParams(nextParams, { replace: true });
  };

  const runSummary = useCallback(
    async (applicantToSummarize) => {
      if (!applicantToSummarize) return;
      // 生成 AI 总结前先重置状态并拉取最新答案列表。
      setSummaryApplicant(applicantToSummarize);
      setSummaryLoading(true);
      setSummaryError('');
      setSummaryText('');
      try {
        const answersResponse = await listAnswers(applicantToSummarize.id).catch(() => []);
        const summary = await generateApplicantSummary({ applicant: applicantToSummarize, answers: answersResponse });
        setSummaryText(summary);
      } catch (summaryErr) {
        setSummaryError(summaryErr.message || 'Unable to generate AI summary.');
      } finally {
        setSummaryLoading(false);
      }
    },
    []
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Applicants</h2>
          <p className="text-slate-600">Track candidate invitations and completion status.</p>
          {interviewId && (
            // 可视化当前筛选状态并提供清除操作。
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Filtering by interview #{interviewId}
              <button type="button" onClick={clearFilter} className="text-indigo-500 underline-offset-2 hover:underline">
                Clear
              </button>
            </div>
          )}
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
            to="/applicants/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            New Applicant
          </Link>
        </div>
      </header>

      {copyMessage && <p className="text-sm text-indigo-600">{copyMessage}</p>}

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading applicants...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load applicants. {error.message}
        </div>
      )}

      {!loading && !error && applicants.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Invite candidates to interviews to populate this list.
        </div>
      )}

      {!loading && !error && applicants.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Interview
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicants.map((applicant) => {
                const link = applicant?.id ? buildApplicantLink(applicant.id) : '';
                return (
                  <tr key={applicant.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {applicant.title ? `${applicant.title} ` : ''}
                      {applicant.firstname} {applicant.surname}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>{applicant.email_address}</div>
                      <div className="text-xs text-slate-500">{applicant.phone_number}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{applicant.interview_id ?? '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[applicant.interview_status] ?? 'bg-slate-100 text-slate-600'
                        }`}
                        // 颜色标签帮助 HR 快速了解候选人进度。
                      >
                        {applicant.interview_status ?? 'Not Started'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex flex-wrap justify-end gap-2">
                        {link && (
                          <button
                            type="button"
                            onClick={() => handleCopyLink(applicant.id)}
                            // 提供一键复制链接，便于外发邀请。
                            className="rounded-md border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:border-indigo-300 hover:text-indigo-500"
                          >
                            Copy link
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => runSummary(applicant)}
                          className="rounded-md border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:border-indigo-300 hover:text-indigo-500"
                        >
                          AI Summary
                        </button>
                        <Link
                          to={`/applicants/${applicant.id}/edit`}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-500"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ApplicantSummaryPanel
        applicant={summaryApplicant}
        summary={summaryText}
        loading={summaryLoading}
        error={summaryError}
        onClose={() => {
          setSummaryApplicant(null);
          setSummaryText('');
          setSummaryError('');
        }}
        // 允许用户在侧边栏重新触发 AI 分析。
        onGenerate={() => runSummary(summaryApplicant)}
      />
    </section>
  );
}
