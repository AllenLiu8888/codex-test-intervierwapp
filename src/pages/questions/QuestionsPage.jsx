// 题库页面，支持按面试筛选、刷新与删除题目。
import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { listQuestions, deleteQuestion } from '../../services/questionApi.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';

const difficultyStyles = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-rose-100 text-rose-700'
};

export default function QuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [actionError, setActionError] = useState('');
  const interviewId = searchParams.get('interview') || undefined;

  const { data, loading, error, refetch } = useAsyncData(
    ({ signal }) => listQuestions(interviewId, { signal }),
    [interviewId]
  );

  const questions = useMemo(() => data ?? [], [data]);

  const clearFilter = () => {
    // 清除 URL 参数，返回全部题目列表。
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('interview');
    setSearchParams(nextParams, { replace: true });
  };

  const handleDelete = async (id) => {
    // 删除前提醒用户，避免误删题目。
    const confirmed = window.confirm('Delete this question?');
    if (!confirmed) return;
    setActionError('');
    try {
      await deleteQuestion(id);
      refetch();
    } catch (deleteError) {
      setActionError(deleteError.message || 'Unable to delete question.');
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Question Bank</h2>
          <p className="text-slate-600">Review, categorize, and refine your interview questions.</p>
          {interviewId && (
            // 显示当前面试过滤条件。
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
            to="/questions/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            New Question
          </Link>
        </div>
      </header>

      {actionError && <p className="text-sm text-rose-600">{actionError}</p>}

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading questions...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          Unable to load questions. {error.message}
        </div>
      )}

      {!loading && !error && questions.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No questions yet. Generate or add questions to enrich your interviews.
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((question) => (
            <article key={question.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">{question.question}</h3>
                  {question.interview_id && (
                    <p className="text-xs uppercase tracking-wide text-slate-500">Interview #{question.interview_id}</p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    difficultyStyles[question.difficulty] ?? 'bg-slate-100 text-slate-600'
                  }`}
                  // 题目难度使用颜色区分，方便快速浏览。
                >
                  {question.difficulty ?? 'Unrated'}
                </span>
              </div>
              {question.description && <p className="mt-3 text-sm text-slate-600">{question.description}</p>}
              <div className="mt-4 flex items-center justify-end gap-2">
                <Link
                  to={`/questions/${question.id}/edit`}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-500"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(question.id)}
                  className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:border-rose-300 hover:text-rose-500"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
