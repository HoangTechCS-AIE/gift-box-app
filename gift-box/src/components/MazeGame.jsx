import { useState, useEffect, useCallback } from 'react'
import './MazeGame.css'

const MazeGame = ({ onBack }) => {
  const [showContent] = useState(true) // Remove setTimeout delay - use CSS transitions instead
  const [gameState, setGameState] = useState('menu') // menu, playing, question, won
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  // Maze: 0 = path, 1 = wall, 2 = goal, 3 = question
  const maze = [
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 3, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0],
    [1, 1, 0, 1, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 3],
    [0, 0, 3, 0, 0, 0, 2],
  ]

  // CÓ THỂ THAY ĐỔI CÁC CÂU HỎI NÀY
  const questions = [
    {
      id: 1,
      question: "Ngày kỷ niệm của chúng mình là ngày nào?",
      answers: ["14/02", "20/01", "10/03", "25/12"],
      correct: 0
    },
    {
      id: 2,
      question: "Em thích màu gì nhất?",
      answers: ["Hồng", "Xanh", "Đỏ", "Tím"],
      correct: 0
    },
    {
      id: 3,
      question: "Món ăn yêu thích của em là gì?",
      answers: ["Trà sữa", "Pizza", "Phở", "Cơm"],
      correct: 0
    },
    {
      id: 4,
      question: "Anh yêu em như thế nào?",
      answers: ["Rất nhiều 💕", "Bình thường", "Không biết", "Một chút"],
      correct: 0
    }
  ]

  const startGame = () => {
    setGameState('playing')
    setPlayerPos({ x: 0, y: 0 })
    setScore(0)
    setMoves(0)
    setAnsweredQuestions([])
  }

  const checkCell = useCallback((x, y) => {
    if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) return false
    if (maze[y][x] === 1) return false
    return true
  }, [])

  const movePlayer = useCallback((dx, dy) => {
    if (gameState !== 'playing') return

    const newX = playerPos.x + dx
    const newY = playerPos.y + dy

    if (!checkCell(newX, newY)) return

    setPlayerPos({ x: newX, y: newY })
    setMoves(m => m + 1)

    const cellValue = maze[newY][newX]
    
    // Check if it's a question cell
    if (cellValue === 3 && !answeredQuestions.includes(`${newX},${newY}`)) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
      setCurrentQuestion({ ...randomQuestion, position: `${newX},${newY}` })
      setGameState('question')
    }
    
    // Check if reached goal
    if (cellValue === 2) {
      setGameState('won')
    }
  }, [gameState, playerPos, checkCell, answeredQuestions])

  const answerQuestion = (answerIndex) => {
    if (answerIndex === currentQuestion.correct) {
      setScore(s => s + 10)
    }
    setAnsweredQuestions(prev => [...prev, currentQuestion.position])
    setCurrentQuestion(null)
    setGameState('playing')
  }

  // Touch/Swipe handling
  const [touchStart, setTouchStart] = useState(null)

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  }

  const handleTouchEnd = (e) => {
    if (!touchStart || gameState !== 'playing') return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }

    const dx = touchEnd.x - touchStart.x
    const dy = touchEnd.y - touchStart.y
    const minSwipe = 30

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > minSwipe) movePlayer(1, 0)
      else if (dx < -minSwipe) movePlayer(-1, 0)
    } else {
      if (dy > minSwipe) movePlayer(0, 1)
      else if (dy < -minSwipe) movePlayer(0, -1)
    }

    setTouchStart(null)
  }

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return
      
      switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break
        case 'ArrowDown': movePlayer(0, 1); break
        case 'ArrowLeft': movePlayer(-1, 0); break
        case 'ArrowRight': movePlayer(1, 0); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer, gameState])

  const renderMaze = () => (
    <div 
      className="maze-grid"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {maze.map((row, y) => (
        <div key={y} className="maze-row">
          {row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y
            const isGoal = cell === 2
            const isQuestion = cell === 3 && !answeredQuestions.includes(`${x},${y}`)
            const isWall = cell === 1
            const isAnswered = answeredQuestions.includes(`${x},${y}`)

            return (
              <div
                key={x}
                className={`maze-cell ${isWall ? 'wall' : 'path'} ${isGoal ? 'goal' : ''} ${isQuestion ? 'question' : ''} ${isAnswered ? 'answered' : ''}`}
              >
                {isPlayer && <span className="player">👩</span>}
                {isGoal && !isPlayer && <span className="goal-icon">🧑</span>}
                {isQuestion && !isPlayer && <span className="question-icon">❓</span>}
                {isAnswered && !isPlayer && <span className="check-icon">✓</span>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  return (
    <div className="game-container">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`game-content ${showContent ? 'show' : ''}`}>
        <div className="game-header">
          <span className="game-emoji">🎮</span>
          <h1 className="game-title">Love Maze</h1>
          <p className="game-subtitle">Tìm đường đến bên anh 💕</p>
        </div>

        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="game-menu">
            <div className="menu-card">
              <div className="menu-icon">👩 ❤️ 🧑</div>
              <h3>Cách chơi</h3>
              <ul className="rules-list">
                <li>🎯 Di chuyển avatar tìm đến chồng yêu</li>
                <li>❓ Trả lời câu hỏi trên đường đi</li>
                <li>📱 Vuốt hoặc dùng nút để di chuyển</li>
                <li>💕 Tìm được anh = Chiến thắng!</li>
              </ul>
              <button className="start-btn" onClick={startGame}>
                Bắt đầu chơi 🎮
              </button>
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div className="game-playing">
            <div className="game-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👣</span>
                <span className="stat-value">{moves}</span>
              </div>
            </div>

            {renderMaze()}

            <div className="control-buttons">
              <div className="control-row">
                <button className="control-btn" onClick={() => movePlayer(0, -1)}>↑</button>
              </div>
              <div className="control-row">
                <button className="control-btn" onClick={() => movePlayer(-1, 0)}>←</button>
                <button className="control-btn" onClick={() => movePlayer(0, 1)}>↓</button>
                <button className="control-btn" onClick={() => movePlayer(1, 0)}>→</button>
              </div>
            </div>

            <p className="control-hint">Vuốt màn hình hoặc dùng nút để di chuyển</p>
          </div>
        )}

        {/* Question State */}
        {gameState === 'question' && currentQuestion && (
          <div className="question-modal">
            <div className="question-card">
              <span className="question-emoji">❓</span>
              <h3 className="question-text">{currentQuestion.question}</h3>
              <div className="answers-grid">
                {currentQuestion.answers.map((answer, index) => (
                  <button
                    key={index}
                    className="answer-btn"
                    onClick={() => answerQuestion(index)}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Won State */}
        {gameState === 'won' && (
          <div className="won-modal">
            <div className="won-card">
              <div className="won-hearts">💕💖💕</div>
              <h2 className="won-title">Tìm thấy anh rồi!</h2>
              <p className="won-message">
                Em luôn tìm được đường đến bên anh 💕
              </p>
              <div className="won-stats">
                <div className="won-stat">
                  <span className="stat-label">Điểm số</span>
                  <span className="stat-value">⭐ {score}</span>
                </div>
                <div className="won-stat">
                  <span className="stat-label">Số bước</span>
                  <span className="stat-value">👣 {moves}</span>
                </div>
              </div>
              <div className="won-couple">
                <span>👩</span>
                <span className="heart-between">❤️</span>
                <span>🧑</span>
              </div>
              <button className="play-again-btn" onClick={startGame}>
                Chơi lại 🎮
              </button>
              <button className="back-home-btn" onClick={onBack}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MazeGame
