import { useState, useEffect } from 'react'
import './LoveLetter.css'

const LoveLetter = ({ onBack }) => {
  const [showContent, setShowContent] = useState(false)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100)
  }, [])

  // CÓ THỂ THAY ĐỔI NỘI DUNG THƯ TÌNH NÀY
  const letters = [
    {
      id: 1,
      title: "Gửi chồng yêu",
      content: `Anh yêu của em,

Kể từ ngày gặp anh, cuộc sống của em đã hoàn toàn thay đổi. Anh là ánh sáng, là niềm vui, là tất cả những gì tuyệt vời nhất mà em từng mong ước.

Mỗi ngày được ở bên anh là một ngày hạnh phúc. Em yêu anh từ những điều nhỏ nhất - nụ cười của anh, giọng nói của anh, cách anh quan tâm đến em.

Cảm ơn anh đã đến bên em, đã yêu thương em. Em hứa sẽ luôn bên anh, sẽ luôn yêu anh mãi mãi.

Yêu anh nhiều lắm! 💕`,
      signature: "Vợ yêu của anh",
      emoji: "💌"
    },
    {
      id: 2,
      title: "Valentine's Day",
      content: `Happy Valentine's Day anh yêu! 💝

Hôm nay là ngày của tình yêu, và em muốn nói với anh rằng - Anh là điều tuyệt vời nhất đã đến với cuộc đời em.

Em không cần hoa hồng hay chocolate, vì đã có anh - người tuyệt vời nhất rồi.

Cảm ơn anh vì đã là Valentine của em, không chỉ hôm nay mà mãi mãi.

I love you! 🌹`,
      signature: "Forever yours",
      emoji: "🌹"
    },
    {
      id: 3,
      title: "Lời hứa với anh",
      content: `Anh yêu của em,

Em hứa sẽ luôn:
💕 Yêu anh mỗi ngày nhiều hơn ngày hôm qua
💕 Bên anh trong mọi lúc vui buồn
💕 Làm anh cười khi anh mệt mỏi
💕 Nắm tay anh đi qua mọi khó khăn
💕 Là hậu phương vững chắc cho anh

Anh là tình yêu của đời em, là người em muốn cùng đi đến cuối con đường.

Yêu anh! 💖`,
      signature: "Vợ của anh",
      emoji: "💍"
    }
  ]

  const openEnvelope = () => {
    setIsEnvelopeOpen(true)
    setTimeout(() => setShowLetter(true), 500)
  }

  const closeLetter = () => {
    setShowLetter(false)
    setTimeout(() => setIsEnvelopeOpen(false), 300)
  }

  const nextLetter = () => {
    setCurrentLetterIndex((prev) => (prev + 1) % letters.length)
  }

  const prevLetter = () => {
    setCurrentLetterIndex((prev) => (prev - 1 + letters.length) % letters.length)
  }

  const currentLetter = letters[currentLetterIndex]

  return (
    <div className="letter-container">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`letter-content ${showContent ? 'show' : ''}`}>
        <div className="letter-header">
          <span className="letter-emoji">💌</span>
          <h1 className="letter-title">Love Letter</h1>
          <p className="letter-subtitle">Những lời yêu thương dành cho anh</p>
        </div>

        {/* Envelope Selection */}
        <div className="envelope-selection">
          {letters.map((letter, index) => (
            <div
              key={letter.id}
              className={`envelope-item ${currentLetterIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentLetterIndex(index)}
            >
              <span className="envelope-emoji">{letter.emoji}</span>
              <span className="envelope-label">{letter.title}</span>
            </div>
          ))}
        </div>

        {/* Envelope */}
        <div className={`envelope-wrapper ${isEnvelopeOpen ? 'open' : ''}`}>
          <div className="envelope" onClick={openEnvelope}>
            <div className="envelope-flap"></div>
            <div className="envelope-body">
              <div className="envelope-heart">💗</div>
              <p className="tap-hint">{!isEnvelopeOpen ? 'Chạm để mở thư' : ''}</p>
            </div>
          </div>
        </div>

        {/* Letter Modal */}
        {showLetter && (
          <div className="letter-modal-overlay" onClick={closeLetter}>
            <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
              <button className="letter-close" onClick={closeLetter}>×</button>
              
              <div className="letter-paper">
                <div className="paper-decoration">
                  <span>💕</span>
                  <span>💕</span>
                  <span>💕</span>
                </div>
                
                <h2 className="paper-title">{currentLetter.title}</h2>
                
                <div className="paper-content">
                  {currentLetter.content.split('\n').map((line, i) => (
                    <p key={i}>{line || <br />}</p>
                  ))}
                </div>
                
                <div className="paper-signature">
                  <span className="signature-heart">💖</span>
                  <span className="signature-text">{currentLetter.signature}</span>
                </div>
              </div>

              <div className="letter-navigation">
                <button onClick={prevLetter} className="letter-nav-btn">
                  ← Thư trước
                </button>
                <span className="letter-counter">
                  {currentLetterIndex + 1} / {letters.length}
                </span>
                <button onClick={nextLetter} className="letter-nav-btn">
                  Thư sau →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Love Quotes */}
        <div className="love-quotes-section">
          <h3>💕 Quotes tình yêu 💕</h3>
          <div className="quotes-carousel">
            <div className="quote-card">
              <p>"Anh là giấc mơ đẹp nhất mà em không muốn tỉnh dậy"</p>
            </div>
            <div className="quote-card">
              <p>"Yêu anh là điều tự nhiên nhất trên đời"</p>
            </div>
            <div className="quote-card">
              <p>"Có anh, mỗi ngày đều là Valentine"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoveLetter
