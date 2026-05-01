import { Link } from 'react-router'
import { useState } from 'react'
import logoBlack from '../../assets/logo_black.svg'
import { useAuth } from '../../contexts'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../../components/ui/navigation-menu'

type MenuItem = {
  label: string
  to?: string
  dropdown?: MenuItem[]
  gm?: boolean
}

const cadastrosMenu: MenuItem[] = [
  { label: 'Alinhamentos', to: '/alignments' },
  { label: 'Armaduras', to: '/armors' },
  { label: 'Armas', to: '/weapons' },
  { label: 'Classes', to: '/classes' },
  { label: 'Divindades', to: '/divinities' },
  { label: 'Equipamentos', to: '/equipments' },
  { label: 'Raças', to: '/races' },
  { label: 'Retratos', to: '/portraits' },
  { label: 'Tokens', to: '/tokens', gm: true },
  { label: 'Campanhas', to: '/campaigns' },
]

const personagensMenu: MenuItem[] = [
  { label: 'Novo Personagem', to: '/charactercreate?new=true' },
  { label: 'Listar Personagens', to: '/characters' },
  { label: 'Habilita Tokens', to: '/charactertoken', gm: true },
]

const monstrosMenu: MenuItem[] = [
  { label: 'Novo Monstro', to: '/monstercreate' },
  { label: 'Listar Monstros', to: '/monsters' },
]

const mainMenu: MenuItem[] = [
  { label: 'DASHBOARD', to: '/dashboard' },
  { label: 'CADASTROS', dropdown: cadastrosMenu },
  { label: 'PERSONAGENS', dropdown: personagensMenu },
  { label: 'MONSTROS', dropdown: monstrosMenu, gm: true },
  // { label: 'COMBATE', to: '/combat' },
  { label: 'JOGAR', to: '/play' },
  { label: 'GM', to: '/gmtools', gm: true },
  { label: 'NOTAS', to: '/notes' },
  { label: 'MUNDO', to: '/map' },
]

function MenuDropdownItem({ item }: { item: MenuItem }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={item.to!}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#6f0000] hover:text-white focus:bg-[#6f0000] focus:text-white text-[#6f0000] custom-dropdown-item"
        >
          <div className="text-sm font-medium leading-none">{item.label}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

function MobileMenuItem({
  item,
  gm,
  onClose,
}: {
  item: MenuItem
  gm: boolean
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  if (item.gm && !gm) return null

  if (item.dropdown) {
    const dropdownItems = item.dropdown.filter(sub => !sub.gm || gm)
    return (
      <div className="border-b border-white/10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-white font-medium hover:bg-white/10 transition-colors"
        >
          <span>{item.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="bg-black/20">
            {dropdownItems.map(sub => (
              <Link
                key={sub.label}
                to={sub.to!}
                onClick={onClose}
                className="block px-8 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border-b border-white/10">
      <Link
        to={item.to!}
        onClick={onClose}
        className="block px-4 py-3 text-white font-medium hover:bg-white/10 transition-colors"
      >
        {item.label}
      </Link>
    </div>
  )
}

export default function TopNav() {
  const { user } = useAuth()
  const gm = user?.is_gm
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="w-full h-16 bg-[#6f0000] flex items-center z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-4 md:px-6">
          {/* Logo à esquerda */}
          <div className="flex items-center h-full">
            <Link to="/dashboard" className="flex items-center h-full">
              <img
                src={logoBlack}
                alt="D&D"
                className="h-12 w-auto select-none filter invert"
              />
            </Link>
          </div>

          {/* Menu central (desktop) */}
          <div className="hidden md:flex flex-1 justify-center text-white">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex items-center space-x-1">
                {mainMenu.map(item => {
                  if (item.gm && !gm) return null

                  if (item.dropdown) {
                    const dropdownItems = item.dropdown.filter(
                      sub => !sub.gm || gm
                    )
                    return (
                      <NavigationMenuItem key={item.label}>
                        <NavigationMenuTrigger className="font-semibold text-white px-6 py-3 h-12 flex items-center custom-nav-trigger">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="min-w-[280px] gap-2 p-6 bg-white border border-gray-200 shadow-xl rounded-lg">
                            {dropdownItems.map(sub => (
                              <MenuDropdownItem key={sub.label} item={sub} />
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }

                  return (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.to!}
                          className="font-semibold text-white px-6 py-3 h-12 flex items-center custom-nav-link"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Perfil do usuário (desktop) */}
          <div className="hidden md:flex items-center gap-3 text-white">
            <span className="font-medium text-sm">
              {user?.name || 'Usuário'}
            </span>
            <Link to="/profile">
              <span className="text-white text-sm hover:text-white transition-colors px-2 py-2 rounded">
                Meu Perfil
              </span>
            </Link>
          </div>

          {/* Menu hambúrguer (mobile) */}
          <div className="md:hidden flex items-center gap-3">
            <span className="text-white text-sm font-medium">
              {user?.name || 'Usuário'}
            </span>
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded transition-colors"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Menu lateral para mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#6f0000] transform transition-transform duration-300 z-50 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-white font-semibold">Menu</span>
          <button
            onClick={closeMobileMenu}
            className="text-white p-2 hover:bg-white/10 rounded transition-colors"
            aria-label="Fechar menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col">
          {mainMenu.map(item => (
            <MobileMenuItem
              key={item.label}
              item={item}
              gm={gm || false}
              onClose={closeMobileMenu}
            />
          ))}

          <div className="border-b border-white/10">
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Meu Perfil
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
