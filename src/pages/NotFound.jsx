// 404 页面，提供返回仪表盘的指引。
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-900">Page not found</h2>
      <p className="text-slate-600">The page you were looking for does not exist.</p>
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-500">
        Return to dashboard
      </Link>
    </section>
  );
}
