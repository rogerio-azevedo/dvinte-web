/* eslint-disable no-console */

import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../../services/api'

import SelectWeapon from '../../SelectWeapon'
import SelectCharacter from '../../SelectCharacter'
import { diceDataRequest } from '../../../store/modules/dices/actions'

import * as Styles from './styles'

interface Character {
  id: number
  name: string
  Size?: string
  BaseAttack?: number
  StrMod?: number
  StrModTemp?: number
  DexMod?: number
  DexModTemp?: number
  Weapon?: any[]
}

interface APICharacter {
  Cod: number
  Name: string
  Size?: string
  BaseAttack?: number
  StrMod?: number
  StrModTemp?: number
  DexMod?: number
  DexModTemp?: number
  Weapon?: any[]
}

interface ArmoryProps {
  character: any
  weapons: any[]
  loadChar: () => Promise<void>
}

export default function Armory({ character, weapons, loadChar }: ArmoryProps) {
  const { profile } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const from = profile.id

  const [weapon, setWeapon] = useState<number | undefined>()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [characterWeapons, setCharacterWeapons] = useState<any[]>([])
  const [loadingCharacters, setLoadingCharacters] = useState(false)
  const [loadingWeapons, setLoadingWeapons] = useState(false)

  // Carregar personagens do usuário
  const loadUserCharacters = useCallback(async () => {
    if (loadingCharacters) return

    setLoadingCharacters(true)
    try {
      const response = await api.get(`/characters/user/${profile.id}`)

      const characters = Array.isArray(response.data) ? response.data : []

      // Mapeia os campos da API para o formato esperado
      const mappedCharacters = characters.map((char: APICharacter) => ({
        id: char.Cod,
        name: char.Name,
        Size: char.Size,
        BaseAttack: char.BaseAttack,
        StrMod: char.StrMod,
        StrModTemp: char.StrModTemp,
        DexMod: char.DexMod,
        DexModTemp: char.DexModTemp,
        Weapon: char.Weapon,
      }))

      // Filtra apenas personagens válidos
      const validCharacters = mappedCharacters.filter(
        char => char && char.id && char.name
      )

      setUserCharacters(validCharacters)

      // Se tiver apenas um personagem válido, seleciona automaticamente
      if (validCharacters.length === 1) {
        setSelectedCharacter(validCharacters[0])
      }
    } catch (error) {
      console.error('❌ Erro ao carregar personagens:', error)
      toast.error('Erro ao carregar seus personagens')
      setUserCharacters([])
    } finally {
      setLoadingCharacters(false)
    }
  }, [profile.id])

  // Carregar armas do personagem selecionado
  const loadCharacterWeapons = useCallback(async (charId: number) => {
    if (loadingWeapons) return

    setLoadingWeapons(true)
    try {
      const response = await api.get(`characters/${charId}`)
      const charData = response.data
      setCharacterWeapons(charData?.Weapon || [])
    } catch (error) {
      toast.error('Erro ao carregar armas do personagem')
      setCharacterWeapons([])
    } finally {
      setLoadingWeapons(false)
    }
  }, [])

  // Carregar personagens ao montar o componente
  useEffect(() => {
    loadUserCharacters()
  }, [loadUserCharacters])

  // Carregar armas quando um personagem for selecionado
  useEffect(() => {
    if (selectedCharacter?.id) {
      loadCharacterWeapons(selectedCharacter.id)
    }
  }, [selectedCharacter, loadCharacterWeapons])

  const handleCharacterChange = (value: string | null) => {
    if (!value) {
      setSelectedCharacter(null)
      setWeapon(undefined)
      return
    }

    const selected = userCharacters.find(
      char => char && char.id && String(char.id) === value
    )
    setSelectedCharacter(selected || null)
    setWeapon(undefined) // Reseta a arma selecionada ao trocar de personagem
  }

  // Renderização condicional do seletor de personagens
  const renderCharacterSelector = () => {
    // Filtra apenas personagens válidos com id
    const validCharacters = userCharacters.filter(
      char => char && char.id && char.name
    )

    return (
      <Styles.WeaponContainer>
        <label>Personagem:</label>
        {loadingCharacters ? (
          <p>Carregando personagens...</p>
        ) : (
          <SelectCharacter
            characters={validCharacters.map(char => ({
              value: String(char.id), // Garante que o id seja convertido para string
              label: char.name,
            }))}
            changeCharacter={handleCharacterChange}
          />
        )}
      </Styles.WeaponContainer>
    )
  }

  async function handleAttack() {
    // Limpa o estado dos dados primeiro
    dispatch(
      diceDataRequest({
        diceType: null,
        diceSides: null,
        diceMult: null,
        diceResult: null,
        diceShow: false,
        diceRoll: false,
      })
    )

    if (!weapon || !selectedCharacter) {
      toast.error(
        'Escolha um personagem e uma arma antes de realizar o ataque.'
      )
      return
    }

    const wep = characterWeapons.find((w: any) => w.id === weapon)
    if (!wep) return

    const extraHit = wep.hit || 0
    const critFrom = wep.crit_from_mod > 0 ? wep.crit_from_mod : wep.crit_from

    const name = wep.nickname?.trim() ? wep.nickname : wep.name

    const dice = Math.floor(Math.random() * 20) + 1

    // Pequeno delay para garantir que o estado anterior foi limpo
    await new Promise(resolve => setTimeout(resolve, 100))

    dispatch(
      diceDataRequest({
        diceType: `d${20}`,
        diceSides: 20,
        diceMult: 1,
        diceResult: [dice],
        diceShow: true,
        diceRoll: true,
      })
    )

    let isCrit = ''

    if (dice >= critFrom) {
      isCrit = 'HIT'
    } else if (dice === 1) {
      isCrit = 'FAIL'
    } else {
      isCrit = 'NORMAL'
    }

    const StrMod = selectedCharacter.StrModTemp ?? selectedCharacter.StrMod ?? 0
    const DexMod = selectedCharacter.DexModTemp ?? selectedCharacter.DexMod ?? 0
    const mod = wep.range > 3 ? DexMod : StrMod
    const base = (selectedCharacter.BaseAttack ?? 0) + mod
    const attack = base + dice + extraHit

    let rolled = ''
    if (isCrit === 'HIT') {
      rolled = `ACERTO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
    } else if (isCrit === 'FAIL') {
      rolled = `ERRO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
    } else {
      rolled = `ATACOU com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
    }

    try {
      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: attack,
        type: 3,
        isCrit: isCrit,
      })
      loadChar()
    } catch (error) {
      toast.error('Erro ao enviar ataque')
    }
  }

  async function handleDamage() {
    dispatch(
      diceDataRequest({
        diceShow: false,
        diceRoll: false,
      })
    )

    if (!weapon || !selectedCharacter) {
      toast.error('Escolha um personagem e uma arma antes de realizar o dano.')
      return
    }

    const wep = characterWeapons.find((w: any) => w.id === weapon)
    if (!wep) return

    const size = selectedCharacter.Size

    let mod = 0
    let modType = ''

    if (wep.dex_damage === true) {
      mod = selectedCharacter.DexModTemp ?? selectedCharacter.DexMod ?? 0
      modType = 'de mod de Destreza'
    } else {
      mod = selectedCharacter.StrModTemp ?? selectedCharacter.StrMod ?? 0
      modType = 'de mod de Força'
    }

    const exMod = Math.floor(wep.str_bonus * mod)
    const dice = size === 'MÉDIO' ? wep.dice_m : wep.dice_s
    const multi = size === 'MÉDIO' ? wep.multiplier_m : wep.multiplier_s
    const name = wep.nickname?.trim() ? wep.nickname : wep.name
    const extraDamage = wep.damage || 0
    const element =
      wep.element > 0 ? Math.floor(Math.random() * wep.element) + 1 : 0

    const dices = []
    const random = () => Math.floor(Math.random() * Number(dice)) + 1

    for (let i = 0; i < multi; i++) {
      dices.push(random())
    }

    const result = dices.reduce((a, b) => a + b, 0)

    dispatch(
      diceDataRequest({
        diceType: `d${dice}`,
        diceSides: dice,
        diceMult: multi,
        diceResult: dices,
        diceShow: true,
        diceRoll: true,
      })
    )

    const totalDamage = result + extraDamage + exMod + element

    const rolled = `CAUSOU DANO com ${name} => ${multi} x d${dice}: ${result} + ${exMod} ${modType} + ${extraDamage} de bônus da arma + ${element} bônus de elemento. Com resultado: ${totalDamage}`

    try {
      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: totalDamage,
        type: 4,
      })
      loadChar()
    } catch (error) {
      toast.error('Erro ao enviar dano')
    }
  }

  async function handleCritDamage() {
    dispatch(
      diceDataRequest({
        diceShow: false,
        diceRoll: false,
      })
    )

    if (!weapon || !selectedCharacter) {
      toast.error(
        'Escolha um personagem e uma arma antes de realizar o dano crítico.'
      )
      return
    }

    const wep = characterWeapons.find((w: any) => w.id === weapon)
    if (!wep) return

    const size = selectedCharacter.Size

    let mod = 0
    let modType = ''

    if (wep.dex_damage === true) {
      mod = selectedCharacter.DexModTemp ?? selectedCharacter.DexMod ?? 0
      modType = 'de mod de Destreza'
    } else {
      mod = selectedCharacter.StrModTemp ?? selectedCharacter.StrMod ?? 0
      modType = 'de mod de Força'
    }

    const exMod = Math.floor(wep.str_bonus * mod)
    const dice = size === 'MÉDIO' ? wep.dice_m : wep.dice_s
    const multi = size === 'MÉDIO' ? wep.multiplier_m : wep.multiplier_s
    const name = wep.nickname?.trim() ? wep.nickname : wep.name
    const extraDamage = wep.damage || 0
    const element =
      wep.element > 0 ? Math.floor(Math.random() * wep.element) + 1 : 0
    const critMult = wep.crit_mod > 0 ? wep.crit_mod : wep.critical

    const dices = []
    const random = () => Math.floor(Math.random() * Number(dice)) + 1

    for (let i = 0; i < multi * critMult; i++) {
      dices.push(random())
    }

    const result = dices.reduce((a, b) => a + b, 0)

    dispatch(
      diceDataRequest({
        diceType: `d${dice}`,
        diceSides: dice,
        diceMult: multi * critMult,
        diceResult: dices,
        diceShow: true,
        diceRoll: true,
      })
    )

    const totalDamage =
      result + extraDamage * critMult + exMod * critMult + element

    const rolled = `CAUSOU DANO CRÍTICO com ${name} => ${
      multi * critMult
    } x d${dice}: ${result} + ${exMod * critMult} ${modType} + ${
      extraDamage * critMult
    } de bônus da arma + ${element} bônus de elemento. Com resultado: ${totalDamage}`

    try {
      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: totalDamage,
        type: 4,
        isCrit: 'HIT',
      })
      loadChar()
    } catch (error) {
      toast.error('Erro ao enviar dano crítico')
    }
  }

  return (
    <Styles.ArmoryContainer>
      <h2>Painel de Ataque</h2>

      {/* Seletor de personagem */}
      {renderCharacterSelector()}

      {/* Seletor de armas */}
      <Styles.WeaponContainer>
        {loadingWeapons ? (
          <p>Carregando armas...</p>
        ) : characterWeapons && characterWeapons.length > 0 ? (
          <SelectWeapon
            weapons={characterWeapons}
            changeWeapon={option => setWeapon(option?.value)}
          />
        ) : (
          <p>Nenhuma arma encontrada para este personagem</p>
        )}
      </Styles.WeaponContainer>

      <Styles.AttackContainer>
        <button type="button" onClick={handleAttack}>
          Atacar
        </button>
        <button type="button" onClick={handleDamage}>
          Dano
        </button>
        <button type="button" onClick={handleCritDamage}>
          Dano Crítico
        </button>
      </Styles.AttackContainer>
    </Styles.ArmoryContainer>
  )
}
