import ScaleLoader from 'react-spinners/ScaleLoader'
import * as Styles from './styles'

interface SpinnerLoadProps {
  loading?: number | boolean
}

export default function SpinnerLoad({ loading = 0 }: SpinnerLoadProps) {
  const isLoading = Boolean(loading)

  return (
    <Styles.Container $visible={isLoading}>
      <ScaleLoader
        height={80}
        width={12}
        margin={6}
        radius={4}
        color={'#232947'}
        loading={isLoading}
      />
    </Styles.Container>
  )
}
