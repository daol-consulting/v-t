'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './ValentinePage.module.css'

interface Position {
  left: number
  top: number
  width: number
  height: number
}

export default function ValentinePage() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [isGrowing, setIsGrowing] = useState(false)
  const [noBtnText, setNoBtnText] = useState('No 😢')
  const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({})
  const [showEscapingBtn, setShowEscapingBtn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const noBtnRef = useRef<HTMLButtonElement>(null)
  const escapingNoBtnRef = useRef<HTMLButtonElement>(null)
  const yesBtnRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isHovering, setIsHovering] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [initialNoBtnPosition, setInitialNoBtnPosition] = useState<Position | null>(null)
  const escapeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const noBtnClickCountRef = useRef(0)
  const isMobileRef = useRef(false)
  const isHoveringRef = useRef(false)
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)

  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

  // 하트 배경 애니메이션
  useEffect(() => {
    const heartsContainer = document.querySelector('.hearts-background')
    if (!heartsContainer) return

    const createFloatingHeart = () => {
      const heart = document.createElement('div')
      heart.innerHTML = '💕'
      heart.className = 'heart'
      heart.style.left = Math.random() * 100 + '%'
      heart.style.fontSize = (15 + Math.random() * 15) + 'px'
      heart.style.animationDuration = (4 + Math.random() * 4) + 's'
      
      heartsContainer.appendChild(heart)
      
      setTimeout(() => {
        heart.remove()
      }, 8000)
    }

    const interval = setInterval(createFloatingHeart, 2000)
    return () => clearInterval(interval)
  }, [])

  // Yes 버튼 클릭
  const handleYesClick = useCallback(() => {
    setIsGrowing(true)
    
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.display = 'none'
      }
      // 동영상 재생
      setShowVideo(true)
      createConfetti()
      
      // 동영상 재생 시작
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('동영상 재생 실패:', error)
          })
        }
      }, 100)
    }, 500)
  }, [])

  // Confetti 생성
  const createConfetti = useCallback(() => {
    const colors = ['#ff6b9d', '#ff8fab', '#ffb3d1', '#ffd6e8', '#fff']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.style.position = 'fixed'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.top = '-10px'
        confetti.style.width = '10px'
        confetti.style.height = '10px'
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.borderRadius = '50%'
        confetti.style.pointerEvents = 'none'
        confetti.style.zIndex = '9999'
        confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`
        
        document.body.appendChild(confetti)
        
        setTimeout(() => {
          confetti.remove()
        }, 4000)
      }, i * 50)
    }
  }, [])

  // 마우스/터치 위치 업데이트
  const updateMousePosition = useCallback((e: MouseEvent | TouchEvent) => {
    if (isMobileRef.current && 'touches' in e && e.touches.length > 0) {
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      mouseXRef.current = x
      mouseYRef.current = y
      setMouseX(x)
      setMouseY(y)
    } else if (!isMobileRef.current && 'clientX' in e) {
      const x = e.clientX
      const y = e.clientY
      mouseXRef.current = x
      mouseYRef.current = y
      setMouseX(x)
      setMouseY(y)
    }
  }, [])

  // 랜덤하게 도망가기
  const escapeRandomly = useCallback(() => {
    // ref를 사용하여 최신 상태 확인
    if (!isHoveringRef.current) {
      return
    }

    if (!escapingNoBtnRef.current) {
      return
    }

    const buttonRect = escapingNoBtnRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const buttonWidth = buttonRect.width
    const buttonHeight = buttonRect.height
    const padding = 20

    // 화면 내 랜덤한 위치 계산
    const maxX = viewportWidth - buttonWidth - padding * 2
    const maxY = viewportHeight - buttonHeight - padding * 2
    
    // 현재 위치에서 충분히 멀리 떨어진 랜덤 위치 선택
    let newX: number, newY: number
    let attempts = 0
    const minDistance = 150 // 최소 이동 거리 증가
    
    do {
      newX = padding + Math.random() * maxX
      newY = padding + Math.random() * maxY
      attempts++
      
      // 현재 위치와의 거리 계산
      const distance = Math.sqrt(
        Math.pow(newX - buttonRect.left, 2) + Math.pow(newY - buttonRect.top, 2)
      )
      
      // 충분히 멀리 떨어졌거나 시도 횟수가 많으면 그만
      if (distance >= minDistance || attempts > 15) {
        break
      }
    } while (attempts < 20)

    // 화면 경계 내로 제한
    newX = Math.max(padding, Math.min(newX, viewportWidth - buttonWidth - padding))
    newY = Math.max(padding, Math.min(newY, viewportHeight - buttonHeight - padding))

    setNoBtnStyle((prev) => ({
      ...prev,
      position: 'fixed',
      left: `${newX}px`,
      top: `${newY}px`,
      zIndex: 1000,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', // 더 부드러운 애니메이션
    }))
  }, [])

  // 도망가기 추적 시작
  const startEscapeTracking = useCallback(() => {
    // 기존 timeout이 있으면 정리
    if (escapeIntervalRef.current) {
      clearTimeout(escapeIntervalRef.current)
      escapeIntervalRef.current = null
    }

    // 즉시 한 번 도망가기
    escapeRandomly()

    // 랜덤한 간격으로 계속 도망가기
    // transition 시간(0.5s) + 추가 대기 시간(0.3s ~ 0.7s) = 총 0.8s ~ 1.2s
    const scheduleNextEscape = () => {
      if (!isHoveringRef.current) {
        return
      }
      
      // transition이 끝난 후 추가로 대기 (0.3초 ~ 0.7초)
      const randomDelay = 500 + 300 + Math.random() * 400 // transition(500ms) + 추가 대기(300ms~700ms)
      
      escapeIntervalRef.current = setTimeout(() => {
        if (isHoveringRef.current) {
          escapeRandomly()
          scheduleNextEscape() // 다음 도망가기 예약
        }
      }, randomDelay) as unknown as NodeJS.Timeout
    }

    scheduleNextEscape()
  }, [escapeRandomly])

  // 도망가기 추적 중지
  const stopEscapeTracking = useCallback(() => {
    if (escapeIntervalRef.current) {
      clearTimeout(escapeIntervalRef.current)
      escapeIntervalRef.current = null
    }
  }, [])

  // 원래 위치로 복귀
  const returnToInitialPosition = useCallback(() => {
    // 약간의 지연을 두고 복귀 (마우스가 다시 돌아올 수 있음)
    setTimeout(() => {
      // 여전히 호버 상태가 아니면 복귀
      if (!isHoveringRef.current) {
        setShowEscapingBtn(false)
        setNoBtnStyle({})
      }
    }, 300)
  }, [])

  // No 버튼 호버 시작 (데스크톱)
  const handleNoMouseEnter = useCallback(() => {
    if (isMobileRef.current) {
      return
    }

    if (!noBtnRef.current) {
      return
    }
    
    // ref 업데이트
    isHoveringRef.current = true
    setIsHovering(true)
    
    // 현재 위치를 가져와서 저장하고 바로 사용
    const rect = noBtnRef.current.getBoundingClientRect()
    const currentPosition = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }
    
    // 초기 위치 저장
    if (!initialNoBtnPosition) {
      setInitialNoBtnPosition(currentPosition)
    }
    
    // 도망가는 버튼 표시하고 원래 버튼은 숨기기
    setShowEscapingBtn(true)
    setNoBtnStyle({
      position: 'fixed',
      left: `${currentPosition.left}px`,
      top: `${currentPosition.top}px`,
      zIndex: 1000,
    })
    
    // useEffect에서 자동으로 추적 시작하므로 여기서는 호출하지 않음
  }, [initialNoBtnPosition, startEscapeTracking])

  // No 버튼 호버 종료 (데스크톱) - 원래 버튼용
  const handleNoMouseLeave = useCallback((e?: React.MouseEvent) => {
    if (isMobileRef.current) {
      return
    }

    // 도망가는 버튼이 이미 표시되어 있으면 무시 (이미 도망가고 있음)
    if (showEscapingBtn) {
      return
    }
    
    isHoveringRef.current = false
    setIsHovering(false)
    stopEscapeTracking()
    returnToInitialPosition()
  }, [stopEscapeTracking, returnToInitialPosition, showEscapingBtn])

  // No 버튼 터치 시작 (모바일)
  const handleNoTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobileRef.current) {
      return
    }

    if (!noBtnRef.current) {
      return
    }
    
    e.preventDefault()
    e.stopPropagation()
    
    // 터치 위치 저장
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      mouseXRef.current = touch.clientX
      mouseYRef.current = touch.clientY
      setMouseX(touch.clientX)
      setMouseY(touch.clientY)
    }
    
    // ref 업데이트
    isHoveringRef.current = true
    setIsHovering(true)
    
    const rect = noBtnRef.current.getBoundingClientRect()
    const currentPosition = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }
    
    if (!initialNoBtnPosition) {
      setInitialNoBtnPosition(currentPosition)
    }
    
    // 도망가는 버튼 표시하고 원래 버튼은 숨기기
    setShowEscapingBtn(true)
    setNoBtnStyle({
      position: 'fixed',
      left: `${currentPosition.left}px`,
      top: `${currentPosition.top}px`,
      zIndex: 1000,
    })
    
    // 터치 이동 추적 시작
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        updateMousePosition(e)
      }
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    // useEffect에서 자동으로 추적 시작
  }, [initialNoBtnPosition, updateMousePosition])

  // No 버튼 터치 종료 (모바일)
  const handleNoTouchEnd = useCallback((e?: React.TouchEvent) => {
    if (!isMobileRef.current) {
      return
    }
    
    // 도망가는 버튼이 표시되어 있으면 약간의 지연 후 종료
    // 사용자가 다시 터치할 수 있음
    setTimeout(() => {
      if (!isHoveringRef.current) {
        isHoveringRef.current = false
        setIsHovering(false)
        stopEscapeTracking()
        returnToInitialPosition()
      }
    }, 500)
  }, [stopEscapeTracking, returnToInitialPosition, showEscapingBtn])

  // No 버튼 클릭
  const handleNoClick = useCallback((e: React.MouseEvent) => {
    if (isHovering) {
      e.preventDefault()
      noBtnClickCountRef.current++
      
      if (noBtnClickCountRef.current >= 3) {
        const messages = [
          "진짜로? 😢",
          "다시 생각해볼까요 우리? 💭",
          "안돼애애ㅐ애ㅐ애애애ㅐ! 🥺",
          "제발...또르르 🙏"
        ]
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        setNoBtnText(randomMessage)
        
        setTimeout(() => {
          setNoBtnText('No 😢')
        }, 2000)
      }
    }
  }, [isHovering])

  // showEscapingBtn이 true가 되면 자동으로 추적 시작
  useEffect(() => {
    if (showEscapingBtn && isHoveringRef.current) {
      // 약간의 지연 후 추적 시작 (버튼이 DOM에 완전히 렌더링된 후)
      const timer = setTimeout(() => {
        if (isHoveringRef.current && escapingNoBtnRef.current) {
          startEscapeTracking()
        }
      }, 150)
      
      return () => clearTimeout(timer)
    } else if (!showEscapingBtn && !isHoveringRef.current) {
      // 도망가는 버튼이 사라지고 호버 상태도 아니면 완전히 정리
      stopEscapeTracking()
    }
  }, [showEscapingBtn, startEscapeTracking, stopEscapeTracking])

  // 정리
  useEffect(() => {
    return () => {
      if (escapeIntervalRef.current) {
        clearTimeout(escapeIntervalRef.current)
      }
    }
  }, [])

  return (
    <>
      <div className="hearts-background">
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
      </div>

      <div className="container" ref={containerRef}>
        <div className="content">
          <h1 className="title">Will you be my Valentine? 💕</h1>
          <p className="subtitle">오늘 하루 특별한 사람이 되어주실래요? 그래야 나와 함께 하루를 보낼 수 있어요!💕</p>

          <div className="buttons-container">
            <button
              ref={yesBtnRef}
              className={`btn yes-btn ${isGrowing ? 'growing' : ''}`}
              onClick={handleYesClick}
            >
              Yes! 💖
            </button>
            {!showEscapingBtn && (
              <button
                ref={noBtnRef}
                className="btn no-btn"
                onMouseEnter={handleNoMouseEnter}
                onMouseLeave={handleNoMouseLeave}
                onTouchStart={handleNoTouchStart}
                onTouchEnd={handleNoTouchEnd}
                onClick={handleNoClick}
              >
                {noBtnText}
              </button>
            )}
            {showEscapingBtn && (
              <div 
                className="btn no-btn"
                style={{ 
                  opacity: 0, 
                  pointerEvents: 'none',
                  visibility: 'hidden' as const
                }}
              >
                {noBtnText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 도망가는 No 버튼 */}
      {showEscapingBtn && (
        <button
          ref={escapingNoBtnRef}
          className="btn no-btn"
          style={noBtnStyle}
          onMouseEnter={() => {
            // 도망가는 버튼에 마우스를 올려도 호버 상태 유지
            if (!isHoveringRef.current) {
              isHoveringRef.current = true
              setIsHovering(true)
            }
          }}
          onMouseLeave={(e) => {
            // 도망가는 버튼에서 마우스가 나가도 즉시 종료하지 않음
            // 마우스가 화면 밖으로 나가거나 다른 곳을 클릭할 때만 종료
            // 여기서는 아무것도 하지 않고 계속 도망가도록 함
          }}
          onTouchStart={(e) => {
            // 모바일에서 도망가는 버튼을 터치하면 호버 상태 유지
            if (isMobileRef.current) {
              e.preventDefault()
              isHoveringRef.current = true
              setIsHovering(true)
              if (e.touches.length > 0) {
                const touch = e.touches[0]
                mouseXRef.current = touch.clientX
                mouseYRef.current = touch.clientY
              }
            }
          }}
          onTouchMove={(e) => {
            if (isMobileRef.current) {
              e.preventDefault()
              if (e.touches.length > 0) {
                const touch = e.touches[0]
                mouseXRef.current = touch.clientX
                mouseYRef.current = touch.clientY
                setMouseX(touch.clientX)
                setMouseY(touch.clientY)
              }
            }
          }}
          onTouchEnd={handleNoTouchEnd}
          onClick={handleNoClick}
        >
          {noBtnText}
        </button>
      )}

      {/* 동영상 재생 */}
      {showVideo && (
        <div className="celebration">
          <div className="celebration-content video-container">
            <video
              ref={videoRef}
              className="memory-video"
              controls
              autoPlay
              playsInline
              onEnded={() => {
                setShowCelebration(true)
                setShowVideo(false)
              }}
            >
              <source src="/video/memories.mp4" type="video/mp4" />
              <source src="/video/memories.webm" type="video/webm" />
              동영상을 재생할 수 없습니다.
            </video>
            <button
              className="skip-button"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause()
                }
                setShowVideo(false)
                setShowCelebration(true)
              }}
            >
              건너뛰기
            </button>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="celebration">
          <div className="celebration-content">
            <h2>Yay! 🎉</h2>
            <p>오늘 하루 인생에서 가장 행복한 발렌타인 데이를 보내보자요!!! 💕</p>
            <p className="love-message">사랑해요! ❤️</p>
          </div>
        </div>
      )}
    </>
  )
}