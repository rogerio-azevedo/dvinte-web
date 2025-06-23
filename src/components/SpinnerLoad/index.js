import React from 'react'
import { useSelector } from 'react-redux'
import ScaleLoader from 'react-spinners/ScaleLoader'
import PropTypes from 'prop-types'

import { Container } from './styles'

export default function SpinnerLoad({ loading = 0 }) {
  const perfil = useSelector(
    state => state.user.profile.isPorter || state.user.profile.tipo === 1
  )

  return (
    <Container>
      <ScaleLoader
        sizeUnit="px"
        height={80}
        width={12}
        margin="6px"
        radius={4}
        size={100}
        color={perfil ? '#232947' : '#0d5b61'}
        loading={loading}
      />
    </Container>
  )
}

SpinnerLoad.propTypes = {
  loading: PropTypes.number,
}
