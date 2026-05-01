/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'

import { connect } from '../../services/socket'
import {
  type Character,
  type CharStatusData,
  type WeaponItem,
  MENU,
  type MenuType,
} from './interfaces'

import { type Token } from '../../components/CombatComponents/RenderMap/interfaces'

import RenderMap from '../../components/CombatComponents/RenderMap'
import MyDices from '../../components/CombatComponents/MyDices'
import { useDices } from '../../hooks/useDices'
import { useAuth } from '../../contexts'
import { getTokens } from './getTokens'
import { getCharacter } from './getCharacters'
import PlaySidebar from './PlaySidebar'
import ActiveMenuPanel from './ActiveMenuPanel'
import GenericDices from '../../components/CombatComponents/GenericDices'
import Initiatives from '../../components/CombatComponents/Initiatives'
import MapControls from '../../components/CombatComponents/MapControls'
import { useStageSize } from '../../hooks/useStageSize'

export default function Play() {
  const {
    state: { diceShow },
  } = useDices()

  const { user } = useAuth()

  const [allowDrag, setAllowDrag] = useState(false)
  const [menu, setMenu] = useState<MenuType>(MENU.ATTACK)
  const [charInit, setCharInit] = useState<number>()
  const [character, setCharacter] = useState<Character>()
  const [tokens, setTokens] = useState<Token[]>([])
  const [fortitude, setFortitude] = useState<number>()
  const [reflex, setReflex] = useState<number>()
  const [will, setWill] = useState<number>()
  const [strength, setStrength] = useState<number>()
  // const [maxDex, setMaxDex] = useState<number>()
  const [weapons, setWeapons] = useState<WeaponItem[]>()
  const [charStatus, setCharStatus] = useState<CharStatusData>()
  const { setDiceData } = useDices()

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapSize = useStageSize(mapContainerRef)

  const clickListener = (event: any) => {
    if (event.target.tagName === 'CANVAS') {
      setDiceData({
        diceType: null,
        diceSides: null,
        diceMult: null,
        diceResult: null,
        diceShow: false,
        diceRoll: false,
      })
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickListener)
    return () => {
      document.removeEventListener('click', clickListener)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    connect()
    if (user) {
      getCharacter(user).then(data => {
        if (!data) return
        setCharacter(data.char)
        // setMaxDex(data.maxDext)
        setWeapons(data.weapons)
        setCharInit(data.charInit)
        setFortitude(data.fortitude)
        setReflex(data.reflex)
        setWill(data.will)
        setStrength(data.strength)
        setCharStatus(data.charStatus)
      })

      getTokens().then(tokens => setTokens(tokens ?? []))
    }
  }, [user])

  function handleMenu(type: MenuType) {
    setMenu(type)
  }

  function handleDragable() {
    setAllowDrag(!allowDrag)
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-row align-stretch w-full max-w-[1920px] mx-auto overflow-hidden gap-4 px-2 h-[calc(100vh-65px)]">
        <div
          ref={mapContainerRef}
          className="relative flex-1 min-w-0 h-full overflow-hidden bg-[#1a1a2e] rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.6)] z-0"
        >
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            <div className="pointer-events-none w-full h-full relative">
              <GenericDices />
              <Initiatives
                profile={user || undefined}
                from={user?.id}
                charInit={charInit}
              />
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
            {diceShow && <MyDices />}
          </div>

          <div className="absolute inset-0 z-[5] min-h-0">
            <RenderMap
              tokens={tokens}
              allowDrag={allowDrag}
              setTokens={setTokens}
              containerSize={mapSize}
            />
          </div>

          <MapControls allowDrag={allowDrag} onToggleDrag={handleDragable} />
        </div>

        <PlaySidebar handleMenu={handleMenu} user={user} menu={menu}>
          <ActiveMenuPanel
            menu={menu}
            user={user}
            charInit={charInit}
            character={character}
            weapons={weapons}
            getCharacter={getCharacter}
            fortitude={fortitude}
            reflex={reflex}
            will={will}
            strength={strength}
            charStatus={charStatus}
          />
        </PlaySidebar>
      </div>
    </div>
  )
}
