import { useState, useEffect, useMemo, useRef } from 'react'
import './LoveMemories.css'

const LoveMemories = ({ onBack }) => {
  const [showContent, setShowContent] = useState(true) // Remove setTimeout delay
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const imageRefs = useRef({})

  useEffect(() => {
    // Preload first image of each category
    const preloadImages = [
      '/buoi_hen_dau_tien.jpeg', // first-date
      '/henho1.jpeg', // dating
      '/du_lich1.jpeg', // travel
      '/ngaycuoi1.jpg', // wedding
      '/thienthannho1.jpg' // baby
    ]

    preloadImages.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }, [])

  // CẤU TRÚC DỮ LIỆU MỚI VỚI 5 CHỦ ĐỀ
  const categories = [
    { id: 'all', name: 'Tất cả', icon: '📁' },
    { id: 'first-date', name: 'Buổi hẹn đầu tiên', icon: '💕' },
    { id: 'dating', name: 'Hẹn Hò', icon: '💑' },
    { id: 'travel', name: 'Du lịch', icon: '✈️' },
    { id: 'wedding', name: 'Ngày cưới', icon: '💒' },
    { id: 'baby', name: 'Thiên thần nhỏ', icon: '👶' }
  ]

  // Dữ liệu ảnh theo từng chủ đề
  const memories = [
    // === BUỔI HẸN ĐẦU TIÊN (1 ảnh) ===
    {
      id: 1,
      category: 'first-date',
      type: 'image',
      url: '/buoi_hen_dau_tien.jpeg'
    },
    // === HẸN HÒ (4 ảnh) ===
    {
      id: 2,
      category: 'dating',
      type: 'image',
      url: '/henho1.jpeg'
    },
    {
      id: 3,
      category: 'dating',
      type: 'image',
      url: '/henho2.jpeg'
    },
    {
      id: 4,
      category: 'dating',
      type: 'image',
      url: '/henho3.jpeg'
    },
    {
      id: 5,
      category: 'dating',
      type: 'image',
      url: '/henho4.jpeg'
    },
    // === DU LỊCH (5 ảnh) ===
    {
      id: 6,
      category: 'travel',
      type: 'image',
      url: '/du_lich1.jpeg'
    },
    {
      id: 7,
      category: 'travel',
      type: 'image',
      url: '/du_lich2lich2.jpg'
    },
    {
      id: 8,
      category: 'travel',
      type: 'image',
      url: '/du_lich3.jpg'
    },
    {
      id: 9,
      category: 'travel',
      type: 'image',
      url: '/du_lich4.jpg'
    },
    {
      id: 10,
      category: 'travel',
      type: 'image',
      url: '/du_lich5.jpg'
    },
    // === NGÀY CƯỚI (6 ảnh) ===
    {
      id: 11,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi1.jpg'
    },
    {
      id: 12,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi2.jpg'
    },
    {
      id: 13,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi3.jpg'
    },
    {
      id: 14,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi4.jpg'
    },
    {
      id: 15,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi5.jpg'
    },
    {
      id: 16,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi6.jpg'
    },
    // === THIÊN THẦNH NHỎ (5 ảnh) ===
    {
      id: 17,
      category: 'baby',
      type: 'image',
      url: '/thienthannho1.jpg'
    },
    {
      id: 18,
      category: 'baby',
      type: 'image',
      url: '/thienthannho2.jpg'
    },
    {
      id: 19,
      category: 'baby',
      type: 'image',
      url: '/thienthannho3.jpg'
    },
    {
      id: 20,
      category: 'baby',
      type: 'image',
      url: '/thienthannho4.jpg'
    },
    {
      id: 21,
      category: 'baby',
      type: 'image',
      url: '/thienthannho5.jpg'
    }
  ]

  // Memoize filtered memories to prevent recalculation
  const filteredMemories = useMemo(() => {
    return selectedCategory === 'all'
      ? memories
      : memories.filter(m => m.category === selectedCategory)
  }, [selectedCategory])

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat ? cat.name : ''
  }

  const openViewer = (memory, index) => {
    setSelectedMemory(memory)
    setCurrentIndex(index)
  }

  const closeViewer = () => {
    setSelectedMemory(null)
  }

  const navigateMemory = (direction) => {
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = filteredMemories.length - 1
    if (newIndex >= filteredMemories.length) newIndex = 0
    setCurrentIndex(newIndex)
    setSelectedMemory(filteredMemories[newIndex])
  }

  // Memoize category counts
  const categoryCounts = useMemo(() => {
    const counts = {}
    categories.forEach(cat => {
      if (cat.id === 'all') {
        counts[cat.id] = memories.length
      } else {
        counts[cat.id] = memories.filter(m => m.category === cat.id).length
      }
    })
    return counts
  }, [])

  const getCategoryCount = (catId) => categoryCounts[catId] || 0

  // Intersection Observer for lazy loading images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before image enters viewport
      }
    )

    // Observe images after a short delay to ensure they're rendered
    const timeoutId = setTimeout(() => {
      Object.values(imageRefs.current).forEach(img => {
        if (img && img.dataset?.src) {
          observer.observe(img)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [filteredMemories])

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

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id)
                setSelectedMemory(null)
              }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">({getCategoryCount(cat.id)})</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredMemories.map((memory, index) => (
            <div
              key={memory.id}
              className={`gallery-item ${showContent ? 'show' : ''}`}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              onClick={() => openViewer(memory, index)}
            >
              <div className="gallery-image-wrapper">
                <img
                  ref={el => imageRefs.current[memory.id] = el}
                  src={index < 4 ? memory.url : undefined} // Load first 4 images immediately
                  data-src={index >= 4 ? memory.url : undefined} // Lazy load the rest
                  alt={getCategoryName(memory.category)}
                  className="gallery-image"
                  loading={index < 4 ? "eager" : "lazy"}
                />
                <div className="gallery-overlay">
                  {/* Date removed */}
                </div>
                {memory.type === 'video' && (
                  <div className="play-icon">▶</div>
                )}
              </div>
              <div className="gallery-info">
                <h4>{getCategoryName(memory.category)}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMemories.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>Chưa có ảnh trong mục này</p>
          </div>
        )}
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
              <img src={selectedMemory.url} alt={getCategoryName(selectedMemory.category)} />
            </div>

            <button className="viewer-nav next" onClick={() => navigateMemory(1)}>
              ›
            </button>

            <div className="viewer-info">
              <h3>{getCategoryName(selectedMemory.category)}</h3>
            </div>

            <div className="viewer-counter">
              {currentIndex + 1} / {filteredMemories.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoveMemories
