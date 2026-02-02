import { useState, useEffect } from 'react'
import './App.css'
import Home from './components/Home'
import LoveCount from './components/LoveCount'
import LoveMemories from './components/LoveMemories'
import LoveLetter from './components/LoveLetter'
import MazeGame from './components/MazeGame'
import LovePet from './components/LovePet'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isPlaying, setIsPlaying] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />
      case 'lovecount':
        return <LoveCount onBack={() => setCurrentPage('home')} />
      case 'memories':
        return <LoveMemories onBack={() => setCurrentPage('home')} />
      case 'letter':
        return <LoveLetter onBack={() => setCurrentPage('home')} />
      case 'game':
        return <MazeGame onBack={() => setCurrentPage('home')} />
      case 'pet':
        return <LovePet onBack={() => setCurrentPage('home')} />
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app-container">
      {/* Floating Hearts Background */}
      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="heart-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${10 + Math.random() * 20}px`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          >
            💕
          </div>
        ))}
      </div>
      
      {renderPage()}
    </div>
  )
}

export default App
