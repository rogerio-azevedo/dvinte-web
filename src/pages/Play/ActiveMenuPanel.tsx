/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import Chat from '../../components/CombatComponents/Chat'
import ArmoryDelay from '../../components/CombatComponents/ArmoryDelay'
import DamagesCounter from '../../components/CombatComponents/DamagesCounter'
import CharStatusComponent from '../../components/CombatComponents/CharStatus'
import LogBoard from '../../components/CombatComponents/LogBoard'
import MapTool from '../../components/CombatComponents/MapTool'
import Savins from '../../components/CombatComponents/Savings'
import * as Styles from './styles'

import {
  type Character,
  type CharStatusData,
  type WeaponItem,
  MENU,
  type MenuType,
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
      return null
    case MENU.ATTACK:
      return (
        <div className="flex flex-1 flex-col overflow-hidden h-full">
          <div className="flex-shrink-0">
            <ArmoryDelay
              character={character}
              weapons={weapons || []}
              loadChar={async () => {
                if (!user) return
                await getCharacter({ id: user.id })
              }}
            />
          </div>
          <h2 className="mt-4 mb-2 font-semibold text-center flex-shrink-0">Painel Logs</h2>
          <div className="flex-1 overflow-y-auto w-full">
            <LogBoard />
          </div>
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
        <Styles.SavesConteiner className="flex flex-1 flex-col overflow-hidden h-full">
          <div className="flex-shrink-0 w-full">
            <Styles.ButtonsContainer>
              <Savins
                fortitude={fortitude}
                reflex={reflex}
                will={will}
                strength={strength}
              />
            </Styles.ButtonsContainer>
          </div>
          <h2 className="mt-4 mb-2 font-semibold text-center flex-shrink-0">Painel Logs</h2>
          <div className="flex-1 overflow-y-auto w-full">
            <LogBoard />
          </div>
        </Styles.SavesConteiner>
      )
    case MENU.CONFIG:
      return <MapTool />
    default:
      return <MapTool />
  }
}

export default ActiveMenuPanel
