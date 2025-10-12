/* eslint-disable no-console */

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router'

import api from '../../services/api'
import { useAuth, useMenu } from '../../contexts'

import { connect, socket } from '../../services/socket'
import {
  FaComments,
  FaUserClock,
  FaDiceD20,
  FaExpandArrowsAlt,
  FaRunning,
} from 'react-icons/fa/'

import {
  GiSwordBrandish,
  GiSwordsEmblem,
  GiBloodySword,
  GiTreasureMap,
  GiBrain,
} from 'react-icons/gi'

import * as Styles from './styles'

import RenderMap from '../../components/CombatComponents/RenderMap'
import Chat from '../../components/CombatComponents/Chat'
import Savins from '../../components/CombatComponents/Savings'
import Armory from '../../components/CombatComponents/Armory'
import Initiatives from '../../components/CombatComponents/Initiatives'
import DamagesCounter from '../../components/CombatComponents/DamagesCounter'
import CharStatus from '../../components/CombatComponents/CharStatus'
import LogBoard from '../../components/CombatComponents/LogBoard'
import MapTool from '../../components/CombatComponents/MapTool'
import Dices from '../../components/CombatComponents/Dices'

import ScrollContainer from 'react-indiana-drag-scroll'

import {
  type MenuType,
  type Character,
  type Weapon,
  type CharStatusProps,
} from './interfaces'

import { type Token } from '../../components/CombatComponents/RenderMap/interfaces'

export default function Combat(): React.JSX.Element {
  const { user } = useAuth()
  const { state: menuState } = useMenu()
  const showMenu = menuState.chatMenu
  const [menu, setMenu] = useState<MenuType>('attack')
  const [charInit, setCharInit] = useState<number | undefined>()
  const [character, setCharacter] = useState<Character | undefined>()
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {}, [tokens])
  const [fortitude, setFortitude] = useState<number | undefined>()
  const [reflex, setReflex] = useState<number | undefined>()
  const [will, setWill] = useState<number | undefined>()
  const [strength, setStrength] = useState<number | undefined>()

  const [maxDex, setMaxDex] = useState<number | undefined>()
  const [weapons, setWeapons] = useState<Weapon[] | undefined>()
  const [charStatus, setCharStatus] = useState<CharStatusProps | undefined>()
  const [allowDrag, setAllowDrag] = useState<boolean>(false)

  async function calcDext(dexMod: number): Promise<number> {
    let dextBonus = 0

    if (maxDex !== undefined && dexMod <= maxDex) {
      dextBonus = dexMod
    } else if (!maxDex || maxDex === 0) {
      dextBonus = dexMod
    } else {
      dextBonus = maxDex
    }

    return dextBonus
  }

  async function GetTokens(): Promise<void> {
    try {
      const response = await api.get<Token[]>('/chartokens')

      // Garantir que sempre seja um array
      const tokensData = Array.isArray(response.data) ? response.data : []
      setTokens(tokensData)
    } catch (e) {
      console.error('🔴 Combat: Error loading tokens:', e)
      toast.error('Houve um problema ao carregar as Tokens dos Personagens!')
    }
  }

  async function getCharacter(): Promise<void> {
    try {
      const response = await api.get<Character>(`combats/${user?.id}`)
      const char = response.data
      setCharacter(char)

      const StrMod = char.StrModTemp ? char.StrModTemp : char.StrMod
      const ConMod = char.ConModTemp ? char.ConModTemp : char.ConMod
      const DexMod = char.DexModTemp ? char.DexModTemp : char.DexMod
      const WisMod = char.WisModTemp ? char.WisModTemp : char.WisMod

      // Calcula bônus de equipamentos
      const { calculateEquipmentBonuses } = await import(
        '../../util/calculateEquipmentBonuses'
      )
      const equipmentBonuses = calculateEquipmentBonuses(char?.Equipment || [])

      const shield = char?.Armor.filter(t => t.type === 2).reduce(
        (acc, val) => {
          return acc + (val.bonus + val.defense)
        },
        0
      )

      const armor = char?.Armor.filter(t => t.type === 1).reduce((acc, val) => {
        return acc + (val.bonus + val.defense)
      }, 0)

      const natural = char?.Armor.filter(t => t.type === 3).reduce(
        (acc, val) => {
          return acc + (val.bonus + val.defense)
        },
        0
      )

      const outros = char?.Armor.filter(t => t.type === 5).reduce(
        (acc, val) => {
          return acc + (val.bonus + val.defense)
        },
        0
      )

      const maxDext = char?.Armor.reduce(
        (min, p) => (p?.dexterity < min ? p?.dexterity : min),
        char?.Armor[0]?.dexterity
      )

      setMaxDex(maxDext)

      const charWeapons = char?.Weapon

      setWeapons(charWeapons)

      const bonusDext = await calcDext(DexMod)
      // Adiciona bônus de CA dos equipamentos
      const ca =
        10 +
        shield +
        armor +
        bonusDext +
        natural +
        outros +
        equipmentBonuses.armorClass

      setCharInit(DexMod)
      // Adiciona bônus de resistências dos equipamentos
      setFortitude(char.Fortitude + ConMod + equipmentBonuses.fortitude)
      setReflex(char.Reflex + DexMod + equipmentBonuses.reflex)
      setWill(char.Will + WisMod + equipmentBonuses.will)
      // Adiciona bônus de ataque dos equipamentos
      setStrength(char.BaseAttack + StrMod + equipmentBonuses.attack)

      setCharStatus({
        fortitude: char.Fortitude + ConMod + equipmentBonuses.fortitude,
        reflex: char.Reflex + DexMod + equipmentBonuses.reflex,
        will: char.Will + WisMod + equipmentBonuses.will,
        charInit: DexMod,
        melee: char.BaseAttack + StrMod + equipmentBonuses.attack,
        ranged: char.BaseAttack + DexMod + equipmentBonuses.attack,
        totalCa: ca,
        health: char.Health,
        healthNow: char.HealthNow,
      })
    } catch (e) {
      console.error(e)
      toast.error('Houve um problema ao carregar os dados dos personagens!')
    }
  }

  useEffect(() => {
    connect()
    getCharacter()
    GetTokens()
  }, []) // eslint-disable-line

  useEffect(() => {
    const handleTokens = (Tokens: Token[]) => {
      // Garantir que sempre seja um array
      const tokensArray = Array.isArray(Tokens) ? Tokens : []
      setTokens(tokensArray)
    }

    socket.on('token.message', handleTokens)

    return () => {
      socket.off('token.message', handleTokens)
    }
  }, []) // Removida dependência [tokens] para evitar loop infinito

  function handleMenu(tipo: MenuType): void {
    setMenu(tipo)
  }

  function handleDragable(): void {
    setAllowDrag(!allowDrag)
  }

  return (
    <Styles.Container>
      <Styles.CombatContainer show={!!showMenu}>
        <ScrollContainer vertical={allowDrag} horizontal={allowDrag}>
          <Styles.MapContainer>
            <RenderMap
              tokens={tokens}
              allowDrag={allowDrag}
              setTokens={setTokens}
            />
          </Styles.MapContainer>
        </ScrollContainer>
      </Styles.CombatContainer>

      <Styles.TalkContainer show={!!showMenu}>
        <Styles.IconContainer>
          <ReactTooltip />

          {allowDrag ? (
            <div data-tip="Movimentar Mapa">
              <FaExpandArrowsAlt
                size={25}
                color="#8e0e00"
                cursor="pointer"
                onClick={handleDragable}
              />
            </div>
          ) : (
            <div data-tip="Movimentar Token">
              <FaRunning
                size={25}
                color="#8e0e00"
                cursor="pointer"
                onClick={handleDragable}
              />
            </div>
          )}

          <div data-tip="Atacar">
            <GiSwordBrandish
              size={25}
              color="#8e0e00"
              cursor="pointer"
              onClick={() => handleMenu('attack')}
            />
          </div>

          <div data-tip="Bate Papo">
            <FaComments
              size={28}
              color="#8e0e00"
              cursor="pointer"
              onClick={() => handleMenu('chat')}
            />
          </div>

          <div data-tip="Testes e Dados">
            <FaDiceD20
              size={25}
              color="#8e0e00"
              cursor="pointer"
              onClick={() => handleMenu('saves')}
            />
          </div>

          <div data-tip="Medidor de Dano">
            <GiBloodySword
              size={30}
              color="#8e0e00"
              cursor="pointer"
              onClick={() => handleMenu('damage')}
            />
          </div>

          <div data-tip="Iniciativas">
            <FaUserClock
              size={30}
              color="#8e0e00"
              cursor="pointer"
              onClick={() => handleMenu('init')}
            />
          </div>

          <div data-tip="Status do Personagem">
            <GiSwordsEmblem
              size={28}
              color="#8e0e00"
              cursor="pointer"
              onClick={() => handleMenu('status')}
            />
          </div>
          {user?.is_gm && (
            <div data-tip="Mapas">
              <GiTreasureMap
                size={28}
                color="#8e0e00"
                cursor="pointer"
                onClick={() => handleMenu('config')}
              />
            </div>
          )}
          {user?.is_gm && (
            <div data-tip="GM Tools">
              <Link to="/gmtools">
                <GiBrain size={28} color="#8e0e00" cursor="pointer" />
              </Link>
            </div>
          )}
        </Styles.IconContainer>

        {menu === 'chat' ? (
          <Chat />
        ) : menu === 'init' ? (
          <Initiatives
            profile={user || undefined}
            from={user?.id}
            charInit={charInit}
          />
        ) : menu === 'saves' ? (
          <Styles.SavesConteiner>
            <Styles.ButtonsContainer>
              <Savins
                fortitude={fortitude}
                reflex={reflex}
                will={will}
                strength={strength}
              />
              <Dices />
            </Styles.ButtonsContainer>
            <h2>Painel Logs</h2>
            <LogBoard />
          </Styles.SavesConteiner>
        ) : menu === 'damage' ? (
          <DamagesCounter />
        ) : menu === 'status' ? (
          <CharStatus charStatus={charStatus || ({} as CharStatusProps)} />
        ) : menu === 'attack' ? (
          <Styles.AttackContainer>
            <Armory
              character={character || ({} as Character)}
              weapons={weapons || []}
              loadChar={false}
            />
            <h2>Painel Logs</h2>
            <LogBoard />
          </Styles.AttackContainer>
        ) : (
          <MapTool />
        )}
      </Styles.TalkContainer>
    </Styles.Container>
  )
}
