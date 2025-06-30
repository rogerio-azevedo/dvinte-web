import React from 'react'
import Header from '../../../components/Header'

import { Wrapper, PageContainer } from './styles'

interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <Wrapper>
      <Header />
      <PageContainer>{children}</PageContainer>
    </Wrapper>
  )
}
