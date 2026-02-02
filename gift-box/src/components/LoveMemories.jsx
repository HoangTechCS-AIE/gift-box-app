import { useState, useEffect } from 'react'
import './LoveMemories.css'

const LoveMemories = ({ onBack }) => {
  const [showContent, setShowContent] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100)
  }, [])

  // CÓ THỂ THAY ĐỔI DANH SÁCH KỶ NIỆM NÀY
  const memories = [
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400',
      title: 'Lần đầu gặp nhau',
      date: '14/02/2024',
      description: 'Ngày định mệnh của chúng mình 💕'
    },
    {
      id: 2,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
      title: 'Buổi hẹn đầu tiên',
      date: '20/02/2024',
      description: 'Cùng nhau đi cafe, trò chuyện cả ngày 🥰'
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400',
      title: 'Du lịch cùng nhau',
      date: '15/06/2024',
      description: 'Chuyến đi biển đáng nhớ 🏖️'
    },
    {
      id: 4,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
      title: 'Sinh nhật em',
      date: '10/08/2024',
      description: 'Happy birthday baby! 🎂'
    },
    {
      id: 5,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
      title: 'Noel bên nhau',
      date: '25/12/2024',
      description: 'Giáng sinh ấm áp 🎄'
    },
    {
      id: 6,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400',
      title: 'Countdown 2025',
      date: '31/12/2024',
      description: 'Cùng đón năm mới 🎉'
    }
  ]

  const openViewer = (memory, index) => {
    setSelectedMemory(memory)
    setCurrentIndex(index)
  }

  const closeViewer = () => {
    setSelectedMemory(null)
  }

  const navigateMemory = (direction) => {
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = memories.length - 1
    if (newIndex >= memories.length) newIndex = 0
    setCurrentIndex(newIndex)
    setSelectedMemory(memories[newIndex])
  }

  return (
    <div className="memories-container">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`memories-content ${showContent ? 'show' : ''}`}>
        <div className="memories-header">
          <span className="memories-emoji">📸</span>
          <h1 className="memories-title">Love Memories</h1>
          <p className="memories-subtitle">Những khoảnh khắc đáng nhớ của chúng mình</p>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              className={`gallery-item ${showContent ? 'show' : ''}`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              onClick={() => openViewer(memory, index)}
            >
              <div className="gallery-image-wrapper">
                <img src={memory.url} alt={memory.title} className="gallery-image" />
                <div className="gallery-overlay">
                  <span className="gallery-date">{memory.date}</span>
                </div>
                {memory.type === 'video' && (
                  <div className="play-icon">▶</div>
                )}
              </div>
              <div className="gallery-info">
                <h4>{memory.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Add Memory Button */}
        <div className="add-memory-section">
          <p className="add-hint">Thêm ảnh của bạn vào thư mục assets</p>
        </div>
      </div>

      {/* Full Screen Viewer */}
      {selectedMemory && (
        <div className="viewer-overlay" onClick={closeViewer}>
          <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
            <button className="viewer-close" onClick={closeViewer}>×</button>
            
            <button className="viewer-nav prev" onClick={() => navigateMemory(-1)}>
              ‹
            </button>
            
            <div className="viewer-image-container">
              <img src={selectedMemory.url} alt={selectedMemory.title} />
            </div>
            
            <button className="viewer-nav next" onClick={() => navigateMemory(1)}>
              ›
            </button>
            
            <div className="viewer-info">
              <h3>{selectedMemory.title}</h3>
              <span className="viewer-date">📅 {selectedMemory.date}</span>
              <p>{selectedMemory.description}</p>
            </div>
            
            <div className="viewer-counter">
              {currentIndex + 1} / {memories.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoveMemories
