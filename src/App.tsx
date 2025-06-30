import React from 'react'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import './config/ReactotronConfig'

import Routes from './routes'
// import history from './services/history' // TODO: Remover após migração completa

import { store, persistor } from './store'
import { CharacterCreationProvider } from './contexts/CharacterCreationContext'
import { CombatProvider } from './contexts/CombatContext'

import GlobalStyle from './styles/global'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CombatProvider>
          <CharacterCreationProvider>
            <BrowserRouter>
              <Routes />
              <GlobalStyle />
              <ToastContainer autoClose={3000} />
            </BrowserRouter>
          </CharacterCreationProvider>
        </CombatProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
