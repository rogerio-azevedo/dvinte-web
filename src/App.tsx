import React from 'react'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import Routes from './routes'

import {
  AuthProvider,
  MenuProvider,
  DicesProvider,
  CharacterCreationProvider,
  CombatProvider,
} from './contexts'

import GlobalStyle from './styles/global'
import theme from './styles/theme'
import NavigationHandler from './components/NavigationHandler'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MenuProvider>
        <DicesProvider>
          <ThemeProvider theme={theme}>
            <CombatProvider>
              <CharacterCreationProvider>
                <BrowserRouter>
                  <NavigationHandler />
                  <Routes />
                  <GlobalStyle />
                  <ToastContainer autoClose={3000} />
                </BrowserRouter>
              </CharacterCreationProvider>
            </CombatProvider>
          </ThemeProvider>
        </DicesProvider>
      </MenuProvider>
    </AuthProvider>
  )
}

export default App
