import React from 'react'
import PropTypes from 'prop-types'

import Header from '../../../components/Header'

import { Wrapper, PageContainer } from './styles'

export default function DefaultLayout({ children }) {
  return (
    <Wrapper>
      <Header />
      <PageContainer>{children}</PageContainer>
    </Wrapper>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
}
