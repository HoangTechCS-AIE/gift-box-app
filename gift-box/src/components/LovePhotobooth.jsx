import { useState, useRef, useEffect } from 'react'
import './LovePhotobooth.css'

const LovePhotobooth = ({ onBack }) => {
  const [showContent] = useState(true)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [selectedFrame, setSelectedFrame] = useState('heart')
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState(null)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Các khung ảnh có sẵn
  const frames = [
    { id: 'heart', name: 'Trái tim', emoji: '💕' },
    { id: 'love', name: 'Tình yêu', emoji: '💖' },
    { id: 'sparkle', name: 'Lấp lánh', emoji: '✨' },
    { id: 'rose', name: 'Hoa hồng', emoji: '🌹' },
    { id: 'kiss', name: 'Nụ hôn', emoji: '💋' },
    { id: 'wedding', name: 'Ngày cưới', emoji: '💍' }
  ]

  // Khởi động camera
  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      streamRef.current = stream
      setCameraActive(true)
      
      // Sử dụng setTimeout để đảm bảo state đã được update và video element đã render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          
          // Đảm bảo video được load và play
          const playVideo = async () => {
            try {
              if (videoRef.current) {
                await videoRef.current.play()
                console.log('Video started playing')
              }
            } catch (err) {
              console.error('Error playing video:', err)
              setError('Không thể phát video. Vui lòng thử lại.')
            }
          }

          videoRef.current.onloadedmetadata = playVideo
          videoRef.current.oncanplay = playVideo
          
          // Try to play immediately if video is already ready
          if (videoRef.current.readyState >= 2) {
            playVideo()
          }
        }
      }, 100)
    } catch (err) {
      let errorMessage = 'Không thể truy cập camera. '
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += 'Vui lòng cấp quyền truy cập camera.'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += 'Không tìm thấy camera.'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += 'Camera đang được sử dụng bởi ứng dụng khác.'
      } else {
        errorMessage += 'Vui lòng thử lại.'
      }
      setError(errorMessage)
      console.error('Camera error:', err)
    }
  }

  // Dừng camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  // Countdown trước khi chụp
  const startCountdown = () => {
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          capturePhoto()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Helper function để vẽ rounded rectangle
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  // Vẽ khung vào canvas
  const drawFrame = (ctx, canvasWidth, canvasHeight, frameType) => {
    // Tăng padding đáng kể để có đủ không gian cho khung
    const padding = 100 // Padding cho khung (tăng để có đủ không gian)
    const photoX = padding
    const photoY = padding
    const photoWidth = canvasWidth - (padding * 2)
    const photoHeight = canvasHeight - (padding * 2)

    // Vẽ nền khung
    const frameConfigs = {
      heart: {
        bgGradient: ['#ffe4ec', '#ffd4e5'],
        emoji: '💕',
        emojiSize: 50,
        borderWidth: 0,
        borderRadius: 20
      },
      love: {
        bgGradient: ['#fff5f8', '#ffe4ec'],
        emoji: '💖',
        emojiSize: 55,
        borderWidth: 8,
        borderColor: '#ff6b9d',
        borderRadius: 20
      },
      sparkle: {
        bgGradient: ['#fff9e6', '#fff5cc'],
        emoji: '✨',
        emojiSize: 60,
        borderWidth: 0,
        borderRadius: 20
      },
      rose: {
        bgGradient: ['#ffebee', '#fce4ec'],
        emoji: '🌹',
        emojiSize: 50,
        borderWidth: 6,
        borderColor: '#e91e63',
        borderRadius: 25
      },
      kiss: {
        bgGradient: ['#fff0f5', '#ffe4ec'],
        emoji: '💋',
        emojiSize: 55,
        borderWidth: 10,
        borderColor: '#ff6b9d',
        borderStyle: 'double',
        borderRadius: 20
      },
      wedding: {
        bgGradient: ['#fffbf0', '#fff5e6'],
        emoji: '💍',
        emojiSize: 50,
        borderWidth: 8,
        borderColor: '#ffd700',
        borderRadius: 25
      }
    }

    const config = frameConfigs[frameType] || frameConfigs.heart

    // Vẽ nền gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
    gradient.addColorStop(0, config.bgGradient[0])
    gradient.addColorStop(1, config.bgGradient[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Vẽ viền nếu có
    if (config.borderWidth > 0) {
      ctx.strokeStyle = config.borderColor
      ctx.lineWidth = config.borderWidth
      if (config.borderStyle === 'double') {
        // Double border - outer
        drawRoundedRect(ctx, photoX - config.borderWidth - 5, photoY - config.borderWidth - 5, 
                       photoWidth + (config.borderWidth * 2) + 10, photoHeight + (config.borderWidth * 2) + 10, 
                       config.borderRadius + 5)
        ctx.stroke()
        // Double border - inner
        drawRoundedRect(ctx, photoX - config.borderWidth, photoY - config.borderWidth, 
                       photoWidth + (config.borderWidth * 2), photoHeight + (config.borderWidth * 2), 
                       config.borderRadius)
        ctx.stroke()
      } else {
        drawRoundedRect(ctx, photoX - config.borderWidth, photoY - config.borderWidth, 
                       photoWidth + (config.borderWidth * 2), photoHeight + (config.borderWidth * 2), 
                       config.borderRadius)
        ctx.stroke()
      }
    }

    // Vẽ emoji ở góc với khoảng cách tốt hơn
    ctx.font = `${config.emojiSize}px Arial`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    // Top-left emoji - đặt xa hơn từ góc ảnh
    ctx.fillText(config.emoji, photoX - 30, photoY - 30)
    
    // Bottom-right emoji
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(config.emoji, photoX + photoWidth + 30, photoY + photoHeight + 30)

    // Thêm emoji ở giữa trên cho sparkle
    if (frameType === 'sparkle') {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(config.emoji, canvasWidth / 2, photoY - 40)
      ctx.font = '35px Arial'
      ctx.textBaseline = 'bottom'
      ctx.fillText('✨ ✨ ✨', canvasWidth / 2, photoY + photoHeight + 40)
    }

    // Thêm emoji ở giữa cho kiss
    if (frameType === 'kiss') {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(config.emoji, canvasWidth / 2, photoY - 40)
      ctx.textBaseline = 'bottom'
      ctx.fillText(config.emoji, canvasWidth / 2, photoY + photoHeight + 40)
    }

    return { photoX, photoY, photoWidth, photoHeight, borderRadius: config.borderRadius }
  }

  // Chụp ảnh với khung
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Tính toán kích thước canvas với padding cho khung
    const padding = 100 // Padding cho khung (tăng để có đủ không gian)
    const borderWidth = selectedFrame === 'love' ? 8 : selectedFrame === 'rose' ? 6 : 
                       selectedFrame === 'kiss' ? 10 : selectedFrame === 'wedding' ? 8 : 0
    const emojiSpace = 100 // Không gian cho emoji (tăng để có đủ chỗ)
    const borderSpace = borderWidth * 2 + 20 // Không gian cho border + margin
    
    // Set canvas size với đủ không gian cho khung, border và emoji
    const canvasWidth = video.videoWidth + (padding * 2) + emojiSpace + borderSpace
    const canvasHeight = video.videoHeight + (padding * 2) + emojiSpace + borderSpace
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear canvas và set background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Vẽ khung trước (nền + viền + emoji)
    const { photoX, photoY, photoWidth, photoHeight, borderRadius } = drawFrame(
      ctx, 
      canvasWidth, 
      canvasHeight, 
      selectedFrame
    )

    // Vẽ ảnh với border radius (tạo mask)
    ctx.save()
    
    // Tạo clipping path với border radius
    if (borderRadius > 0) {
      drawRoundedRect(ctx, photoX, photoY, photoWidth, photoHeight, borderRadius)
      ctx.clip()
    } else {
      // Nếu không có border radius, vẫn tạo clipping path để giữ ảnh trong khung
      ctx.beginPath()
      ctx.rect(photoX, photoY, photoWidth, photoHeight)
      ctx.clip()
    }

    // Draw video frame to canvas (mirrored for front camera)
    ctx.save()
    ctx.scale(-1, 1) // Mirror horizontally
    ctx.drawImage(
      video, 
      -photoX - photoWidth, 
      photoY, 
      photoWidth, 
      photoHeight
    )
    ctx.restore()
    ctx.restore()

    // Convert to image với chất lượng cao
    const imageData = canvas.toDataURL('image/png', 1.0)
    setCapturedPhoto(imageData)
    
    console.log('Photo captured with frame:', {
      canvasSize: { width: canvas.width, height: canvas.height },
      videoSize: { width: video.videoWidth, height: video.videoHeight },
      photoPos: { x: photoX, y: photoY },
      photoSize: { width: photoWidth, height: photoHeight },
      frame: selectedFrame,
      padding: padding
    })
  }

  // Tải ảnh về
  const downloadPhoto = () => {
    if (!capturedPhoto) return

    const link = document.createElement('a')
    link.download = `love-photobooth-${Date.now()}.png`
    link.href = capturedPhoto
    link.click()
  }

  // Chụp lại
  const retakePhoto = async () => {
    setCapturedPhoto(null)
    
    // Nếu camera đang chạy, dừng lại trước
    if (cameraActive && streamRef.current) {
      stopCamera()
      // Đợi một chút để camera được giải phóng hoàn toàn
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    // Tự động khởi động lại camera
    await startCamera()
  }

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Đảm bảo video được play khi camera active
  useEffect(() => {
    if (cameraActive && videoRef.current && videoRef.current.srcObject) {
      const video = videoRef.current
      
      const playVideo = async () => {
        try {
          await video.play()
          console.log('Video playing successfully')
        } catch (err) {
          console.error('Error playing video:', err)
          setError('Không thể phát video. Vui lòng thử lại.')
        }
      }

      // Try to play immediately
      playVideo()

      // Also try when video is ready
      const handleCanPlay = () => {
        playVideo()
      }

      video.addEventListener('loadedmetadata', playVideo)
      video.addEventListener('canplay', handleCanPlay)

      return () => {
        video.removeEventListener('loadedmetadata', playVideo)
        video.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [cameraActive])

  return (
    <div className="photobooth-container">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>

      <div className={`photobooth-content ${showContent ? 'show' : ''}`}>
        <div className="photobooth-header">
          <span className="photobooth-emoji">📷</span>
          <h1 className="photobooth-title">Love Photobooth</h1>
          <p className="photobooth-subtitle">Lưu giữ khoảnh khắc đáng nhớ của chúng mình 💕</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Frame Selection */}
        {!capturedPhoto && (
          <div className="frame-selection">
            <h3>Chọn khung ảnh:</h3>
            <div className="frame-options">
              {frames.map(frame => (
                <button
                  key={frame.id}
                  className={`frame-btn ${selectedFrame === frame.id ? 'active' : ''}`}
                  onClick={() => setSelectedFrame(frame.id)}
                >
                  <span className="frame-emoji">{frame.emoji}</span>
                  <span className="frame-name">{frame.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camera View */}
        {!capturedPhoto && (
          <div className="camera-section">
            {!cameraActive ? (
              <div className="camera-placeholder">
                <div className="placeholder-icon">📷</div>
                <p>Nhấn để bắt đầu chụp ảnh</p>
                <button className="start-camera-btn" onClick={startCamera}>
                  Bật Camera 📸
                </button>
              </div>
            ) : (
              <div className="camera-view">
                <div className={`video-wrapper frame-${selectedFrame}`}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video"
                  />
                  {countdown > 0 && (
                    <div className="countdown-overlay">
                      <div className="countdown-number">{countdown}</div>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <div className="camera-controls">
                  <button className="control-btn capture-btn" onClick={startCountdown}>
                    📸 Chụp ảnh
                  </button>
                  <button className="control-btn stop-btn" onClick={stopCamera}>
                    ⏹️ Dừng
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Captured Photo */}
        {capturedPhoto && (
          <div className="photo-result">
            <div className={`photo-wrapper frame-${selectedFrame}`}>
              <img src={capturedPhoto} alt="Captured moment" className="captured-photo" />
            </div>
            
            <div className="photo-actions">
              <button className="action-btn download-btn" onClick={downloadPhoto}>
                💾 Tải về
              </button>
              <button className="action-btn retake-btn" onClick={retakePhoto}>
                📷 Chụp lại
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h4>💡 Hướng dẫn:</h4>
          <ul>
            <li>Chọn khung ảnh yêu thích</li>
            <li>Nhấn "Bật Camera" để bắt đầu</li>
            <li>Nhấn "Chụp ảnh" - sẽ có countdown 3 giây</li>
            <li>Tải ảnh về hoặc chụp lại</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LovePhotobooth
