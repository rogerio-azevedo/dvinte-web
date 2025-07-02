import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigator } from '../../services/navigate'

const NavigationHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigator(navigate)
  }, [navigate])

  return null
}

export default NavigationHandler
