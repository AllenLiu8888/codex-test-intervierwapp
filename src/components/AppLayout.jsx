import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/interviews', label: 'Interviews' },
  { to: '/questions', label: 'Questions' },
  { to: '/applicants', label: 'Applicants' }
];

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">ReadySetHire</h1>
            <p className="text-sm text-indigo-100">
              AI interview platform for collaborative hiring.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500 hover:bg-indigo-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} ReadySetHire.</span>
          <span>Empowering teams with AI-assisted interviews.</span>
        </div>
      </footer>
    </div>
  );
}
