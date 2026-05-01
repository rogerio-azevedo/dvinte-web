/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import api from '../../../services/api'

import SelectWeapon from '../../SelectWeapon'
import SelectCharacter from '../../SelectCharacter'
import { useDices } from '../../../hooks/useDices'
import { useAuth } from '../../../contexts'
import {
  generateSecureRandomNumber,
  generateSecureRandomNumbers,
} from './genRandomNumber'

import {
  type APICharacter,
  type ArmoryProps,
  type Character,
} from './interfaces'

/** combats/ e formulários legacy usam `Cod`; outros trechos usam `id`. */
function resolveCharacterRecordId(char: unknown): number | undefined {
  if (!char || typeof char !== 'object') return undefined
  const o = char as Record<string, unknown>
  if (typeof o.id === 'number') return o.id
  if (typeof o.Cod === 'number') return o.Cod
  return undefined
}

export default function Armory({
  loadChar,
  character: prefetchedCharacter,
  weapons: prefetchedWeapons = [],
}: ArmoryProps) {
  const { setDiceData } = useDices()

  const { user } = useAuth()
  const from = user?.id

  const [weapon, setWeapon] = useState<number | undefined>()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [characterWeapons, setCharacterWeapons] = useState<any[]>([])
  const [loadingWeapons, setLoadingWeapons] = useState(false)

  const loadCharsInFlightRef = useRef(false)
  const loadWeaponsInFlightRef = useRef(false)

  const loadCharacterWeapons = useCallback(
    async (charId: number) => {
      if (loadWeaponsInFlightRef.current) return
      loadWeaponsInFlightRef.current = true

      const applyWeaponsOrPrefetch = (): void => {
        const pid = resolveCharacterRecordId(prefetchedCharacter)
        if (pid !== undefined && pid === charId && prefetchedWeapons.length > 0) {
          setCharacterWeapons(prefetchedWeapons)
        } else {
          setCharacterWeapons([])
        }
      }

      setLoadingWeapons(true)
      try {
        const response = await api.get(`characters/${charId}`)
        const charData = response.data
        const list = charData?.Weapon || []

        if (Array.isArray(list) && list.length > 0) {
          setCharacterWeapons(list)
        } else {
          applyWeaponsOrPrefetch()
        }
      } catch (error) {
        console.error('❌ Erro ao carregar armas do personagem:', error)
        toast.error('Erro ao carregar armas do personagem')
        applyWeaponsOrPrefetch()
      } finally {
        setLoadingWeapons(false)
        loadWeaponsInFlightRef.current = false
      }
    },
    [prefetchedCharacter, prefetchedWeapons]
  )

  const loadUserCharacters = useCallback(async () => {
    if (!user?.id || loadCharsInFlightRef.current) return

    loadCharsInFlightRef.current = true
    try {
      const response = await api.get(`/characters/user/${user?.id}`)

      const characters = Array.isArray(response.data) ? response.data : []

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
        Equipment: char.Equipment,
      }))

      const validCharacters = mappedCharacters.filter(
        char => char && char.id && char.name
      )

      setUserCharacters(validCharacters)

      if (validCharacters.length === 1) {
        const singleChar = validCharacters[0]
        setSelectedCharacter(singleChar)

        const combatId = resolveCharacterRecordId(prefetchedCharacter)
        const canUsePrefetch =
          combatId !== undefined &&
          combatId === singleChar.id &&
          prefetchedWeapons.length > 0

        if (!singleChar.Weapon || singleChar.Weapon.length === 0) {
          if (canUsePrefetch) {
            setCharacterWeapons(prefetchedWeapons)
          } else {
            await loadCharacterWeapons(singleChar.id)
          }
        } else {
          setCharacterWeapons(singleChar.Weapon || [])
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar personagens:', error)
      toast.error('Erro ao carregar seus personagens')
      setUserCharacters([])
    } finally {
      loadCharsInFlightRef.current = false
    }
  }, [user?.id, prefetchedCharacter, prefetchedWeapons, loadCharacterWeapons])

  useEffect(() => {
    loadUserCharacters()
  }, [loadUserCharacters])

  // getCharacter (/combats) pode resolver depois da lista — preenche armas se o slot ainda está vazio
  useEffect(() => {
    const combatId = resolveCharacterRecordId(prefetchedCharacter)
    if (
      prefetchedWeapons.length === 0 ||
      combatId === undefined ||
      selectedCharacter?.id === undefined ||
      selectedCharacter.id !== combatId
    ) {
      return
    }
    setCharacterWeapons(prev => (prev.length === 0 ? prefetchedWeapons : prev))
  }, [
    prefetchedCharacter,
    prefetchedWeapons,
    selectedCharacter?.id,
  ])

  // Removido useEffect desnecessário - carregamento via handleCharacterChange

  const handleCharacterChange = (value: string | null) => {
    if (!value) {
      setSelectedCharacter(null)
      setWeapon(undefined)
      return
    }

    const selected = userCharacters.find(
      char => char && char.id && String(char.id) === value
    )

    if (selected) {
      setSelectedCharacter(selected)
      // Carregar apenas as armas se necessário
      if (!selected.Weapon || selected.Weapon.length === 0) {
        loadCharacterWeapons(selected.id)
      } else {
        setCharacterWeapons(selected.Weapon || [])
      }
    } else {
      setSelectedCharacter(null)
    }

    setWeapon(undefined)
  }

  const renderCharacterSelector = () => {
    const validCharacters = userCharacters.filter(
      char => char && char.id && char.name
    )

    return (
      <div className="flex items-center mb-2 w-full">
        {validCharacters.length > 1 && (
          <SelectCharacter
            characters={validCharacters.map(char => ({
              value: String(char.id),
              label: char.name,
            }))}
            changeCharacter={handleCharacterChange}
          />
        )}
      </div>
    )
  }

  async function handleAttack() {
    setDiceData({
      diceType: null,
      diceSides: null,
      diceMult: null,
      diceResult: null,
      diceShow: false,
      diceRoll: false,
    })

    if (!weapon || !selectedCharacter) {
      toast.error(
        'Escolha um personagem e uma arma antes de realizar o ataque.'
      )
      return
    }

    const wep = characterWeapons.find((w: any) => w.id === weapon)
    if (!wep) return

    // Calcular bônus de ataque dos equipamentos
    const equipmentAttackBonus =
      selectedCharacter?.Equipment?.reduce(
        (sum: number, equip: any) => sum + (equip.attack_bonus || 0),
        0
      ) || 0

    const extraHit = wep.hit || 0
    const totalWeaponBonus = extraHit + equipmentAttackBonus
    const critFrom = wep.crit_from_mod > 0 ? wep.crit_from_mod : wep.crit_from
    const name = wep.nickname?.trim() ? wep.nickname : wep.name

    const dice = await generateSecureRandomNumber(1, 20, user?.id, user?.name)

    // Pequeno delay para garantir que o estado anterior foi limpo
    await new Promise(resolve => setTimeout(resolve, 100))

    setDiceData({
      diceType: `d${20}`,
      diceSides: 20,
      diceMult: 1,
      diceResult: [dice],
      diceShow: true,
      diceRoll: true,
    })

    let isCrit = ''

    if (dice >= critFrom) {
      isCrit = 'HIT'
    } else if (dice === 1) {
      isCrit = 'FAIL'
    } else {
      isCrit = 'NORMAL'
    }

    // Usar os modificadores que já vêm corretos da API
    const StrMod =
      selectedCharacter.StrModTemp !== null &&
        selectedCharacter.StrModTemp !== undefined &&
        selectedCharacter.StrModTemp !== 0
        ? selectedCharacter.StrModTemp
        : selectedCharacter.StrMod ?? 0
    const DexMod =
      selectedCharacter.DexModTemp !== null &&
        selectedCharacter.DexModTemp !== undefined &&
        selectedCharacter.DexModTemp !== 0
        ? selectedCharacter.DexModTemp
        : selectedCharacter.DexMod ?? 0
    const mod = wep.range > 3 ? DexMod : StrMod
    const baseAttack = selectedCharacter.BaseAttack ?? 0
    const base = baseAttack + mod
    const attack = base + dice + totalWeaponBonus

    // Debug logs para confirmar a correção
    console.log('🎯 Debug ataque (corrigido):', {
      personagem: selectedCharacter.name,
      arma: name,
      range: wep.range,
      StrMod,
      DexMod,
      modUsado: mod,
      baseAttack,
      baseTotal: base,
      dice,
      extraHit,
      equipmentAttackBonus,
      totalWeaponBonus,
      attackTotal: attack,
    })

    let rolled = ''
    if (isCrit === 'HIT') {
      rolled = `ACERTO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${totalWeaponBonus} de bônus, com resultado: ${attack}`
    } else if (isCrit === 'FAIL') {
      rolled = `ERRO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${totalWeaponBonus} de bônus, com resultado: ${attack}`
    } else {
      rolled = `ATACOU com ${name} => d20: ${dice} + ${base} de base + ${totalWeaponBonus} de bônus, com resultado: ${attack}`
    }

    try {
      await api.post('combats', {
        id: from,
        user_id: user?.id,
        user: user?.name,
        message: rolled,
        result: attack,
        type: 3,
        isCrit: isCrit,
      })
      loadChar()
    } catch (error) {
      console.error('❌ Erro ao enviar ataque:', error)
      toast.error('Erro ao enviar ataque')
    }
  }

  async function handleDamage() {
    setDiceData({
      diceType: null,
      diceSides: null,
      diceMult: null,
      diceResult: null,
      diceShow: false,
      diceRoll: false,
    })

    if (!weapon || !selectedCharacter) {
      toast.error('Escolha um personagem e uma arma antes de realizar o dano.')
      return
    }

    const wep = characterWeapons.find((w: any) => w.id === weapon)
    if (!wep) return

    const size = selectedCharacter.Size

    // Calcular bônus de dano dos equipamentos
    const equipmentDamageBonus =
      selectedCharacter?.Equipment?.reduce((sum: number, equip: any) => {
        const bonus =
          typeof equip.damage_bonus === 'string'
            ? parseFloat(equip.damage_bonus) || 0
            : equip.damage_bonus || 0
        return sum + bonus
      }, 0) || 0

    // Usar os modificadores que já vêm corretos da API (mesma lógica do ataque)
    const StrMod =
      selectedCharacter.StrModTemp !== null &&
        selectedCharacter.StrModTemp !== undefined &&
        selectedCharacter.StrModTemp !== 0
        ? selectedCharacter.StrModTemp
        : selectedCharacter.StrMod ?? 0
    const DexMod =
      selectedCharacter.DexModTemp !== null &&
        selectedCharacter.DexModTemp !== undefined &&
        selectedCharacter.DexModTemp !== 0
        ? selectedCharacter.DexModTemp
        : selectedCharacter.DexMod ?? 0

    let mod = 0
    let modType = ''

    if (wep.dex_damage === true) {
      mod = DexMod
      modType = 'de mod de Destreza'
    } else {
      mod = StrMod
      modType = 'de mod de Força'
    }

    const exMod = Math.floor(wep.str_bonus * mod)
    const dice = size === 'MÉDIO' ? wep.dice_m : wep.dice_s
    const multi = size === 'MÉDIO' ? wep.multiplier_m : wep.multiplier_s
    const name = wep.nickname?.trim() ? wep.nickname : wep.name
    const extraDamage = wep.damage || 0
    const totalWeaponDamage = extraDamage + equipmentDamageBonus
    const element =
      wep.element > 0
        ? await generateSecureRandomNumber(1, wep.element, selectedCharacter.id)
        : 0

    const dices = await generateSecureRandomNumbers(
      1,
      Number(dice),
      multi,
      selectedCharacter.id
    )

    const result = dices.reduce((a, b) => a + b, 0)

    // Pequeno delay para garantir que o estado anterior foi limpo
    await new Promise(resolve => setTimeout(resolve, 100))

    setDiceData({
      diceType: `d${dice}`,
      diceSides: dice,
      diceMult: multi,
      diceResult: dices,
      diceShow: true,
      diceRoll: true,
    })

    const totalDamage = result + totalWeaponDamage + exMod + element

    // Debug logs para confirmar a correção
    console.log('⚔️ Debug dano (corrigido):', {
      personagem: selectedCharacter.name,
      arma: name,
      size,
      StrMod,
      DexMod,
      modUsado: mod,
      modType,
      str_bonus: wep.str_bonus,
      exMod,
      dice,
      multi,
      result,
      extraDamage,
      equipmentDamageBonus,
      totalWeaponDamage,
      element,
      totalDamage,
    })

    const rolled = `CAUSOU DANO com ${name} => ${multi} x d${dice}: ${result} + ${exMod} ${modType} + ${totalWeaponDamage} de bônus da arma + ${element} bônus de elemento. Com resultado: ${totalDamage}`

    try {
      await api.post('combats', {
        id: from,
        user_id: user?.id,
        user: selectedCharacter?.name || user?.name, // Nome do personagem, não do usuário
        message: rolled,
        result: totalDamage,
        type: 4,
      })
      loadChar()
    } catch (error) {
      console.error('❌ Erro ao enviar dano:', error)
      toast.error('Erro ao enviar dano')
    }
  }

  async function handleCritDamage() {
    setDiceData({
      diceType: null,
      diceSides: null,
      diceMult: null,
      diceResult: null,
      diceShow: false,
      diceRoll: false,
    })

    if (!weapon || !selectedCharacter) {
      toast.error(
        'Escolha um personagem e uma arma antes de realizar o dano crítico.'
      )
      return
    }

    const wep = characterWeapons.find((w: any) => w.id === weapon)
    if (!wep) return

    const size = selectedCharacter.Size

    // Calcular bônus de dano dos equipamentos
    const equipmentDamageBonus =
      selectedCharacter?.Equipment?.reduce((sum: number, equip: any) => {
        const bonus =
          typeof equip.damage_bonus === 'string'
            ? parseFloat(equip.damage_bonus) || 0
            : equip.damage_bonus || 0
        return sum + bonus
      }, 0) || 0

    // Usar os modificadores que já vêm corretos da API (mesma lógica do ataque)
    const StrMod =
      selectedCharacter.StrModTemp !== null &&
        selectedCharacter.StrModTemp !== undefined &&
        selectedCharacter.StrModTemp !== 0
        ? selectedCharacter.StrModTemp
        : selectedCharacter.StrMod ?? 0
    const DexMod =
      selectedCharacter.DexModTemp !== null &&
        selectedCharacter.DexModTemp !== undefined &&
        selectedCharacter.DexModTemp !== 0
        ? selectedCharacter.DexModTemp
        : selectedCharacter.DexMod ?? 0

    let mod = 0
    let modType = ''

    if (wep.dex_damage === true) {
      mod = DexMod
      modType = 'de mod de Destreza'
    } else {
      mod = StrMod
      modType = 'de mod de Força'
    }

    const exMod = Math.floor(wep.str_bonus * mod)
    const dice = size === 'MÉDIO' ? wep.dice_m : wep.dice_s
    const multi = size === 'MÉDIO' ? wep.multiplier_m : wep.multiplier_s
    const name = wep.nickname?.trim() ? wep.nickname : wep.name
    const extraDamage = wep.damage || 0
    const totalWeaponDamage = extraDamage + equipmentDamageBonus
    const element =
      wep.element > 0
        ? await generateSecureRandomNumber(1, wep.element, selectedCharacter.id)
        : 0
    const critMult = wep.crit_mod > 0 ? wep.crit_mod : wep.critical

    const dices = await generateSecureRandomNumbers(
      1,
      Number(dice),
      multi * critMult,
      selectedCharacter.id
    )

    const result = dices.reduce((a, b) => a + b, 0)

    // Pequeno delay para garantir que o estado anterior foi limpo
    await new Promise(resolve => setTimeout(resolve, 100))

    setDiceData({
      diceType: `d${dice}`,
      diceSides: dice,
      diceMult: multi * critMult,
      diceResult: dices,
      diceShow: true,
      diceRoll: true,
    })

    const totalDamage =
      result + totalWeaponDamage * critMult + exMod * critMult + element

    // Debug logs para confirmar a correção
    console.log('💥 Debug dano crítico (corrigido):', {
      personagem: selectedCharacter.name,
      arma: name,
      size,
      StrMod,
      DexMod,
      modUsado: mod,
      modType,
      str_bonus: wep.str_bonus,
      exMod,
      critMult,
      exModCrit: exMod * critMult,
      dice,
      multi,
      multiCrit: multi * critMult,
      result,
      extraDamage,
      extraDamageCrit: extraDamage * critMult,
      element,
      totalDamage,
    })

    const rolled = `CAUSOU DANO CRÍTICO com ${name} => ${multi * critMult
      } x d${dice}: ${result} + ${exMod * critMult} ${modType} + ${extraDamage * critMult
      } de bônus da arma + ${element} bônus de elemento. Com resultado: ${totalDamage}`

    try {
      await api.post('combats', {
        id: from,
        user_id: user?.id,
        user: selectedCharacter?.name || user?.name,
        message: rolled,
        result: totalDamage,
        type: 4,
        // HIT/FAIL em isCrit é só para rolagem de ataque (d20); dano crítico não é “acerto crítico”
        isCrit: 'NORMAL',
      })
      loadChar()
    } catch (error) {
      console.error('❌ Erro ao enviar dano crítico:', error)
      toast.error('Erro ao enviar dano crítico')
    }
  }

  return (
    <div className="flex justify-center items-center flex-col h-auto w-full px-3 py-3">
      {/* Seletor de personagem */}
      {renderCharacterSelector()}

      {/* Seletor de armas */}
      <div className="w-full">
        {loadingWeapons ? (
          <p className="text-sm text-slate-500 italic text-center py-1">Carregando armas...</p>
        ) : characterWeapons && characterWeapons.length > 0 ? (
          <SelectWeapon
            weapons={characterWeapons}
            changeWeapon={option => setWeapon(option?.value)}
          />
        ) : !loadingWeapons ? (
          <p className="text-sm text-slate-400 italic text-center py-1">Nenhuma arma encontrada.</p>
        ) : null}
      </div>

      <div className="flex flex-row flex-wrap items-center justify-center gap-2 mt-3 mb-2 w-full">
        <button
          type="button"
          onClick={handleAttack}
          className="flex-1 min-w-[70px] h-9 px-2 text-xs font-bold rounded-md border border-[#8e0e00]/40 bg-[#8e0e00]/8 text-[#8e0e00] shadow-sm transition-all duration-150 hover:bg-[#8e0e00] hover:text-white hover:border-[#8e0e00] hover:shadow-[0_2px_8px_rgba(142,14,0,0.35)] active:scale-95"
        >
          Atacar
        </button>
        <button
          type="button"
          onClick={handleDamage}
          className="flex-1 min-w-[70px] h-9 px-2 text-xs font-bold rounded-md border border-amber-400/60 bg-amber-50 text-amber-800 shadow-sm transition-all duration-150 hover:bg-amber-600 hover:text-white hover:border-amber-600 hover:shadow-[0_2px_8px_rgba(217,119,6,0.35)] active:scale-95"
        >
          Dano
        </button>
        <button
          type="button"
          onClick={handleCritDamage}
          className="flex-1 min-w-[70px] h-9 px-2 text-xs font-bold rounded-md border border-blue-400/60 bg-blue-50 text-blue-800 shadow-sm transition-all duration-150 hover:bg-blue-700 hover:text-white hover:border-blue-700 hover:shadow-[0_2px_8px_rgba(29,78,216,0.35)] active:scale-95"
        >
          Dano Crítico
        </button>
      </div>
    </div>
  )
}
