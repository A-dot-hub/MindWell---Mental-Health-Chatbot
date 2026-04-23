'use client';

import { FiEdit, FiSearch, FiBook, FiActivity, FiBarChart2, FiFolder, FiLogOut } from 'react-icons/fi'

function Sidebar({ showSidebar, toggleSidebar, handleLogout, mediverseLogo }) {
  return (
    <div className={`sidebar ${showSidebar ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <img
          src={mediverseLogo || "/placeholder.svg"}
          alt="MediVerse Logo"
          className="logo-img clickable"
          onClick={toggleSidebar}
        />
        <span className="sidebar-title">MindWell</span>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-item">
          <span className="sidebar-icon"><FiEdit color="#8395eb" /></span>
          <span>New therapy session</span>
        </div>
        
        <div className="sidebar-item">
          <span className="sidebar-icon"><FiSearch color="#8395eb" /></span>
          <span>Search conversations</span>
        </div>
        
        <div className="sidebar-item">
          <span className="sidebar-icon"><FiBook color="#8395eb" /></span>
          <span>Mental health library</span>
        </div>
        
        <div className="sidebar-item">
          <span className="sidebar-icon"><FiActivity color="#8395eb" /></span>
          <span>Mindfulness exercises</span>
        </div>
        
        <div className="sidebar-item">
          <span className="sidebar-icon"><FiBarChart2 color="#8395eb" /></span>
          <span>Progress tracking</span>
        </div>
        
        <div className="sidebar-item">
          <span className="sidebar-icon"><FiFolder color="#8395eb" /></span>
          <span>My sessions</span>
          <span className="sidebar-badge">NEW</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-item sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon"><FiLogOut /></span>
          <span>Log out</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
