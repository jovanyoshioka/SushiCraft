import { useSyncExternalStore, type ReactNode } from 'react'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 953

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function getSnapshot() {
  return `${window.innerWidth},${window.innerHeight}`
}

function getServerSnapshot() {
  return `${DESIGN_WIDTH},${DESIGN_HEIGHT}`
}

/**
 * Keep the original desktop composition; fit the entire design into the viewport.
 * 
 * @remarks
 * This is not A11y-compliant but is sufficient for the initial iteration.
 * */
export default function FixedLayout({ children, overlay = false }: {
  children: ReactNode
  overlay?: boolean
}) {
  const viewport = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [width, height] = viewport.split(',').map(Number)
  const scale = Math.max(0, Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT))

  return (
    <div data-fixed-layout={overlay ? 'overlay' : 'page'} style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      background: overlay ? 'transparent' : '#171615',
      pointerEvents: overlay ? 'none' : 'auto',
      zIndex: overlay ? 300 : undefined,
    }}>
      <div data-design-stage style={{
        position: 'absolute',
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        left: (width - DESIGN_WIDTH * scale) / 2,
        top: (height - DESIGN_HEIGHT * scale) / 2,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}>
        {children}
      </div>
    </div>
  )
}
