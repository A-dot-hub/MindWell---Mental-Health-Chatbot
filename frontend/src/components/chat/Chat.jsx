"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { FiSend, FiPaperclip, FiCopy, FiThumbsUp, FiThumbsDown, FiRefreshCw, FiMic, FiPlus, FiClock, FiEdit } from "react-icons/fi"
import { ThemeContext } from "../../context/ThemeContext"

const MEDIVERSE_LOGO = "/mediverseLogo.png"
const SpeechRecognition = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null

function Chat({ chatId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const [hoveredMessage, setHoveredMessage] = useState(null)
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false)
  const [language, setLanguage] = useState("English")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const languageDropdownRef = useRef(null)
  const { darkMode } = useContext(ThemeContext)

  useEffect(() => {
    if (messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current.parentElement
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (chatId) {
      setMessages([])
      setHasUserSentMessage(false)
    }
  }, [chatId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      setInput(spokenText)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const formatTime = () => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // 0 should be 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutesStr} ${ampm}`
  }

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage = input
    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id || 0), 0) + 1 : 1
    const timestamp = formatTime()

    setMessages((prev) => [...prev, { id: newId, text: userMessage, sender: "user", timestamp }])
    setInput("")
    setIsTyping(true)
    setHasUserSentMessage(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage }),
      })

      const data = await response.json()
      const botReply = data.reply || "I'm here to help! What would you like to know?"

      setMessages((prev) => [
        ...prev,
        { id: newId + 1, text: botReply, sender: "bot" },
      ])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { id: newId + 1, text: "I'm having trouble connecting right now. Please try again.", sender: "bot" },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleEditMessage = (msg) => {
    setInput(msg.text)
    // Remove the message being edited and all messages after it
    setMessages((prev) => prev.filter(m => m.id < msg.id))
    inputRef.current?.focus()
  }

  const handleRetryMessage = (text) => {
    setInput(text)
    setTimeout(() => {
      handleSend()
    }, 100)
  }

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <div className={`cl-chat-container ${darkMode ? "dark" : ""}`}>
      {/* Welcome Screen - Only shown when no messages */}
      {!hasUserSentMessage && (
        <div className="cl-welcome-screen">
          <div className="cl-welcome-content">
            <div className="cl-welcome-logo">
              <img src={MEDIVERSE_LOGO || "/placeholder.svg"} alt="MindWell AI Logo" />
            </div>
            <h1 className="cl-welcome-title">Welcome to MindWell AI</h1>
            <p className="cl-welcome-subtitle">How can I help you today?</p>
          </div>
        </div>
      )}

      {/* Messages Area - Only shown after first message */}
      {hasUserSentMessage && (
        <div className="cl-messages-wrapper">
          <div className="cl-messages" ref={messagesContainerRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`cl-message-row ${msg.sender}`}
                onMouseEnter={() => setHoveredMessage(msg.id)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div className="cl-message-content">
                  {msg.sender === "bot" && (
                    <div className="cl-avatar">
                      <img src={MEDIVERSE_LOGO || "/placeholder.svg"} alt="mediverseLogo AI" />
                    </div>
                  )}
                  <div className="cl-message-text-wrapper">
                    <div className={`cl-message-text ${msg.sender}`}>
                      {msg.text}
                    </div>
                    {msg.sender === "user" && msg.timestamp && (
                      <div className="cl-user-message-footer">
                        <div className="cl-message-timestamp">
                          {msg.timestamp}
                        </div>
                        <div className="cl-user-message-actions">
                          <button className="cl-user-action-btn" title="Copy" onClick={() => copyMessage(msg.text)}>
                            <FiCopy size={12} />
                          </button>
                          <button className="cl-user-action-btn" title="Edit" onClick={() => handleEditMessage(msg)}>
                            <FiEdit size={12} />
                          </button>
                          <button className="cl-user-action-btn" title="Retry" onClick={() => handleRetryMessage(msg.text)}>
                            <FiRefreshCw size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {msg.sender === "bot" && hoveredMessage === msg.id && (
                  <div className="cl-message-actions">
                    <button className="cl-action-btn" title="Copy" onClick={() => copyMessage(msg.text)}>
                      <FiCopy size={14} />
                    </button>
                    <button className="cl-action-btn" title="Like">
                      <FiThumbsUp size={14} />
                    </button>
                    <button className="cl-action-btn" title="Dislike">
                      <FiThumbsDown size={14} />
                    </button>
                    <button className="cl-action-btn" title="Refresh">
                      <FiRefreshCw size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="cl-message-row bot">
                <div className="cl-message-content">
                  <div className="cl-avatar">
                    <img src={MEDIVERSE_LOGO || "/placeholder.svg"} alt="mediverseLogo AI" />
                  </div>
                  <div className="cl-message-text bot typing">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Section - Transitions from center to bottom */}
      <div className={`cl-input-section ${hasUserSentMessage ? "fixed-bottom" : "centered"}`}>
        <div className="cl-input-container">
          <div className="cl-input-box">
            <button className="cl-icon-btn" title="Attach file">
              <FiPaperclip size={18} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message MindWell AI..."
              className="cl-textarea"
              rows="1"
            />
            <button 
              className={`cl-icon-btn ${listening ? "listening" : ""}`} 
              title="Voice input"
              onClick={startListening}
            >
              <FiMic size={18} />
            </button>
            <div className="cl-language-dropdown" ref={languageDropdownRef}>
              <button
                className="cl-language-btn"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                {language}
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="cl-language-menu">
                  <button
                    className={`cl-language-option ${language === "English" ? "active" : ""}`}
                    onClick={() => handleLanguageSelect("English")}
                  >
                    English
                  </button>
                  <button
                    className={`cl-language-option ${language === "Hindi" ? "active" : ""}`}
                    onClick={() => handleLanguageSelect("Hindi")}
                  >
                    Hindi
                  </button>
                  <button
                    className={`cl-language-option ${language === "Marathi" ? "active" : ""}`}
                    onClick={() => handleLanguageSelect("Marathi")}
                  >
                    Marathi
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleSend}
              className={`cl-send-btn ${input.trim() ? "active" : ""}`}
              disabled={!input.trim()}
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
        <p className="cl-disclaimer">
          MindWell AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  )
}

export default Chat