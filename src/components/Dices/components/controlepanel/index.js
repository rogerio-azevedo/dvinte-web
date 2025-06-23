import React from 'react'

import * as ConPnl from './styled'

export default () => (
  <ConPnl.ControlPanel id='control_panel'>
    <h6><img src='../favicon.ico' style={{ verticalAlign: 'middle' }} alt='favicon' /> <a href='..'>teal</a> dice</h6>
    <p id='loading_text'>Loading libraries, please wait a bit...</p>
    <p id='info_text'><a href='http://www.teall.info/2014/01/online-3d-dice-roller.html'>More info and help</a></p>
    <p id='info_text'><a href='/mdice'>Multiplayer version</a></p>
  </ConPnl.ControlPanel>
)
