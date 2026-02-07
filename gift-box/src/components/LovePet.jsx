import { useState, useEffect, useRef } from 'react'
import './LovePet.css'

const LovePet = ({ onBack }) => {
  const [showContent, setShowContent] = useState(true) // Remove setTimeout delay
  const [petMood, setPetMood] = useState('happy') // happy, love, sleepy, excited
  const [hearts, setHearts] = useState([])
  const [petStats, setPetStats] = useState({
    love: 80,
    happiness: 90,
    energy: 70
  })
  const [message, setMessage] = useState('')
  const [isFeeding, setIsFeeding] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)

  // Giảm stats theo thời gian - pause when not visible
  useEffect(() => {
    if (!containerRef.current) return

    const decreaseStats = () => {
      setPetStats(prev => ({
        love: Math.max(0, prev.love - 1),
        happiness: Math.max(0, prev.happiness - 1),
        energy: Math.max(0, prev.energy - 0.5)
      }))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Component is visible - start/resume interval
            if (!intervalRef.current) {
              intervalRef.current = setInterval(decreaseStats, 10000)
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

  // Update mood based on stats
  useEffect(() => {
    const avgStats = (petStats.love + petStats.happiness + petStats.energy) / 3
    if (avgStats > 80) setPetMood('love')
    else if (avgStats > 60) setPetMood('happy')
    else if (avgStats > 40) setPetMood('sleepy')
    else setPetMood('sad')
  }, [petStats])

  const petEmojis = {
    happy: '🐰',
    love: '🥰',
    sleepy: '😴',
    sad: '🥺',
    excited: '🎉'
  }

  const createHearts = (x, y) => {
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y,
      emoji: ['💕', '💖', '💗', '💓', '✨'][Math.floor(Math.random() * 5)]
    }))
    setHearts(prev => [...prev, ...newHearts])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.includes(h)))
    }, 1500)
  }

  const petThePet = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    createHearts(x, y)
    
    setPetStats(prev => ({
      ...prev,
      love: Math.min(100, prev.love + 5),
      happiness: Math.min(100, prev.happiness + 3)
    }))
    setPetMood('love')
    setMessage('Thích được vuốt ve! 💕')
    setTimeout(() => setMessage(''), 2000)
  }

  const feedPet = () => {
    setIsFeeding(true)
    setPetMood('excited')
    setMessage('Ngon quá! 🍰')
    setPetStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 20),
      happiness: Math.min(100, prev.happiness + 10)
    }))
    setTimeout(() => {
      setIsFeeding(false)
      setMessage('')
    }, 2000)
  }

  const playWithPet = () => {
    setPetMood('excited')
    setMessage('Vui quá! 🎮')
    setPetStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10),
      love: Math.min(100, prev.love + 5)
    }))
    setTimeout(() => setMessage(''), 2000)
  }

  const singToPet = () => {
    setPetMood('love')
    setMessage('Hay quá! 🎵')
    setPetStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      love: Math.min(100, prev.love + 10)
    }))
    setTimeout(() => setMessage(''), 2000)
  }

  const sleepPet = () => {
    setPetMood('sleepy')
    setMessage('Zzzz... 💤')
    setPetStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30)
    }))
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="pet-container" ref={containerRef}>
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`pet-content ${showContent ? 'show' : ''}`}>
        <div className="pet-header">
          <span className="pet-header-emoji">🐾</span>
          <h1 className="pet-title">Love Pet</h1>
          <p className="pet-subtitle">Thú cưng tình yêu của chúng mình</p>
        </div>

        {/* Pet Display */}
        <div className="pet-display-card">
          <div className="pet-name">
            <span>✨</span> Bunny <span>✨</span>
          </div>
          
          <div 
            className={`pet-avatar ${petMood} ${isFeeding ? 'feeding' : ''}`}
            onClick={petThePet}
          >
            <span className="pet-emoji">{petEmojis[petMood]}</span>
            
            {/* Floating Hearts */}
            {hearts.map(heart => (
              <span
                key={heart.id}
                className="floating-heart"
                style={{
                  left: heart.x,
                  top: heart.y
                }}
              >
                {heart.emoji}
              </span>
            ))}
          </div>

          {message && (
            <div className="pet-message">
              <span>{message}</span>
            </div>
          )}

          <p className="pet-hint">Chạm để vuốt ve 💕</p>
        </div>

        {/* Stats */}
        <div className="pet-stats-card">
          <div className="stat-row">
            <span className="stat-label">💕 Tình yêu</span>
            <div className="stat-bar">
              <div 
                className="stat-fill love" 
                style={{ width: `${petStats.love}%` }}
              />
            </div>
            <span className="stat-percent">{Math.round(petStats.love)}%</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">😊 Vui vẻ</span>
            <div className="stat-bar">
              <div 
                className="stat-fill happy" 
                style={{ width: `${petStats.happiness}%` }}
              />
            </div>
            <span className="stat-percent">{Math.round(petStats.happiness)}%</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">⚡ Năng lượng</span>
            <div className="stat-bar">
              <div 
                className="stat-fill energy" 
                style={{ width: `${petStats.energy}%` }}
              />
            </div>
            <span className="stat-percent">{Math.round(petStats.energy)}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pet-actions">
          <button className="action-btn" onClick={feedPet}>
            <span className="action-icon">🍰</span>
            <span className="action-label">Cho ăn</span>
          </button>
          
          <button className="action-btn" onClick={playWithPet}>
            <span className="action-icon">🎮</span>
            <span className="action-label">Chơi</span>
          </button>
          
          <button className="action-btn" onClick={singToPet}>
            <span className="action-icon">🎵</span>
            <span className="action-label">Hát</span>
          </button>
          
          <button className="action-btn" onClick={sleepPet}>
            <span className="action-icon">💤</span>
            <span className="action-label">Ngủ</span>
          </button>
        </div>

        {/* Pet Info */}
        <div className="pet-info-card">
          <p className="pet-quote">
            "Bunny đại diện cho tình yêu của em và anh! 
            Anh chăm sóc Bunny thật tốt nhé! 💕"
          </p>
        </div>
      </div>
    </div>
  )
}

export default LovePet
