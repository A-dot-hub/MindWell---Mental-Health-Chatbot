'use client';

import { useState, useEffect, useRef, useContext } from "react"
import { FiUser, FiMessageSquare, FiTrash2, FiFlag, FiSend, FiLogOut, FiSun, FiMoon } from "react-icons/fi"
import "../../styles/UserMenu.css"
import { ThemeContext } from "../../context/ThemeContext"

function UserMenu({ showChatbot, setShowChatbot, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  return (
    <div className="user-menu" ref={menuRef}>
      <button onClick={handleToggleMenu} className="user-button">
        <FiUser size={22} color="#8395eb" />
      </button>

      {menuOpen && (
        <div className="dropdown">
          {/* <button onClick={() => setShowChatbot(!showChatbot)}>
            <FiMessageSquare color="#8395eb" /> {showChatbot ? "Disable Chatbot" : "Enable Chatbot"}
          </button> */}

          <button onClick={toggleDarkMode}>
            {darkMode ? <FiSun color="#f6e58d" /> : <FiMoon color="#4834d4" />} {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button>
            <FiTrash2 color="#8395eb" /> Delete Account
          </button>
          
          <button>
            <FiFlag color="#8395eb" /> Report Issue
          </button>
          
          <button>
            <FiSend color="#8395eb" /> Feedback
          </button>
          
          <button onClick={onLogout}>
            <FiLogOut color="#8395eb" /> Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
