import React from 'react'
import { useSelector } from 'react-redux'
import ScaleLoader from 'react-spinners/ScaleLoader'

import * as Styles from './styles'

interface RootState {
  user: {
    profile: {
      isPorter?: boolean
      tipo?: number
    }
  }
}

interface SpinnerLoadProps {
  loading?: number | boolean
}

export default function SpinnerLoad({ loading = 0 }: SpinnerLoadProps) {
  const profile = useSelector(
    (state: RootState) =>
      state.user.profile.isPorter || state.user.profile.tipo === 1
  )

  // Converte o loading para boolean para o ScaleLoader
  const isLoading = Boolean(loading)

  return (
    <Styles.Container $visible={isLoading}>
      <ScaleLoader
        height={80}
        width={12}
        margin={6}
        radius={4}
        color={profile ? '#232947' : '#0d5b61'}
        loading={isLoading}
      />
    </Styles.Container>
  )
}
