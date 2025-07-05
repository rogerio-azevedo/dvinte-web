/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import Chat from '../../components/CombatComponents/Chat'
import Initiatives from '../../components/CombatComponents/Initiatives'
import ArmoryDelay from '../../components/CombatComponents/ArmoryDelay'
import DamagesCounter from '../../components/CombatComponents/DamagesCounter'
import CharStatusComponent from '../../components/CombatComponents/CharStatus'
import LogBoard from '../../components/CombatComponents/LogBoard'
import MapTool from '../../components/CombatComponents/MapTool'
import Savins from '../../components/CombatComponents/Savings'
import * as Styles from './styles'
import { MENU, type MenuType } from './PlayMenuBar'

import {
  type Character,
  type CharStatusData,
  type WeaponItem,
} from './interfaces'

interface ActiveMenuPanelProps {
  menu: MenuType
  user: any
  charInit?: number
  character?: Character
  weapons?: WeaponItem[]
  getCharacter: (user: { id: number }) => Promise<any>
  fortitude?: number
  reflex?: number
  will?: number
  strength?: number
  charStatus?: CharStatusData
}

const ActiveMenuPanel: React.FC<ActiveMenuPanelProps> = ({
  menu,
  user,
  charInit,
  character,
  weapons,
  getCharacter,
  fortitude,
  reflex,
  will,
  strength,
  charStatus,
}) => {
  switch (menu) {
    case MENU.CHAT:
      return <Chat />
    case MENU.INIT:
      return (
        <Initiatives
          profile={user || undefined}
          from={user?.id}
          charInit={charInit}
        />
      )
    case MENU.ATTACK:
      return (
        <div className="flex flex-1 flex-col overflow-auto">
          <ArmoryDelay
            character={character}
            weapons={weapons || []}
            loadChar={async () => {
              if (!user) return
              await getCharacter({ id: user.id })
            }}
          />
          <h2>Painel Logs</h2>
          <LogBoard />
        </div>
      )
    case MENU.DAMAGE:
      return <DamagesCounter />
    case MENU.STATUS:
      return (
        <CharStatusComponent
          charStatus={charStatus || ({} as CharStatusData)}
        />
      )
    case MENU.SAVES:
      return (
        <Styles.SavesConteiner>
          <Styles.ButtonsContainer>
            <Savins
              fortitude={fortitude}
              reflex={reflex}
              will={will}
              strength={strength}
            />
          </Styles.ButtonsContainer>
          <h2>Painel Logs</h2>
          <LogBoard />
        </Styles.SavesConteiner>
      )
    case MENU.CONFIG:
      return <MapTool />
    default:
      return <MapTool />
  }
}

export default ActiveMenuPanel
