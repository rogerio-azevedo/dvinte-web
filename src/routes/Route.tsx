import React from 'react'
import {
  Route as ReactRoute,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom'

import AuthLayout from '../pages/_Layouts/auth'
import DefaultLayout from '../pages/_Layouts/default'

import { store } from '../store'

interface RouteWrapperProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<RouteComponentProps>
  isPrivate?: boolean
}

interface AuthState {
  auth: {
    signed: boolean
  }
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({
  component: Component,
  isPrivate = false,
  ...rest
}) => {
  const { signed } = (store.getState() as AuthState).auth

  if (!signed && isPrivate) {
    return <Redirect to="/" />
  }

  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />
  }

  const Layout = signed ? DefaultLayout : AuthLayout

  return (
    <ReactRoute
      {...rest}
      render={(props: RouteComponentProps) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

export default RouteWrapper
