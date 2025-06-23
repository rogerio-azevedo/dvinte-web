import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import TopNav from '../TopNav'
import { FaAlignJustify } from 'react-icons/fa/'

import { showMenuRequest } from '../../store/modules/menu/actions'

// import Notifications from '~/components/Notifications';

import { Container, Content, Profile } from './styles'

export default function Header() {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.user.profile)
  const showMenu = useSelector(state => state.menu.chatMenu)
  const [chatMenu, setChatMenu] = useState(showMenu)

  function handleShowMenu() {
    dispatch(showMenuRequest(!chatMenu))
    setChatMenu(!chatMenu)
  }

  return (
    <Container>
      <Content>
        <TopNav />

        <aside>
          {/* <Notifications /> */}
          <div>
            <FaAlignJustify
              size={20}
              color="#fff"
              cursor="pointer"
              onClick={handleShowMenu}
            />
          </div>
          <Profile>
            <div>
              <strong>{profile.name}</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src="https://api.adorable.io/avatars/50/abott@adorable.png"
              alt=""
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  )
}
