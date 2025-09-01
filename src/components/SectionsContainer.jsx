import { forwardRef, memo } from 'react'

const SectionsContainer = forwardRef(function SectionsContainer({ sections, currentIndex }, ref) {
  return (
    <div ref={ref} className="w-full h-full will-change-transform">
      {sections.map((s, i) => (
        <section
          id={s.id}
          key={s.id}
          className={`h-dvh w-full flex items-center justify-center relative ${s.bg}`}
          aria-hidden={currentIndex !== i}
        >
          <div id={s.id === 'hero' ? 'hero-bg' : undefined} className="absolute inset-0 z-10 pointer-events-none" aria-hidden>
            <img className="w-full h-full object-cover contrast-105" src={s.bgImage} alt="background" />
          </div>
          <h1
            data-section-index={i}
            className="section-title text-6xl md:text-7xl font-gothic text-red-600 tracking-wide z-20"
          >
            {s.title}
          </h1>
        </section>
      ))}
    </div>
  )
})

export default memo(SectionsContainer)
