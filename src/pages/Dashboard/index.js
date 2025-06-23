import React, { useState, useEffect } from 'react'
// import { format, subDays } from 'date-fns'
// import { useSelector } from 'react-redux'
import { MdWhatshot } from 'react-icons/md'
import { lighten } from 'polished'

import SpinnerLoad from '../../components/SpinnerLoad'

import { Container, DashContainer, DashHeader } from './styles'
// import api from '../../../services/api'

export default function Dashboard() {
  const [loading, setLoading] = useState()

  const perfil = true

  useEffect(() => {
    async function loadDash() {
      setLoading(true)

      setLoading(false)
    }
    loadDash()
  }, []) // eslint-disable-line

  return (
    <>
      <Container perfil={perfil ? 1 : 0} loading={loading ? 1 : 0}>
        <SpinnerLoad loading={loading ? 1 : 0} />

        <DashContainer loading={loading ? 1 : 0}>
          <DashHeader>
            <h1>Dashboard</h1>
          </DashHeader>
          <ul>
            <li>
              <div>
                <div style={{ background: `${lighten(0.73, '#0A4045')}` }}>
                  <MdWhatshot size={50} color="#0A4045" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.42, '#ff3300')}` }}>
                  <MdWhatshot size={50} color="#ff3300" />
                </div>
                <h2>10</h2>
                <strong>Personagens</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.48, '#9111d1')}` }}>
                  <MdWhatshot size={50} color="#9111d1" />
                </div>
                <h2>10</h2>
                <strong>Campanhas</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.45, '#785B62')}` }}>
                  <MdWhatshot size={50} color="#785B62" />
                </div>
                <h2>10</h2>
                <strong>Mapas</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.55, '#bab406')}` }}>
                  <MdWhatshot size={50} color="#bab406" />
                </div>
                <h2>10</h2>
                <strong>Monstros</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.55, '#25259E')}` }}>
                  <MdWhatshot size={50} color="#25259E" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.58, '#9c0909')}` }}>
                  <MdWhatshot size={50} color="#9c0909" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.48, '#cc7e00')}` }}>
                  <MdWhatshot size={50} color="#cc7e00" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.58, '#06bab1')}` }}>
                  <MdWhatshot size={50} color="#06bab1" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.55, '#1E8C48')}` }}>
                  <MdWhatshot size={50} color="#1E8C48" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.58, '#b8028a')}` }}>
                  <MdWhatshot size={50} color="#b8028a" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
            <li>
              <div>
                <div style={{ background: `${lighten(0.82, '#000')}` }}>
                  <MdWhatshot size={50} color="#000" />
                </div>
                <h2>10</h2>
                <strong>Usuários</strong>
              </div>
            </li>
          </ul>
        </DashContainer>
      </Container>
    </>
  )
}
