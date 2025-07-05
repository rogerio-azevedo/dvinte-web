import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
import {
  FaComments,
  FaUserClock,
  FaDiceD20,
  FaExpandArrowsAlt,
  FaRunning,
} from 'react-icons/fa/'
import {
  GiSwordBrandish,
  GiSwordsEmblem,
  GiBloodySword,
  GiTreasureMap,
  GiBrain,
} from 'react-icons/gi'
import type { User } from '../../contexts/AuthContext'

export const MENU = {
  ATTACK: 'attack',
  CHAT: 'chat',
  SAVES: 'saves',
  DAMAGE: 'damage',
  INIT: 'init',
  STATUS: 'status',
  CONFIG: 'config',
} as const

export type MenuType = (typeof MENU)[keyof typeof MENU]

interface PlayMenuBarProps {
  allowDrag: boolean
  handleDragable: () => void
  handleMenu: (type: MenuType) => void
  user: User | null
  menu: MenuType
}

const ACTIVE_COLOR = '#8e0e00'
const INACTIVE_COLOR = '#a5a5a5'

function getIconColor(current: MenuType, active: MenuType) {
  return current === active ? ACTIVE_COLOR : INACTIVE_COLOR
}

const PlayMenuBar: React.FC<PlayMenuBarProps> = ({
  allowDrag,
  handleDragable,
  handleMenu,
  user,
  menu,
}) => (
  <div className="flex justify-center items-center bg-white px-2 py-3 rounded-lg flex-shrink-0 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.6)] gap-2">
    <ReactTooltip />
    {allowDrag ? (
      <div data-tip="Movimentar Mapa">
        <FaExpandArrowsAlt
          size={25}
          color="black"
          cursor="pointer"
          onClick={handleDragable}
        />
      </div>
    ) : (
      <div data-tip="Movimentar Token">
        <FaRunning
          size={25}
          color="black"
          cursor="pointer"
          onClick={handleDragable}
        />
      </div>
    )}
    <div data-tip="Atacar">
      <GiSwordBrandish
        size={25}
        color={getIconColor(MENU.ATTACK, menu)}
        cursor="pointer"
        onClick={() => handleMenu(MENU.ATTACK)}
      />
    </div>
    <div data-tip="Bate Papo">
      <FaComments
        size={28}
        color={getIconColor(MENU.CHAT, menu)}
        cursor="pointer"
        onClick={() => handleMenu(MENU.CHAT)}
      />
    </div>
    <div data-tip="Testes e Dados">
      <FaDiceD20
        size={25}
        color={getIconColor(MENU.SAVES, menu)}
        cursor="pointer"
        onClick={() => handleMenu(MENU.SAVES)}
      />
    </div>
    <div data-tip="Medidor de Dano">
      <GiBloodySword
        size={30}
        color={getIconColor(MENU.DAMAGE, menu)}
        cursor="pointer"
        onClick={() => handleMenu(MENU.DAMAGE)}
      />
    </div>
    <div data-tip="Iniciativas">
      <FaUserClock
        size={30}
        color={getIconColor(MENU.INIT, menu)}
        cursor="pointer"
        onClick={() => handleMenu(MENU.INIT)}
      />
    </div>
    <div data-tip="Status do Personagem">
      <GiSwordsEmblem
        size={28}
        color={getIconColor(MENU.STATUS, menu)}
        cursor="pointer"
        onClick={() => handleMenu(MENU.STATUS)}
      />
    </div>
    {user?.is_gm && (
      <div data-tip="Mapas">
        <GiTreasureMap
          size={28}
          color={getIconColor(MENU.CONFIG, menu)}
          cursor="pointer"
          onClick={() => handleMenu(MENU.CONFIG)}
        />
      </div>
    )}
    {user?.is_gm && (
      <div data-tip="GM Tools">
        <Link to="/gmtools">
          <GiBrain size={28} color={INACTIVE_COLOR} cursor="pointer" />
        </Link>
      </div>
    )}
  </div>
)

export default PlayMenuBar
