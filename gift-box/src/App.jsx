import { useState, useMemo } from 'react'
import './App.css'
import Home from './components/Home'
import LoveCount from './components/LoveCount'
import LoveMemories from './components/LoveMemories'
import LoveLetter from './components/LoveLetter'
import LovePhotobooth from './components/LovePhotobooth'
import LovePet from './components/LovePet'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Memoize floating hearts to prevent re-creation on every render
  const floatingHearts = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      fontSize: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.4
    }))
  }, [])

  return (
    <div className="app-container">
      {/* Floating Hearts Background */}
      <div className="floating-hearts">
        {floatingHearts.map((heart) => (
          <div 
            key={heart.id} 
            className="heart-particle"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.fontSize}px`,
              opacity: heart.opacity
            }}
          >
            💕
          </div>
        ))}
      </div>
      
      {/* Component Caching: Render all components but hide inactive ones */}
      <div className={`page-wrapper ${currentPage === 'home' ? 'active' : 'hidden'}`}>
        <Home onNavigate={setCurrentPage} />
      </div>
      
      <div className={`page-wrapper ${currentPage === 'lovecount' ? 'active' : 'hidden'}`}>
        <LoveCount onBack={() => setCurrentPage('home')} />
      </div>
      
      <div className={`page-wrapper ${currentPage === 'memories' ? 'active' : 'hidden'}`}>
        <LoveMemories onBack={() => setCurrentPage('home')} />
      </div>
      
      <div className={`page-wrapper ${currentPage === 'letter' ? 'active' : 'hidden'}`}>
        <LoveLetter onBack={() => setCurrentPage('home')} />
      </div>
      
      <div className={`page-wrapper ${currentPage === 'photobooth' ? 'active' : 'hidden'}`}>
        <LovePhotobooth onBack={() => setCurrentPage('home')} />
      </div>
      
      <div className={`page-wrapper ${currentPage === 'pet' ? 'active' : 'hidden'}`}>
        <LovePet onBack={() => setCurrentPage('home')} />
      </div>
    </div>
  )
}

export default App
