import React from 'react'
import { MdChevronLeft } from 'react-icons/md'
import { Link } from 'react-router-dom'

import { ArrowLeft } from './styles'

interface ButtonPrevProps {
  linkto: string
  display: string
}

export default function ButtonPrev({ linkto, display }: ButtonPrevProps) {
  return (
    <ArrowLeft display={display}>
      <Link to={linkto}>
        <MdChevronLeft
          size={100}
          color={display === 'show' ? '#8e0e00' : '#fff'}
        />
      </Link>
    </ArrowLeft>
  )
}
