import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import api from '../../../services/api'

import logoBlack from '../../assets/logo_black.svg'
//import logoRed from '~/assets/logo_red.svg'

import { Navigation, Container, Dropmenu, Logo } from './styles'

export default function TopNav() {
  // const [link, setLink] = useState('')
  const profile = useSelector(state => state.user.profile)
  const gm = profile?.is_gm
  const container = React.createRef()
  const [cad, setCad] = useState(false)
  const [cha, setCha] = useState(false)
  const [mon, setMon] = useState(false)

  function handleChaClick() {
    setCha(!cha)
    setCad(false)
    setMon(false)
  }

  function handleCadClick() {
    setCad(!cad)
    setCha(false)
    setMon(false)
  }

  function handleMonClick() {
    setMon(!mon)
    setCad(false)
    setCha(false)
  }

  function handleRemoveClick() {
    setMon(false)
    setCad(false)
    setCha(false)
  }

  // eslint-disable-next-line
  function handleClickOutside(event) {
    if (container.current && !container.current.contains(event.target)) {
      setMon(false)
      setCad(false)
      setCha(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  return (
    <Navigation>
      <Logo alt="Dvinte" src={logoBlack} />

      <Container ref={container}>
        <ul>
          <Link onClick={handleRemoveClick} to="/dashboard">
            DASHBOARD
          </Link>

          <li>
            {/* eslint-disable-next-line */}
            <strong onClick={handleCadClick}>CADASTROS</strong>
            <Dropmenu rel={cad ? 1 : 0}>
              <ul>
                <li>
                  <Link onClick={handleRemoveClick} to="/alignments">
                    Alinhamentos
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/armors">
                    Armaduras
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/weapons">
                    Armas
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/classes">
                    Classes
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/divinities">
                    Divindades
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/equipments">
                    Equipamentos
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/races">
                    Raças
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/portraits">
                    Retratos
                  </Link>
                </li>
                {gm && (
                  <li>
                    <Link onClick={handleRemoveClick} to="/tokens">
                      Tokens
                    </Link>
                  </li>
                )}

                <li>
                  <Link onClick={handleRemoveClick} to="/campaigns">
                    Campanhas
                  </Link>
                </li>
              </ul>
            </Dropmenu>
          </li>

          <li>
            {/* eslint-disable-next-line */}
            <strong onClick={handleChaClick}>PERSONAGENS</strong>
            <Dropmenu rel={cha ? 1 : 0}>
              <ul>
                <li>
                  <Link
                    onClick={handleRemoveClick}
                    to="/charactercreate?new=true"
                  >
                    Novo Personagem
                  </Link>
                </li>
                <li>
                  <Link onClick={handleRemoveClick} to="/characters">
                    Listar Personagens
                  </Link>
                </li>
                {gm && (
                  <li>
                    <Link onClick={handleRemoveClick} to="/charactertoken">
                      Habilita Tokens
                    </Link>
                  </li>
                )}

                {/* <li>
                  <Link onClick={handleRemoveClick} to="/characterview">
                    Ver Ficha
                  </Link>
                </li> */}
              </ul>
            </Dropmenu>
          </li>
          {gm && (
            <li>
              {/* eslint-disable-next-line */}
              <strong onClick={handleMonClick}>MONSTROS</strong>
              <Dropmenu rel={mon ? 1 : 0}>
                <ul>
                  <li>
                    <Link onClick={handleRemoveClick} to="/monstercreate">
                      Novo Monstro
                    </Link>
                  </li>
                  <li>
                    <Link onClick={handleRemoveClick} to="/monsters">
                      Listar Monstros
                    </Link>
                  </li>
                  {/* <li>
                  <Link onClick={handleRemoveClick} to="/characterview">
                    Ver Ficha
                  </Link>
                </li> */}
                </ul>
              </Dropmenu>
            </li>
          )}

          <Link onClick={handleRemoveClick} to="/combat">
            COMBATE
          </Link>

          <Link onClick={handleRemoveClick} to="/notes">
            NOTAS
          </Link>

          {/* <Link onClick={handleRemoveClick} to="/gmtools">
            GM
          </Link> */}
          <Link onClick={handleRemoveClick} to="/map">
            MUNDO
          </Link>
        </ul>
      </Container>
    </Navigation>
  )
}
