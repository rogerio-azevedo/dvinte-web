import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'

import api from '../../services/api'

import { connect, socket } from '../../services/socket'

import * as Styles from './styles'

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

import Chat from '../../components/CombatComponents/Chat'
import Savins from '../../components/CombatComponents/Savings'
import ArmoryDelay from '../../components/CombatComponents/ArmoryDelay'
import Initiatives from '../../components/CombatComponents/Initiatives'
import DamagesCounter from '../../components/CombatComponents/DamagesCounter'
import CharStatus from '../../components/CombatComponents/CharStatus'
import LogBoard from '../../components/CombatComponents/LogBoard'
import MapTool from '../../components/CombatComponents/MapTool'

import RenderMap from '../../components/CombatComponents/RenderMap'
import ScrollContainer from 'react-indiana-drag-scroll'

import MyDices from '../../components/CombatComponents/MyDices'
import { diceDataRequest } from '../../store/modules/dices/actions'

export default function Play() {
  const { profile } = useSelector(state => state.user)
  const showMenu = useSelector(state => state.menu.chatMenu)
  const { diceShow } = useSelector(state => state.dices)
  const [allowDrag, setAllowDrag] = useState(false)
  const [menu, setMenu] = useState('attack')

  const [charInit, setCharInit] = useState()
  const [character, setCharacter] = useState()
  const [tokens, setTokens] = useState()
  const [fortitude, setFortitude] = useState()
  const [reflex, setReflex] = useState()
  const [will, setWill] = useState()
  const [strength, setStrength] = useState()

  const [maxDex, setMaxDex] = useState()
  const [weapons, setWeapons] = useState()
  const [charStatus, setCharStatus] = useState()
  const dispatch = useDispatch()

  const clickListener = event => {
    if (event.target.tagName === 'CANVAS') {
      dispatch(
        diceDataRequest({
          diceShow: false,
        })
      )
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickListener)
    return () => {
      document.removeEventListener('click', clickListener)
    }
  }, []) // eslint-disable-line

  async function calcDext(dexMod) {
    let dextBonus = 0

    if (dexMod <= maxDex) {
      dextBonus = dexMod
    } else if (!maxDex || maxDex === 0) {
      dextBonus = dexMod
    } else {
      dextBonus = maxDex
    }

    return dextBonus
  }

  async function GetTokens() {
    try {
      const response = await api.get('/chartokens')

      setTokens(response.data)
    } catch (e) {
      toast.error('Houve um problema ao carregar as Tokens dos Personagens!')
    }
  }

  async function getCharacter() {
    try {
      const response = await api.get(`combats/${profile.id}`)
      const char = response.data
      setCharacter(char)

      const StrMod = char.StrModTemp ? char.StrModTemp : char.StrMod
      const ConMod = char.ConModTemp ? char.ConModTemp : char.ConMod
      const DexMod = char.DexModTemp ? char.DexModTemp : char.DexMod
      const WisMod = char.WisModTemp ? char.WisModTemp : char.WisMod

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
      const ca = 10 + shield + armor + bonusDext + natural + outros

      setCharInit(DexMod)
      setFortitude(char.Fortitude + ConMod)
      setReflex(char.Reflex + DexMod)
      setWill(char.Will + WisMod)
      setStrength(char.BaseAttack + StrMod)

      setCharStatus({
        fortitude: char.Fortitude + ConMod,
        reflex: char.Reflex + DexMod,
        will: char.Will + WisMod,
        charInit: DexMod,
        melee: char.BaseAttack + StrMod,
        ranged: char.BaseAttack + DexMod,
        totalCa: ca,
        health: char.Health,
        healthNow: char.HealthNow,
      })
    } catch (e) {
      toast.error('Houve um problema ao carregar os dados dos personagens!')
    }
  }

  useEffect(() => {
    dispatch(
      diceDataRequest({
        diceShow: false,
        diceRoll: false,
      })
    )

    connect()
    getCharacter()
    GetTokens()
  }, []) // eslint-disable-line

  useEffect(() => {
    const handleTokens = Tokens => setTokens(Tokens)

    socket.on('token.message', handleTokens)

    return () => socket.off('token.message', handleTokens)
  }, [tokens])

  function handleMenu(tipo) {
    setMenu(tipo)
  }

  function handleDragable() {
    setAllowDrag(!allowDrag)
  }

  return (
    <Styles.Container>
      <Styles.MapContainer show={showMenu ? 1 : 0}>
        <ScrollContainer vertical={allowDrag} horizontal={allowDrag}>
          {diceShow && <MyDices />}
          <RenderMap tokens={tokens} allowDrag={allowDrag} />
        </ScrollContainer>
      </Styles.MapContainer>

      <Styles.ToolsContainer show={showMenu ? 1 : 0}>
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

          {profile.is_gm && (
            <div data-tip="Mapas">
              <GiTreasureMap
                size={28}
                color="#8e0e00"
                cursor="pointer"
                onClick={() => handleMenu('config')}
              />
            </div>
          )}
          {profile.is_gm && (
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
            profile={profile}
            from={profile.id}
            charInit={charInit}
          />
        ) : menu === 'attack' ? (
          <Styles.AttackContainer>
            <ArmoryDelay character={character} weapons={weapons} />
            <h2>Painel Logs</h2>
            <LogBoard />
          </Styles.AttackContainer>
        ) : menu === 'damage' ? (
          <DamagesCounter />
        ) : menu === 'status' ? (
          <CharStatus charStatus={charStatus} />
        ) : menu === 'saves' ? (
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
        ) : (
          <MapTool />
        )}
      </Styles.ToolsContainer>
    </Styles.Container>
  )
}
