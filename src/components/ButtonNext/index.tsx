/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import React from 'react'
import { MdChevronRight } from 'react-icons/md'
import { useNavigate } from 'react-router'

import { ArrowRigth } from './styles'

interface ButtonNextProps {
  linkto: string
  display: string
  handleSave?: () => void
}

const ButtonNext: React.FC<ButtonNextProps> = ({
  linkto,
  display,
  handleSave,
}) => {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('🔍 ButtonNext clicado', {
      linkto,
      hasHandleSave: !!handleSave,
    })

    if (handleSave) {
      // Executar handleSave e aguardar
      try {
        console.log('🔍 Executando handleSave...')
        handleSave()
        // Aguardar um pouco para garantir que o save foi processado
        setTimeout(() => {
          console.log('🔍 Navegando para:', linkto)
          navigate(linkto)
        }, 500) // Aumentei para 500ms para dar tempo do toast aparecer
      } catch (error) {
        console.error('Erro ao salvar:', error)
      }
    } else {
      // Se não tem handleSave, navegar imediatamente
      console.log('🔍 Navegando imediatamente para:', linkto)
      navigate(linkto)
    }
  }

  return (
    <ArrowRigth display={display}>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <MdChevronRight
          size={100}
          color={display === 'show' ? '#8e0e00' : '#fff'}
        />
      </div>
    </ArrowRigth>
  )
}

export default ButtonNext
