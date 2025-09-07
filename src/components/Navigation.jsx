import { forwardRef, memo } from 'react'

function NavigationBase({ sections, isVisible, toggle, onSelect, currentIndex }, ref) {
  return (
    <nav className="fixed z-20 left-0 bottom-0 m-0 p-2 select-none">
      <ul
        ref={ref}
        className={`z-10 flex flex-col gap-1 ${!isVisible ? 'pointer-events-none' : ''}`}
        aria-label="Secciones"
      >
        {sections.map((sec, i) => (
          <li
            key={sec.title}
            className='relative block cursor-crosshair select-none'
            onClick={() => onSelect(i)}
          >
            <div className="highlight absolute bg-amber-200/70 inset-0 z-0" />
            <span className={`relative z-10 font-gothic text-5xl block pointer-events-none transition-colors ${currentIndex === i ? 'text-white' : 'text-red-600'}`}>
              {sec.title}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={toggle}
        aria-pressed={isVisible}
        aria-label={isVisible ? 'Ocultar navegación' : 'Mostrar navegación'}
        className='py-5 hover:scale-110 active:scale-90 transition-transform cursor-crosshair'
      >
        <img
          className='bg-red-600'
          src={isVisible ? '/icons/arrow-left.svg' : '/icons/arrow-right.svg'}
          alt={isVisible ? 'Ocultar' : 'Mostrar'}
        />
      </button>
    </nav>
  )
}

const Navigation = memo(forwardRef(NavigationBase))
export default Navigation
