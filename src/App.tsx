import React from 'react'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from 'styled-components'

import './config/ReactotronConfig'

import Routes from './routes'

import { store, persistor } from './store'
import { CharacterCreationProvider } from './contexts/CharacterCreationContext'
import { CombatProvider } from './contexts/CombatContext'

import GlobalStyle from './styles/global'
import theme from './styles/theme'
import NavigationHandler from './components/NavigationHandler'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
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
      </PersistGate>
    </Provider>
  )
}

export default App
