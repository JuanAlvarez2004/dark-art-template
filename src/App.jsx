// Nueva versión modularizada
import SectionsContainer from './components/SectionsContainer'
import Navigation from './components/Navigation'
import sections from './data/sections'
import useSectionNavigation from './hooks/useSectionNavigation'

function App() {
  const {
    containerRef,
    navRef,
    isNavVisible,
    toggleNav,
    currentIndex,
    navigate
  } = useSectionNavigation({ sections })

  return (
    <div className="bg-black h-dvh relative overflow-hidden select-none touch-none">
      <SectionsContainer
        ref={containerRef}
        sections={sections}
        currentIndex={currentIndex}
      />
      <Navigation
        ref={navRef}
        sections={sections}
        isVisible={isNavVisible}
        toggle={toggleNav}
        onSelect={navigate}
        currentIndex={currentIndex}
      />
    </div>
  )
}

export default App
