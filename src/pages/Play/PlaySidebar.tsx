import React, { useState } from 'react'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
import {
  FaComments,
  FaDiceD20,
  FaExpandArrowsAlt,
  FaRunning,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import {
  GiSwordBrandish,
  GiSwordsEmblem,
  GiBloodySword,
  GiTreasureMap,
  GiBrain,
} from 'react-icons/gi'
import type { User } from '../../contexts/AuthContext'
import { MENU, type MenuType } from './interfaces'

interface PlaySidebarProps {
  allowDrag: boolean
  handleDragable: () => void
  handleMenu: (type: MenuType) => void
  user: User | null
  menu: MenuType
  children: React.ReactNode
}

const ACTIVE_COLOR = '#8e0e00'
const INACTIVE_COLOR = '#a5a5a5'

function getIconColor(current: MenuType, active: MenuType) {
  return current === active ? ACTIVE_COLOR : INACTIVE_COLOR
}

const menuItems = [
  { id: MENU.ATTACK, label: 'Ataque', icon: GiSwordBrandish },
  { id: MENU.CHAT, label: 'Bate Papo', icon: FaComments },
  { id: MENU.SAVES, label: 'Testes e Dados', icon: FaDiceD20 },
  { id: MENU.DAMAGE, label: 'Medidor de Dano', icon: GiBloodySword },
  { id: MENU.STATUS, label: 'Status do Personagem', icon: GiSwordsEmblem },
]

export default function PlaySidebar({
  allowDrag,
  handleDragable,
  handleMenu,
  user,
  menu,
  children,
}: PlaySidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`flex flex-row flex-shrink-0 h-full transition-all duration-300 ease-in-out shadow-[0px_0px_4px_0px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden bg-[#1a1a2e] text-white ${collapsed ? 'w-12' : 'w-[300px]'
        }`}
    >
      <ReactTooltip />

      {/* Coluna de Ícones */}
      <div className="flex flex-col items-center w-12 flex-shrink-0 border-r border-[#2a2a4e] py-2">
        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 mb-3 hover:bg-white/10 rounded-full transition-colors"
          data-tip={collapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {collapsed ? <FaChevronLeft size={14} color={INACTIVE_COLOR} /> : <FaChevronRight size={14} color={INACTIVE_COLOR} />}
        </button>

        {/* Drag/Run Toggle */}
        <button
          onClick={handleDragable}
          className="p-1 mb-3 hover:bg-white/10 rounded-lg transition-colors"
          data-tip={allowDrag ? 'Movimentar Mapa' : 'Movimentar Token'}
        >
          {allowDrag ? (
            <FaExpandArrowsAlt size={18} color="white" />
          ) : (
            <FaRunning size={18} color="white" />
          )}
        </button>

        {/* Dynamic Menu Items */}
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = menu === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                handleMenu(item.id as MenuType)
                if (collapsed) setCollapsed(false)
              }}
              className="p-2 w-full flex justify-center mb-2 hover:bg-white/5 transition-colors relative"
              data-tip={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8e0e00]" />
              )}
              <Icon size={20} color={getIconColor(item.id as MenuType, menu)} />
            </button>
          )
        })}

        {/* GM Tools */}
        {user?.is_gm && (
          <>
            <button
              onClick={() => {
                handleMenu(MENU.CONFIG)
                if (collapsed) setCollapsed(false)
              }}
              className="p-2 w-full flex justify-center mb-2 hover:bg-white/5 transition-colors relative"
              data-tip={collapsed ? 'Mapas' : undefined}
            >
              {menu === MENU.CONFIG && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8e0e00]" />
              )}
              <GiTreasureMap size={20} color={getIconColor(MENU.CONFIG, menu)} />
            </button>

            <Link
              to="/gmtools"
              className="p-2 w-full flex justify-center mb-2 hover:bg-white/5 transition-colors"
              data-tip={collapsed ? 'GM Tools' : undefined}
            >
              <GiBrain size={20} color={INACTIVE_COLOR} />
            </Link>
          </>
        )}
      </div>

      {/* Conteúdo do Painel */}
      <div className={`flex flex-1 flex-col overflow-hidden bg-white text-black transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header do Menu Ativo */}
        {!collapsed && (
          <div className="px-4 py-3 bg-gray-100 border-b flex-shrink-0 font-bold text-gray-700">
            {menuItems.find(i => i.id === menu)?.label || (menu === MENU.CONFIG ? 'Mapas' : 'Painel')}
          </div>
        )}

        {/* Children Panel */}
        <div className="flex-1 flex flex-col overflow-hidden px-1 py-2">
          {!collapsed && children}
        </div>
      </div>
    </div>
  )
}
