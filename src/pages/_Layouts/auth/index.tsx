import React from 'react'
import { Wrapper, Content } from './styles'

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  )
}
