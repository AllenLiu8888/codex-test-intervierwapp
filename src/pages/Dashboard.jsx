import { Link } from 'react-router-dom';

const quickLinks = [
  {
    title: 'Plan Interviews',
    description: 'Create templates, assign AI-generated questions, and publish to candidates.',
    to: '/interviews'
  },
  {
    title: 'Curate Questions',
    description: 'Review the question bank and tailor difficulty for each role.',
    to: '/questions'
  },
  {
    title: 'Manage Applicants',
    description: 'Invite candidates and monitor completion with AI-assisted summaries.',
    to: '/applicants'
  }
];

export default function Dashboard() {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <h2 className="text-3xl font-semibold text-slate-900">Welcome back!</h2>
        <p className="text-slate-600 max-w-2xl">
          Configure interviews, collaborate with your team, and leverage AI-powered assistance to streamline hiring decisions.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-indigo-600 group-hover:text-indigo-500">{link.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{link.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-500 group-hover:text-indigo-400">
              Go to {link.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
