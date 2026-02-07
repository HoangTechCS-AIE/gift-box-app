import { useState, useEffect, useRef } from 'react'
import './LoveCount.css'

const LoveCount = ({ onBack }) => {
  // Ngày cưới - CÓ THỂ THAY ĐỔI NGÀY NÀY
  const startDate = new Date('2022-11-13') // Format: YYYY-MM-DD (Ngày cưới)

  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  })
  const [showContent, setShowContent] = useState(true) // Remove setTimeout delay
  const containerRef = useRef(null)
  const intervalRef = useRef(null)

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

  // Intersection Observer to pause interval when component is not visible
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Component is visible - start/resume interval
            if (!intervalRef.current) {
              calculateTime() // Calculate immediately
              intervalRef.current = setInterval(calculateTime, 1000)
            }
          } else {
            // Component is not visible - pause interval
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          }
        })
      },
      {
        threshold: 0.1 // Trigger when 10% of component is visible
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const milestones = [
    { days: 365, label: '1 năm ngày cưới', emoji: '💑' },
    { days: 730, label: '2 năm ngày cưới', emoji: '💎' },
    { days: 1000, label: '1000 ngày bên nhau', emoji: '👑' },
    { days: 1500, label: '1500 ngày hạnh phúc', emoji: '🌟' },
    { days: 1826, label: '5 năm ngày cưới', emoji: '🎉' },
  ]

  const nextMilestone = milestones.find(m => m.days > timeElapsed.totalDays)
  const daysToNext = nextMilestone ? nextMilestone.days - timeElapsed.totalDays : 0

  return (
    <div className="love-count-container" ref={containerRef}>
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`count-content ${showContent ? 'show' : ''}`}>
        <div className="count-header">
          <span className="count-emoji heartbeat">💕</span>
          <h1 className="count-title">Love Days</h1>
          <p className="count-subtitle">Ngày cưới của chúng mình</p>
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
          <div className="date-icon">💒</div>
          <div className="date-info">
            <span className="date-label">Ngày cưới</span>
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

        {/* Next Celebration */}
        {nextMilestone && (
          <div className="milestone-card">
            <div className="milestone-emoji">{nextMilestone.emoji}</div>
            <div className="milestone-info">
              <span className="milestone-label">Ngày đặc biệt tiếp theo</span>
              <span className="milestone-value">{nextMilestone.label}</span>
              <span className="milestone-countdown">Còn {daysToNext} ngày</span>
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
          <p>"Mỗi ngày bên anh là một ngày hạnh phúc của vợ"</p>
        </div>
      </div>
    </div>
  )
}

export default LoveCount
