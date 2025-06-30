import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { FaAlignJustify } from 'react-icons/fa'

import TopNav from '../TopNav'
import { showMenuRequest } from '../../store/modules/menu/actions'
import * as Styles from './styles'

// import Notifications from '~/components/Notifications';

interface RootState {
  user: {
    profile: {
      name: string
      avatar?: string
    }
  }
  menu: {
    chatMenu: boolean
  }
}

export default function Header() {
  const dispatch = useDispatch()
  const profile = useSelector((state: RootState) => state.user.profile)
  const showMenu = useSelector((state: RootState) => state.menu.chatMenu)
  const [chatMenu, setChatMenu] = useState(showMenu)

  function handleShowMenu() {
    dispatch(showMenuRequest(!chatMenu))
    setChatMenu(!chatMenu)
  }

  const defaultAvatar = 'https://api.adorable.io/avatars/50/abott@adorable.png'

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
              <strong>{profile.name}</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src={profile.avatar || defaultAvatar}
              alt={`Avatar de ${profile.name}`}
            />
          </Styles.Profile>
        </aside>
      </Styles.Content>
    </Styles.Container>
  )
}
