import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import {
  FaComments,
  FaDiceD20,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import {
  GiSwordBrandish,
  GiSwordsEmblem,
  GiBloodySword,
  GiTreasureMap,
} from 'react-icons/gi'
import type { User } from '../../contexts/AuthContext'
import { MENU, type MenuType } from './interfaces'

function getPanelTitle(menu: MenuType): string {
  switch (menu) {
    case MENU.ATTACK:
      return 'Painel de Ataque'
    case MENU.CHAT:
      return 'Bate Papo'
    case MENU.SAVES:
      return 'Testes de Resistência'
    case MENU.DAMAGE:
      return 'Medidor de Dano'
    case MENU.STATUS:
      return 'Status do Personagem'
    case MENU.CONFIG:
      return 'Cadastro de Mapas'
    default:
      return 'Painel'
  }
}

interface PlaySidebarProps {
  handleMenu: (type: MenuType) => void
  user: User | null
  menu: MenuType
  children: React.ReactNode
}

const ACTIVE_COLOR = '#8e0e00'
const INACTIVE_COLOR = '#64748b'

function getIconColor(current: MenuType, active: MenuType) {
  return current === active ? ACTIVE_COLOR : INACTIVE_COLOR
}

const menuItems = [
  { id: MENU.ATTACK, label: 'Ataque', icon: GiSwordBrandish },
  { id: MENU.CHAT, label: 'Bate Papo', icon: FaComments },
  { id: MENU.SAVES, label: 'Testes e Dados', icon: FaDiceD20 },
  { id: MENU.DAMAGE, label: 'Medidor de Dano', icon: GiBloodySword },
  { id: MENU.STATUS, label: 'Status do Personagem', icon: GiSwordsEmblem },
] as const

export default function PlaySidebar({
  handleMenu,
  user,
  menu,
  children,
}: PlaySidebarProps) {
  const [open, setOpen] = useState(true)

  const gmItems = user?.is_gm
    ? [{ id: MENU.CONFIG, label: 'Mapas', icon: GiTreasureMap }]
    : []

  return (
    <div
      className={`relative flex h-full flex-shrink-0 flex-col overflow-hidden rounded-lg border border-stone-200/90 bg-white text-slate-800 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.04)] transition-all duration-300 ease-in-out ${open ? 'w-[320px]' : 'w-7'
        }`}
    >
      <ReactTooltip />

      {/* Aba para expandir quando recolhido */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-2 bg-stone-100 text-slate-500 transition-colors hover:bg-[#6f0000]/10 hover:text-[#6f0000]"
          aria-label="Expandir painel lateral"
          data-tip="Expandir painel"
        >
          <FaChevronLeft size={14} aria-hidden />
        </button>
      )}

      {open && (
        <>
          <div className="flex flex-shrink-0 flex-wrap items-stretch gap-0.5 overflow-x-hidden border-b border-stone-200/80 bg-gradient-to-b from-stone-50 to-stone-100/90 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/80 hover:text-[#6f0000]"
              aria-label="Recolher painel lateral"
              data-tip="Recolher painel"
            >
              <FaChevronRight size={14} aria-hidden />
            </button>

            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = menu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenu(item.id as MenuType)}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/70 ${isActive ? 'bg-white shadow-sm ring-1 ring-stone-200/80' : ''
                    }`}
                  data-tip={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#8e0e00]" />
                  )}
                  <Icon
                    size={20}
                    color={getIconColor(item.id as MenuType, menu)}
                  />
                </button>
              )
            })}

            {gmItems.map(item => {
              const Icon = item.icon
              const isActive = menu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenu(item.id)}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/70 ${isActive ? 'bg-white shadow-sm ring-1 ring-stone-200/80' : ''
                    }`}
                  data-tip={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#8e0e00]" />
                  )}
                  <Icon size={20} color={getIconColor(item.id, menu)} />
                </button>
              )
            })}
          </div>

          <div className="border-b border-stone-200/80 bg-white px-4 py-2.5 text-sm font-semibold tracking-tight text-slate-800">
            {getPanelTitle(menu)}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-stone-50/80 px-3 py-3 text-slate-800">
            {children}
          </div>
        </>
      )}
    </div>
  )
}
