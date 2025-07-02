import React from 'react'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from 'styled-components'

import './config/ReactotronConfig'

import Routes from './routes'

import { AuthProvider } from './contexts/AuthContext'
import { MenuProvider } from './contexts/MenuContext'
import { DicesProvider } from './contexts/DicesContext'
import { CharacterCreationProvider } from './contexts/CharacterCreationContext'
import { CombatProvider } from './contexts/CombatContext'

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
