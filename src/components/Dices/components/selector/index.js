import React, { useState } from 'react'

import * as CntFld from './styled'

const Selector = () => {
  const [input, setInput] = useState('4d6')

  return (
    <div id="selector_div" style={{ display: 'none' }}>
      <CntFld.CenterField>
        <div id="sethelp">
          escolha seu dado clicanco diretamente nos dados ou inserindo o nome ca
          caixa de texto,
          <br />
          toque ou arrates o mouse no espaço em branco da tela ou pressione o
          botão rolar
        </div>
      </CntFld.CenterField>
      <CntFld.CenterField>
        <input type="text" id="set" value={input} onChange={() => setInput()} />
        <br />
        <button id="clear">limpar</button>
        <button style={{ marginLeft: '0.6em' }} id="throw">
          rolar
        </button>
      </CntFld.CenterField>
    </div>
  )
}

export default Selector
