import { usePage } from '@inertiajs/react';
import Dropdown from "./Partials/Dropdown";

export default function AppLayout({ children }) {
  const { auth } = usePage().props

  return (
    <div className="page-wrapper">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <header className="side-header">
            <div className="sidebar-title">Sales Manager+</div>
            <span className="sidebar-toggler">&lt;&lt;</span>
          </header>
          <ul className="side-nav-list">
            <li>
              <a href="#" className="side-nav-link">HOME</a>
            </li>
            <li>
              <a href={route('users.index')} className="side-nav-link">社員一覧</a>
            </li>
            {[...Array(30)].map((_, i) => <li key={i}><a href="#" className="side-nav-link">Sample Menu{i + 1}</a></li>)}
          </ul>
          <footer className="side-footer">
            <div className="handle-dropdown">
              <div className="dropdown-trigger">
                <div>{auth.user.email}</div>
                <div>⬆️</div>
              </div>
            </div>
            <Dropdown />
          </footer>
        </nav>
      </aside>
      <main className="main-container">
        {children}
      </main>
    </div>
  );
}
