"use client"

import { useState, useContext } from "react"
import { FiSearch, FiLogOut, FiSettings, FiEdit, FiBook, FiActivity, FiBarChart2, FiFolder } from 'react-icons/fi'
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Chat from "./components/chat/Chat"
import UserMenu from "./components/layout/UserMenu"
import Sidebar from "./components/layout/Sidebar"
import "./styles/App.css"
import doctorImage from "../src/assets/doctor.png"
import mediverseLogo from "./assets/mediverseLogo.png"
import { ThemeContext } from "./context/ThemeContext"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const { darkMode } = useContext(ThemeContext)

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowChatbot(false)
    setShowSidebar(false)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const handleDashboardClick = () => {
    setShowSidebar(false)
    setShowChatbot(false)
  }

  // Not logged in: show login or signup form
  if (!isLoggedIn) {
    return (
      <div className="main-container">
        <div className="auth-wrapper">
          <div className="auth-left">
            <img src=".assets/doctor.png" alt="Doctor" />
          </div>
          <div className="auth-right">
            {showSignup ? (
              <>
                <Signup onSignupSuccess={() => setShowSignup(false)} />
                <p>
                  Already have an account? <button onClick={() => setShowSignup(false)}>Log in</button>
                </p>
              </>
            ) : (
              <>
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
                <p>
                  Don't have an account? <button onClick={() => setShowSignup(true)}>Sign up</button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Logged in: show top bar, sidebar, chatbot, or welcome text
  return (
    <div className={`main-container ${darkMode ? "dark" : ""}`}>
      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}

      <Sidebar 
        showSidebar={showSidebar} 
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        Mindwell={Mindwell}
      />

      <div className="top-bar">
        <div className="logo-container">
          <img
            src={mediverseLogo || "/placeholder.svg"}
            alt="MediVerse Logo"
            className="logo-img clickable"
            onClick={toggleSidebar}
          />
          <span className="logo-text" onClick={handleDashboardClick}>
            MindWell
          </span>
        </div>

        <UserMenu showChatbot={showChatbot} setShowChatbot={setShowChatbot} onLogout={handleLogout} />
      </div>

      {showChatbot ? (
        <div className="chat-container">
          <Chat />
        </div>
      ) : (
        <div className="welcome-text" onClick={handleDashboardClick}>
          <h2>Welcome to our Mental Health Platform</h2>
          <p>Please enable the chatbot from the top-right menu to begin.</p>
        </div>
      )}
    </div>
  )
}

export default App
