import React, { useState, useEffect } from 'react'
// import { format, subDays } from 'date-fns'
// import { useSelector } from 'react-redux'
import { MdWhatshot } from 'react-icons/md'
import { lighten } from 'polished'

import SpinnerLoad from '../../components/SpinnerLoad'

import { Container, DashContainer, DashHeader } from './styles'
// import api from '../../../services/api'

interface DashboardItem {
  icon: React.ReactElement
  count: number
  label: string
  color: string
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false)

  const perfil = true

  const dashboardItems: DashboardItem[] = [
    {
      icon: <MdWhatshot size={50} color="#0A4045" />,
      count: 10,
      label: 'Usuários',
      color: '#0A4045',
    },
    {
      icon: <MdWhatshot size={50} color="#ff3300" />,
      count: 10,
      label: 'Personagens',
      color: '#ff3300',
    },
    {
      icon: <MdWhatshot size={50} color="#9111d1" />,
      count: 10,
      label: 'Campanhas',
      color: '#9111d1',
    },
    {
      icon: <MdWhatshot size={50} color="#785B62" />,
      count: 10,
      label: 'Mapas',
      color: '#785B62',
    },
    {
      icon: <MdWhatshot size={50} color="#bab406" />,
      count: 10,
      label: 'Monstros',
      color: '#bab406',
    },
    {
      icon: <MdWhatshot size={50} color="#25259E" />,
      count: 10,
      label: 'Usuários',
      color: '#25259E',
    },
    {
      icon: <MdWhatshot size={50} color="#9c0909" />,
      count: 10,
      label: 'Usuários',
      color: '#9c0909',
    },
    {
      icon: <MdWhatshot size={50} color="#cc7e00" />,
      count: 10,
      label: 'Usuários',
      color: '#cc7e00',
    },
    {
      icon: <MdWhatshot size={50} color="#06bab1" />,
      count: 10,
      label: 'Usuários',
      color: '#06bab1',
    },
    {
      icon: <MdWhatshot size={50} color="#1E8C48" />,
      count: 10,
      label: 'Usuários',
      color: '#1E8C48',
    },
    {
      icon: <MdWhatshot size={50} color="#b8028a" />,
      count: 10,
      label: 'Usuários',
      color: '#b8028a',
    },
    {
      icon: <MdWhatshot size={50} color="#000" />,
      count: 10,
      label: 'Usuários',
      color: '#000',
    },
  ]

  useEffect(() => {
    async function loadDash() {
      setLoading(true)
      // Aqui você pode adicionar a lógica para carregar os dados do dashboard
      setLoading(false)
    }
    loadDash()
  }, []) // eslint-disable-line

  return (
    <Container $perfil={perfil} $loading={loading}>
      <SpinnerLoad loading={loading ? 1 : 0} />

      <DashContainer $loading={loading}>
        <DashHeader>
          <h1>Dashboard</h1>
        </DashHeader>
        <ul>
          {dashboardItems.map((item, index) => (
            <li key={index}>
              <div>
                <div style={{ background: lighten(0.73, item.color) }}>
                  {item.icon}
                </div>
                <h2>{item.count}</h2>
                <strong>{item.label}</strong>
              </div>
            </li>
          ))}
        </ul>
      </DashContainer>
    </Container>
  )
}
