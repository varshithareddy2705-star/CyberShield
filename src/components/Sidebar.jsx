
import { NavLink, useNavigate } from 'react-router-dom'
import '../Sidebar.css'

function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('cybershieldToken')
    localStorage.removeItem('cybershieldUser')
    navigate('/login', { replace: true })
  }

  return (
    <aside className="app-sidebar">

      <div className="sidebar-brand">
        <svg
          className="sidebar-logo"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 2.5L26.5 9.2V20.8L15 27.5L3.5 20.8V9.2L15 2.5Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>

        <span>CyberShield</span>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav className="sidebar-navigation">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <span>◫</span> Overview
        </NavLink>

        <NavLink to="/scanner" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <span>⌕</span> Threat Scanner
        </NavLink>

        <NavLink to="/incidents" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <span>⚠</span> Incidents
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <span>◷</span> Scan History
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <span>⚙</span> Settings
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-system">
          <span className="online-dot"></span>
          System Online
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          ↗ Sign Out
        </button>
      </div>

    </aside>
  )
}

export default Sidebar
