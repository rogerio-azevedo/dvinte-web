/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../../services/api'

import SelectWeapon from '../../SelectWeapon'
import SelectCharacter from '../../../components/SelectCharacter'

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
}

interface Weapon {
  id: number
  name: string
  nickname?: string
  hit: number
  damage: number
  element: number
  crit_from: number
  crit_from_mod: number
  critical: number
  crit_mod: number
  dice_m: number
  dice_s: number
  multiplier_m: number
  multiplier_s: number
  range: number
  str_bonus: number
  dex_damage: boolean
}

interface WeaponFormData {
  weapon: number
  hit: string
  damage: string
  element: string
  crit_mod: string
  crit_from_mod: string
  dex_damage: string
  price: string
  nickname: string
  description: string
  character: number
}

interface UserState {
  profile: {
    id: number
    name: string
  }
}

interface RootState {
  user: UserState
}

interface ArmoryProps {
  character: Character
  weapons: Weapon[]
  loadChar: boolean
}

interface CharacterOption {
  value: string
  label: string
}

interface CritType {
  HIT: 'HIT'
  FAIL: 'FAIL'
  NORMAL: 'NORMAL'
}

type CritResult = keyof CritType

const Armory: React.FC<ArmoryProps> = ({ character, weapons, loadChar }) => {
  const { profile } = useSelector((state: RootState) => state.user)
  const from = profile.id

  const [weapon, setWeapon] = useState<number | undefined>()
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [characterWeapons, setCharacterWeapons] = useState<Weapon[]>([])
  const [loadingCharacters, setLoadingCharacters] = useState<boolean>(false)
  const [loadingWeapons, setLoadingWeapons] = useState<boolean>(false)

  // Carregar personagens do usuário
  const loadUserCharacters = useCallback(async (): Promise<void> => {
    if (loadingCharacters) return

    setLoadingCharacters(true)
    try {
      const response = await api.get(`/combats/characters/${profile.id}`)

      const characters: Character[] = Array.isArray(response.data)
        ? response.data
        : []

      setUserCharacters(characters)

      // Se há apenas um personagem, selecionar automaticamente
      if (characters.length === 1) {
        setSelectedCharacter(characters[0])
        console.log(
          '🔍 Armory - Auto-selecionado único personagem:',
          characters[0]
        )
      }
    } catch (error) {
      console.error('❌ Armory - Erro ao carregar personagens:', error)
      setUserCharacters([]) // Garantir que seja sempre um array
      toast.error('Erro ao carregar seus personagens')
    } finally {
      setLoadingCharacters(false)
    }
  }, [profile.id])

  // Carregar armas do personagem selecionado
  const loadCharacterWeapons = useCallback(
    async (characterId: number): Promise<void> => {
      if (loadingWeapons) return

      setLoadingWeapons(true)
      try {
        const response = await api.get(`/combats/${profile.id}/${characterId}`)
        const characterData = response.data
        setCharacterWeapons(characterData?.Weapon || [])
      } catch (error) {
        toast.error('Erro ao carregar armas do personagem')
        setCharacterWeapons([]) // Garantir que seja sempre um array
      } finally {
        setLoadingWeapons(false)
      }
    },
    [profile.id]
  )

  // Função para carregar dados completos do personagem
  const loadCharacterData = async (characterId: number): Promise<Character> => {
    try {
      const response = await api.get(`/combats/${profile.id}/${characterId}`)
      return response.data
    } catch (error) {
      return character // fallback para o character passado por props
    }
  }

  useEffect(() => {
    loadUserCharacters()
  }, [loadUserCharacters])

  useEffect(() => {
    if (selectedCharacter) {
      loadCharacterWeapons(selectedCharacter.id)
      setWeapon(undefined) // Reset da arma selecionada
    }
  }, [selectedCharacter, loadCharacterWeapons])

  const weaponsToUse = useMemo(
    () => (characterWeapons.length > 0 ? characterWeapons : weapons),
    [characterWeapons, weapons]
  )

  const getWeaponName = (weapon: Weapon): string => {
    return weapon?.nickname && weapon.nickname.trim() !== ''
      ? weapon.nickname
      : weapon.name
  }

  const getCurrentCharacter = async (): Promise<Character> => {
    return selectedCharacter
      ? await loadCharacterData(selectedCharacter.id)
      : character
  }

  const handleAttack = async (): Promise<void> => {
    if (!weapon) {
      toast.error('Escolha por favor uma arma antes de realizar o ataque.')
      return
    }

    const wep = weaponsToUse.find((w: Weapon) => w.id === weapon)
    if (!wep) return

    const extraHit = wep.hit || 0
    const critFrom = wep.crit_from_mod > 0 ? wep.crit_from_mod : wep.crit_from
    const name = getWeaponName(wep)
    const dice = Math.floor(Math.random() * 20) + 1

    let isCrit: CritResult = 'NORMAL'

    if (dice >= critFrom) {
      isCrit = 'HIT'
    } else if (dice === 1) {
      isCrit = 'FAIL'
    }

    const currentChar = await getCurrentCharacter()
    const StrMod = currentChar?.StrModTemp ?? currentChar?.StrMod ?? 0
    const DexMod = currentChar?.DexModTemp ?? currentChar?.DexMod ?? 0

    const mod = wep.range > 3 ? DexMod : StrMod
    const base = (currentChar?.BaseAttack ?? 0) + mod
    const attack = Number(base) + Number(dice) + Number(extraHit)

    let rolled = ''

    switch (isCrit) {
      case 'HIT':
        rolled = `ACERTO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
        break
      case 'FAIL':
        rolled = `ERRO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
        break
      default:
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
    } catch (error) {
      toast.error('Erro ao enviar ataque')
    }
  }

  const calculateDamage = async (
    isCritical: boolean = false
  ): Promise<void> => {
    if (!weapon) {
      toast.error('Escolha por favor uma arma antes de realizar o dano.')
      return
    }

    const wep = weaponsToUse.find((w: Weapon) => w.id === weapon)
    if (!wep) return

    const currentChar = await getCurrentCharacter()
    const size = currentChar?.Size

    let mod = 0
    let modType = ''

    if (wep.dex_damage) {
      mod = currentChar?.DexModTemp ?? currentChar?.DexMod ?? 0
      modType = isCritical ? 'bônus de Destreza' : 'de mod de Destreza'
    } else {
      mod = currentChar?.StrModTemp ?? currentChar?.StrMod ?? 0
      modType = isCritical ? 'bônus de Força' : 'de mod de Força'
    }

    const exMod = Math.floor(wep.str_bonus * mod)
    const dice = size === 'MÉDIO' ? wep.dice_m : wep.dice_s
    const multi = size === 'MÉDIO' ? wep.multiplier_m : wep.multiplier_s
    const name = getWeaponName(wep)
    const extraDamage = wep.damage || 0
    const element =
      wep.element > 0 ? Math.floor(Math.random() * wep.element) + 1 : 0

    const dices: number[] = []
    const random = (): number => Math.floor(Math.random() * Number(dice)) + 1

    for (let i = 0; i < multi; i++) {
      dices.push(random())
    }

    let result = dices.reduce((a, b) => a + b, 0)
    let totalDamage: number
    let rolled: string

    if (isCritical) {
      const critMult = wep.crit_mod > 0 ? wep.crit_mod : wep.critical
      const multCrit = multi * critMult
      const diceCrit = result * critMult
      const modCrit = exMod * critMult
      const extCrit = extraDamage * critMult

      totalDamage =
        Number(diceCrit) + Number(modCrit) + Number(extCrit) + Number(element)
      rolled = `CAUSOU DANO CRÍTICO com ${name} => ${multi} x d${dice}: ${result} x ${multCrit} CRIT: ${diceCrit} + ${modCrit} ${modType} + ${extCrit} de bônus da arma, + ${element} de bônus elemento. Com resultado: ${totalDamage}`
    } else {
      totalDamage =
        Number(result) + Number(extraDamage) + Number(exMod) + Number(element)
      rolled = `CAUSOU DANO com ${name} => ${multi} x d${dice}: ${result} + ${exMod} ${modType} + ${extraDamage} de bônus da arma + ${element} bônus de elemento. Com resultado: ${totalDamage}`
    }

    try {
      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: totalDamage,
        type: 4,
        ...(isCritical && { isCrit: 'HIT' }),
      })
    } catch (error) {
      toast.error('Erro ao enviar dano')
    }
  }

  const handleDamage = (): Promise<void> => calculateDamage(false)
  const handleCritDamage = (): Promise<void> => calculateDamage(true)

  const handleCharacterChange = useCallback(
    (option: any) => {
      const selectedChar = userCharacters.find(
        char => char.id.toString() === option?.value
      )
      setSelectedCharacter(selectedChar || null)
    },
    [userCharacters]
  )

  const handleWeaponChange = useCallback((option: any) => {
    setWeapon(option?.value)
  }, [])

  // Memoize as opções de personagem
  const characterOptions = useMemo(
    () =>
      userCharacters.map(char => ({
        value: char.id.toString(),
        label: char.name,
      })),
    [userCharacters]
  )

  return (
    <Styles.Container>
      <Styles.ArmoryContainer>
        <h2>Arsenal</h2>

        {/* Seleção de personagem se houver múltiplos */}
        {userCharacters.length > 1 && (
          <Styles.WeaponContainer>
            <label>Personagem:</label>
            {loadingCharacters ? (
              <p>Carregando personagens...</p>
            ) : (
              <SelectCharacter
                characters={characterOptions}
                changeCharacter={handleCharacterChange}
              />
            )}
          </Styles.WeaponContainer>
        )}

        {/* Seleção de arma */}
        <Styles.WeaponContainer>
          {!loadChar && (
            <>
              {loadingWeapons ? (
                <p>Carregando armas...</p>
              ) : weaponsToUse && weaponsToUse.length > 0 ? (
                <SelectWeapon
                  weapons={weaponsToUse}
                  changeWeapon={handleWeaponChange}
                />
              ) : (
                <p>Nenhuma arma encontrada para este personagem</p>
              )}
            </>
          )}
        </Styles.WeaponContainer>

        <Styles.AttackContainer>
          <div>
            <button type="button" onClick={handleAttack}>
              Atacar
            </button>
          </div>
          <div>
            <button type="button" onClick={handleDamage}>
              Dano
            </button>
          </div>
          <div>
            <button type="button" onClick={handleCritDamage}>
              Dano Crítico
            </button>
          </div>
        </Styles.AttackContainer>
      </Styles.ArmoryContainer>
    </Styles.Container>
  )
}

export default Armory
