import React, { useState } from 'react'
import { Link } from 'react-router'
import { FaAlignJustify } from 'react-icons/fa'

import TopNav from '../TopNav'
import { useAuth } from '../../contexts/AuthContext'
import { useMenu } from '../../contexts/MenuContext'
import * as Styles from './styles'

// import Notifications from '~/components/Notifications';

export default function Header() {
  const { user } = useAuth()
  const { state: menuState, actions: menuActions } = useMenu()
  const showMenu = menuState.chatMenu
  const [chatMenu, setChatMenu] = useState(showMenu || false)

  function handleShowMenu() {
    const newMenuState = !chatMenu
    menuActions.showMenu(newMenuState)
    setChatMenu(newMenuState)
  }

  const defaultAvatar = '/favicon.ico'

  if (!user) {
    return null
  }

  return (
    <Styles.Container>
      <Styles.Content>
        <TopNav />

        <aside>
          {/* <Notifications /> */}
          <Styles.MenuButton onClick={handleShowMenu}>
            <FaAlignJustify size={20} />
          </Styles.MenuButton>
          <Styles.Profile>
            <div>
              <strong>{user.name}</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src={user.avatar || defaultAvatar}
              alt={`Avatar de ${user.name}`}
            />
          </Styles.Profile>
        </aside>
      </Styles.Content>
    </Styles.Container>
  )
}
