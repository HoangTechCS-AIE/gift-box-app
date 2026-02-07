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
      url: '/buoi_hen_dau_tien.jpeg',
      title: 'Buổi hẹn đầu tiên',
      date: '14/02/2024',
      description: 'Ngày định mệnh - lần đầu gặp anh. Em vẫn nhớ như in ánh mắt anh ngày hôm đó 💕'
    },
    // === HẸN HÒ (4 ảnh) ===
    {
      id: 2,
      category: 'dating',
      type: 'image',
      url: '/henho1.jpeg',
      title: 'Hẹn hò #1',
      date: '20/02/2024',
      description: 'Buổi hẹn đầu tiên chỉ có hai đứa mình, cà phê và những câu chuyện'
    },
    {
      id: 3,
      category: 'dating',
      type: 'image',
      url: '/henho2.jpeg',
      title: 'Hẹn hò #2',
      date: '25/02/2024',
      description: 'Anh đưa em đi chơi, em vui lắm! 🥰'
    },
    {
      id: 4,
      category: 'dating',
      type: 'image',
      url: '/henho3.jpeg',
      title: 'Hẹn hò #3',
      date: '10/03/2024',
      description: 'Những ngày tháng yêu đương đầu tiên'
    },
    {
      id: 5,
      category: 'dating',
      type: 'image',
      url: '/henho4.jpeg',
      title: 'Hẹn hò #4',
      date: '15/03/2024',
      description: 'Cùng nhau khám phá những điều mới mẻ 💖'
    },
    // === DU LỊCH (5 ảnh) ===
    {
      id: 6,
      category: 'travel',
      type: 'image',
      url: '/du_lich1.jpeg',
      title: 'Du lịch - Ngày 1',
      date: '15/06/2024',
      description: 'Bắt đầu chuyến đi đầu tiên cùng nhau! 🧳'
    },
    {
      id: 7,
      category: 'travel',
      type: 'image',
      url: '/du_lich2lich2.jpg',
      title: 'Du lịch - Ngày 2',
      date: '16/06/2024',
      description: 'Khám phá những địa điểm mới, chụp thật nhiều ảnh 📸'
    },
    {
      id: 8,
      category: 'travel',
      type: 'image',
      url: '/du_lich3.jpg',
      title: 'Du lịch - Ngày 3',
      date: '17/06/2024',
      description: 'Những khoảnh khắc tuyệt vời bên nhau 🌴'
    },
    {
      id: 9,
      category: 'travel',
      type: 'image',
      url: '/du_lich4.jpg',
      title: 'Du lịch - Ngày 4',
      date: '18/06/2024',
      description: 'Tận hưởng từng giây phút bên anh ❤️'
    },
    {
      id: 10,
      category: 'travel',
      type: 'image',
      url: '/du_lich5.jpg',
      title: 'Du lịch - Ngày 5',
      date: '19/06/2024',
      description: 'Chuyến đi kết thúc nhưng kỷ niệm còn mãi ✨'
    },
    // === NGÀY CƯỚI (6 ảnh) ===
    {
      id: 11,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi1.jpg',
      title: 'Ngày cưới - Chuẩn bị',
      date: '05/10/2024',
      description: 'Sáng ngày cưới, em run lắm nhưng cũng hạnh phúc lắm! 💍'
    },
    {
      id: 12,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi2.jpg',
      title: 'Ngày cưới - Lễ cưới',
      date: '05/10/2024',
      description: 'Khoảnh khắc trao nhẫn - em là cô dâu của anh 👰🤵'
    },
    {
      id: 13,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi3.jpg',
      title: 'Ngày cưới - Ảnh cưới',
      date: '05/10/2024',
      description: 'Những bức ảnh cưới đẹp nhất đời em 📷'
    },
    {
      id: 14,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi4.jpg',
      title: 'Ngày cưới - Lễ ăn hỏi',
      date: '04/10/2024',
      description: 'Lễ ăn hỏi - gia đình hai bên sum họp 💑'
    },
    {
      id: 15,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi5.jpg',
      title: 'Ngày cưới - Hậu trường',
      date: '05/10/2024',
      description: 'Những khoảnh khắc hậu trường đáng yêu 🎬'
    },
    {
      id: 16,
      category: 'wedding',
      type: 'image',
      url: '/ngaycuoi6.jpg',
      title: 'Ngày cưới - Đám cưới',
      date: '05/10/2024',
      description: 'Đám cưới của chúng mình - ngày hạnh phúc nhất! 🥳'
    },
    // === THIÊN THẦNH NHỎ (5 ảnh) ===
    {
      id: 17,
      category: 'baby',
      type: 'image',
      url: '/thienthannho1.jpg',
      title: 'Thiên thần nhỏ - Tin vui',
      date: '15/11/2024',
      description: 'Em biết tin mình có baby rồi! Em vui khóc luôn! 👶'
    },
    {
      id: 18,
      category: 'baby',
      type: 'image',
      url: '/thienthannho2.jpg',
      title: 'Thiên thần nhỏ - Siêu âm',
      date: '20/11/2024',
      description: 'Lần đầu tiên nhìn thấy hình siêu âm của con 🥺'
    },
    {
      id: 19,
      category: 'baby',
      type: 'image',
      url: '/thienthannho3.jpg',
      title: 'Thiên thần nhỏ - Baby yêu',
      date: '10/12/2024',
      description: 'Em đã yêu con từ khi chưa gặp mặt 💕'
    },
    {
      id: 20,
      category: 'baby',
      type: 'image',
      url: '/thienthannho4.jpg',
      title: 'Thiên thần nhỏ - Chờ con',
      date: '25/12/2024',
      description: 'Mùa Giáng sinh đầu tiên có con bên 🥰'
    },
    {
      id: 21,
      category: 'baby',
      type: 'image',
      url: '/thienthannho5.jpg',
      title: 'Thiên thần nhỏ - Sắp gặp',
      date: '10/01/2025',
      description: 'Sắp gặp con rồi, em và anh háo hức lắm! 🤰'
    }
  ]

  // Memoize filtered memories to prevent recalculation
  const filteredMemories = useMemo(() => {
    return selectedCategory === 'all'
      ? memories
      : memories.filter(m => m.category === selectedCategory)
  }, [selectedCategory])

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
                  alt={memory.title} 
                  className="gallery-image" 
                  loading={index < 4 ? "eager" : "lazy"}
                />
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
              {currentIndex + 1} / {filteredMemories.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoveMemories
