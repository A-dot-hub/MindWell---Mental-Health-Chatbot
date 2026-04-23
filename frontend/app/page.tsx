'use client';

import { useState, useContext } from "react"
import Login from "@/src/components/auth/Login"
import Signup from "@/src/components/auth/Signup"
import Chat from "@/src/components/chat/Chat"
import UserMenu from "@/src/components/layout/UserMenu"
import Sidebar from "@/src/components/layout/Sidebar"
import { ThemeContext, ThemeProvider } from "@/src/context/ThemeContext"

// Images from public folder
const DOCTOR_IMAGE = "/doctor.png"
const MEDIVERSE_LOGO = "/mediverseLogo.png"

function AppContent() {
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowChatbot(true)
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
            <img src={DOCTOR_IMAGE || "/placeholder.svg"} alt="Doctor" />
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
                <Login onLoginSuccess={handleLoginSuccess} />
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
        mediverseLogo={MEDIVERSE_LOGO}
      />

      <div className="top-bar">
        <div className="logo-container">
          <img
            src={MEDIVERSE_LOGO || "/placeholder.svg"}
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

      <Chat chatId="main" />
    </div>
  )
}

export default function Page() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
