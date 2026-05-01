import { FaExpandArrowsAlt, FaRunning } from 'react-icons/fa'

interface MapControlsProps {
  allowDrag: boolean
  onToggleDrag: () => void
}

/**
 * Controles flutuantes sobre o mapa (modo arrastar mapa vs mover tokens).
 */
export default function MapControls({
  allowDrag,
  onToggleDrag,
}: MapControlsProps) {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-30">
      <button
        type="button"
        onClick={onToggleDrag}
        className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/85 px-3 py-2 text-sm font-medium text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur-md opacity-70 transition-[opacity,box-shadow] hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8e0e00]/50"
        title={
          allowDrag
            ? 'Modo: arrastar mapa (clique para mover tokens)'
            : 'Modo: mover tokens (clique para arrastar mapa)'
        }
        aria-pressed={allowDrag}
      >
        {allowDrag ? (
          <>
            <FaExpandArrowsAlt className="shrink-0 text-[#c94a4a]" size={18} />
            <span>Mapa</span>
          </>
        ) : (
          <>
            <FaRunning className="shrink-0 text-[#6f0000]" size={18} />
            <span>Tokens</span>
          </>
        )}
      </button>
    </div>
  )
}
