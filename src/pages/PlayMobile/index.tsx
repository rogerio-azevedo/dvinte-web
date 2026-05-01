/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'

import RenderMap from '../../components/CombatComponents/RenderMap'
import { type Token } from '../../components/CombatComponents/RenderMap/interfaces'
import MyDices from '../../components/CombatComponents/MyDices'
import MapControls from '../../components/CombatComponents/MapControls'
import {
  connect,
} from '../../services/socket'

import type { Character, WeaponItem } from '../Play/interfaces'

import {
  type PlayMobileSheet,
} from './BottomNav'
import BottomNav from './BottomNav'
import AttackSheet from './AttackSheet'
import DiceSheet from './DiceSheet'
import LogSheet from './LogSheet'
import { useDices } from '../../hooks/useDices'
import { useAuth } from '../../contexts'
import { useStageSize } from '../../hooks/useStageSize'

import { getTokens } from '../Play/getTokens'
import { getCharacter } from '../Play/getCharacters'

export default function PlayMobile() {
  const {
    state: { diceShow },
    setDiceData,
  } = useDices()

  const { user } = useAuth()

  const [allowDrag, setAllowDrag] = useState(false)
  const [sheet, setSheet] = useState<PlayMobileSheet>(null)
  const [character, setCharacter] = useState<Character>()
  const [tokens, setTokens] = useState<Token[]>([])
  const [weapons, setWeapons] = useState<WeaponItem[]>()

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapSize = useStageSize(mapContainerRef)

  const toggleSheet = (id: Exclude<PlayMobileSheet, null>) =>
    setSheet(prev => (prev === id ? null : id))

  /** Fecha dados 3D ao tocar no canvas (similar à página Play desktop). */
  useEffect(() => {
    const onDocClick = (event: MouseEvent | TouchEvent) => {
      const t = event.target as HTMLElement | null
      if (!t?.tagName || t.tagName !== 'CANVAS') return

      setDiceData({
        diceType: null,
        diceSides: null,
        diceMult: null,
        diceResult: null,
        diceShow: false,
        diceRoll: false,
      })
    }

    document.addEventListener('click', onDocClick, true)
    document.addEventListener('touchend', onDocClick, true)

    return () => {
      document.removeEventListener('click', onDocClick, true)
      document.removeEventListener('touchend', onDocClick, true)
    }
  }, [setDiceData])

  useEffect(() => {
    connect()

    if (user) {
      getCharacter(user).then(data => {
        if (!data) return

        setCharacter(data.char)

        setWeapons(data.weapons)
      })

      getTokens().then(t => setTokens(t ?? []))
    }
  }, [user])

  function handleToggleDragMode() {
    setAllowDrag(d => !d)
  }

  return (
    <div className="grid h-[100dvh] w-full grid-rows-[1fr_auto] bg-[#1a1a2e]">
      <div
        ref={mapContainerRef}
        className="relative min-h-0 w-full overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          {diceShow ? <MyDices /> : null}
        </div>

        <div className="absolute inset-0 z-[5] min-h-0">
          <RenderMap
            tokens={tokens}
            allowDrag={allowDrag}
            setTokens={setTokens}
            containerSize={mapSize}
          />
        </div>

        <MapControls
          allowDrag={allowDrag}
          onToggleDrag={handleToggleDragMode}
          containerClassName="bottom-4 left-4"
        />
      </div>

      <BottomNav active={sheet} onOpen={toggleSheet} />

      <AttackSheet
        open={sheet === 'attack'}
        onClose={() => setSheet(null)}
        character={character}
        weapons={weapons ?? []}
        user={user}
        getCharacter={getCharacter}
      />

      <DiceSheet
        open={sheet === 'dice'}
        onClose={() => setSheet(null)}
      />

      <LogSheet open={sheet === 'log'} onClose={() => setSheet(null)} />
    </div>
  )
}
