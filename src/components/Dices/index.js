import React from 'react'

// import ControlPanel from './components/controlepanel'
import Info from './components/info'
import Selector from './components/selector'
import Canvas from './components/canvas'
import EnginerJs from './components/enginerjs'

import { GlobalStyle } from './GlobalStyle'

function App() {
  return (
    <>
      <GlobalStyle />
      {/* <ControlPanel /> */}
      <Info />
      <Selector />
      <Canvas />
      <EnginerJs />
    </>
  )
}

export default App
