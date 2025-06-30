import React from 'react'
import { Navigate } from 'react-router'

import AuthLayout from '../pages/_Layouts/auth'
import DefaultLayout from '../pages/_Layouts/default'

import { store } from '../store'

interface AuthState {
  auth: {
    signed: boolean
  }
}

interface WithAuthProps {
  isPrivate?: boolean
}

// HOC para autenticação
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  isPrivate = false
) {
  return function WrappedComponent(props: P & WithAuthProps) {
    const { signed } = (store.getState() as AuthState).auth

    if (!signed && isPrivate) {
      return <Navigate to="/" replace />
    }

    if (signed && !isPrivate) {
      return <Navigate to="/dashboard" replace />
    }

    const Layout = signed ? DefaultLayout : AuthLayout

    return (
      <Layout>
        <Component {...props} />
      </Layout>
    )
  }
}

// Função helper para criar componentes protegidos
export function createProtectedComponent<P extends object>(
  Component: React.ComponentType<P>,
  isPrivate = false
) {
  return withAuth(Component, isPrivate)
}
