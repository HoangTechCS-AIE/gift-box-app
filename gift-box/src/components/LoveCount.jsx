import { useState, useEffect } from 'react'
import './LoveCount.css'

const LoveCount = ({ onBack }) => {
  // Ngày bắt đầu yêu nhau - CÓ THỂ THAY ĐỔI NGÀY NÀY
  const startDate = new Date('2024-02-14') // Format: YYYY-MM-DD
  
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  })
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100)
    
    const calculateTime = () => {
      const now = new Date()
      const diff = now - startDate
      
      const totalSeconds = Math.floor(diff / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)
      const totalDays = Math.floor(totalHours / 24)
      
      const days = totalDays
      const hours = totalHours % 24
      const minutes = totalMinutes % 60
      const seconds = totalSeconds % 60
      
      setTimeElapsed({ days, hours, minutes, seconds, totalDays })
    }
    
    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const milestones = [
    { days: 100, label: '100 ngày yêu', emoji: '💯' },
    { days: 365, label: '1 năm bên nhau', emoji: '🎂' },
    { days: 500, label: '500 ngày', emoji: '🌟' },
    { days: 730, label: '2 năm', emoji: '💎' },
    { days: 1000, label: '1000 ngày', emoji: '👑' },
  ]

  const nextMilestone = milestones.find(m => m.days > timeElapsed.totalDays)
  const daysToNextMilestone = nextMilestone ? nextMilestone.days - timeElapsed.totalDays : 0

  return (
    <div className="love-count-container">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`count-content ${showContent ? 'show' : ''}`}>
        <div className="count-header">
          <span className="count-emoji heartbeat">💕</span>
          <h1 className="count-title">Love Days</h1>
          <p className="count-subtitle">Anh và em đã bên nhau</p>
        </div>

        {/* Main Counter */}
        <div className="main-counter">
          <div className="big-number">
            <span className="number-value">{timeElapsed.days}</span>
            <span className="number-label">ngày</span>
          </div>
          
          <div className="time-details">
            <div className="time-box">
              <span className="time-value">{String(timeElapsed.hours).padStart(2, '0')}</span>
              <span className="time-label">giờ</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{String(timeElapsed.minutes).padStart(2, '0')}</span>
              <span className="time-label">phút</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{String(timeElapsed.seconds).padStart(2, '0')}</span>
              <span className="time-label">giây</span>
            </div>
          </div>
        </div>

        {/* Start Date */}
        <div className="start-date-card">
          <div className="date-icon">📅</div>
          <div className="date-info">
            <span className="date-label">Ngày bắt đầu</span>
            <span className="date-value">
              {startDate.toLocaleDateString('vi-VN', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="milestone-card">
            <div className="milestone-emoji">{nextMilestone.emoji}</div>
            <div className="milestone-info">
              <span className="milestone-label">Cột mốc tiếp theo</span>
              <span className="milestone-value">{nextMilestone.label}</span>
              <span className="milestone-countdown">Còn {daysToNextMilestone} ngày nữa</span>
            </div>
            <div className="milestone-progress">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${((timeElapsed.totalDays / nextMilestone.days) * 100).toFixed(1)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Love Quote */}
        <div className="love-quote">
          <span className="quote-icon">💌</span>
          <p>"Mỗi ngày bên anh là một ngày hạnh phúc"</p>
        </div>
      </div>
    </div>
  )
}

export default LoveCount
