import type { ReactElement } from 'react'
import { FaDiceD20, FaListAlt } from 'react-icons/fa'
import { GiSwordsEmblem } from 'react-icons/gi'

export type PlayMobileSheet = 'attack' | 'dice' | 'log' | null

interface BottomNavProps {
  active: PlayMobileSheet
  onOpen: (sheet: Exclude<PlayMobileSheet, null>) => void
}

export default function BottomNav({ active, onOpen }: BottomNavProps) {
  const btnNav = (
    id: Exclude<PlayMobileSheet, null>,
    label: string,
    icon: ReactElement,
    accent: boolean
  ) => (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8e0e00]/45 ${
        accent
          ? 'bg-[#8e0e00]/25 text-[#590000]'
          : 'text-slate-200 hover:bg-white/10'
      }`}
      aria-pressed={accent}
      aria-current={accent ? 'true' : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  const safePb = 'pb-[max(env(safe-area-inset-bottom,0px),4px)]'

  return (
    <nav
      className={`z-40 grid shrink-0 grid-cols-3 border-t border-white/15 bg-[#252536]/95 backdrop-blur-md ${safePb} pt-2`}
      aria-label="Atalhos Play Mobile"
    >
      {btnNav(
        'dice',
        'Dados',
        <FaDiceD20 className="h-7 w-7" aria-hidden />,
        active === 'dice'
      )}
      {btnNav(
        'attack',
        'Ataque',
        <GiSwordsEmblem className="h-7 w-7" aria-hidden />,
        active === 'attack'
      )}
      {btnNav(
        'log',
        'Log',
        <FaListAlt className="h-7 w-7" aria-hidden />,
        active === 'log'
      )}
    </nav>
  )
}
