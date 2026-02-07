import { useState } from 'react'
import './Home.css'

const Home = ({ onNavigate }) => {
  const [showContent] = useState(true) // Remove setTimeout delay - use CSS transitions instead

  const menuItems = [
    {
      id: 'lovecount',
      title: 'Love Days',
      subtitle: 'Đếm ngày yêu thương',
      icon: '📅',
      emoji: '💕',
      color: '#ff6b9d'
    },
    {
      id: 'memories',
      title: 'Love Memories',
      subtitle: 'Kỷ niệm của chúng mình',
      icon: '📸',
      emoji: '💝',
      color: '#ff8a80'
    },
    {
      id: 'letter',
      title: 'Love Letter',
      subtitle: 'Lời yêu thương',
      icon: '💌',
      emoji: '💗',
      color: '#ff7eb3'
    },
    {
      id: 'photobooth',
      title: 'Love Photobooth',
      subtitle: 'Chụp ảnh kỷ niệm',
      icon: '📷',
      emoji: '💖',
      color: '#f06292'
    },
    {
      id: 'pet',
      title: 'Love Pet',
      subtitle: 'Thú cưng của chúng ta',
      icon: '🐾',
      emoji: '🦋',
      color: '#ec407a'
    }
  ]

  return (
    <div className="home-container">
      {/* Header */}
      <div className={`home-header ${showContent ? 'show' : ''}`}>
        <div className="heart-logo">
          <span className="heart-icon">💕</span>
        </div>
        <h1 className="home-title">Our Love Story</h1>
        <p className="home-subtitle">Gửi người chồng yêu dấu của em 💕</p>
      </div>

      {/* Menu Grid */}
      <div className="menu-container">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={`menu-card ${showContent ? 'show' : ''}`}
            style={{ 
              animationDelay: `${0.1 + index * 0.1}s`,
              '--card-color': item.color
            }}
            onClick={() => onNavigate(item.id)}
          >
            <div className="card-icon-wrapper">
              <div className="card-icon">{item.icon}</div>
              <div className="card-emoji floating">{item.emoji}</div>
            </div>
            <div className="card-content">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-subtitle">{item.subtitle}</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`home-footer ${showContent ? 'show' : ''}`}>
        <p>Made with 💕 for you</p>
      </div>
    </div>
  )
}

export default Home
