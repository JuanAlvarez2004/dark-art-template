import { useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Hook responsable de:
// - registrar plugins y listeners
// - manejar índice actual y animaciones de transición
// - exponer API de navegación y visibilidad del menú
export default function useSectionNavigation({ sections }) {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(0)

  const navRef = useRef(null)
  const containerRef = useRef(null)
  const animatingRef = useRef(false)

  const toggleNav = useCallback(() => setIsNavVisible(v => !v), [])

  // Función de navegación segura
  const navigate = useCallback((rawIndex, { clamp = true } = {}) => {
    if (animatingRef.current) return
    const total = sections.length
    const targetIndex = clamp ? Math.min(Math.max(0, rawIndex), total - 1) : rawIndex
    if (targetIndex === currentIndexRef.current) return
    animatingRef.current = true
    currentIndexRef.current = targetIndex
    setCurrentIndex(targetIndex)
    const y = -targetIndex * window.innerHeight
    gsap.to(containerRef.current, {
      y,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => { animatingRef.current = false }
    })
  }, [sections.length])

  // Mantener ref sincronizado si cambia currentIndex externamente (por seguridad)
  if (currentIndexRef.current !== currentIndex) {
    currentIndexRef.current = currentIndex
  }

  // Setup inicial (solo una vez) usando useGSAP
  useGSAP(() => {
    gsap.registerPlugin(Observer, SplitText)

    const listItems = navRef.current ? Array.from(navRef.current.children) : []

    // Intro
    gsap.from('#hero-bg', { alpha: 0, duration: 0.9 })
    gsap.from(listItems, { alpha: 0, duration: 0.5, stagger: 0.15, ease: 'back.in' })

    // Hover highlights
    listItems.forEach(item => {
      const highlight = item.querySelector('.highlight')
      if (!highlight) return
      gsap.set(highlight, { scaleX: 0, transformOrigin: 'left', opacity: 1 })
      item.addEventListener('mouseenter', () => {
        gsap.to(highlight, { scaleX: 1.2, duration: 0.3, ease: 'power2.out' })
      })
      item.addEventListener('mouseleave', () => {
        gsap.to(highlight, { scaleX: 0, duration: 0.3, ease: 'power2.out' })
      })
    })

    // Observer gestos
    const observer = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      wheelSpeed: 1,
      tolerance: 8,
      preventDefault: true,
      ignore: navRef.current,
      onDown: () => navigate(currentIndexRef.current + 1),
      onUp: () => navigate(currentIndexRef.current - 1)
    })

    // Keyboard
    const handleKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') navigate(currentIndexRef.current + 1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') navigate(currentIndexRef.current - 1)
      if (e.key === 'Home') navigate(0)
      if (e.key === 'End') navigate(sections.length - 1)
    }
    window.addEventListener('keydown', handleKey)

    // Resize
    const handleResize = () => {
      gsap.set(containerRef.current, { y: -currentIndexRef.current * window.innerHeight })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      observer?.kill()
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleResize)
    }
  }, { dependencies: [] })

  // Animación mostrar / ocultar nav usando useGSAP reactivo
  useGSAP(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      autoAlpha: isNavVisible ? 1 : 0,
      x: isNavVisible ? 0 : -100,
      duration: 0.3,
      ease: 'circ.inOut'
    })
  }, { dependencies: [isNavVisible] })

  return {
    navRef,
    containerRef,
    isNavVisible,
    toggleNav,
    currentIndex,
    navigate
  }
}
