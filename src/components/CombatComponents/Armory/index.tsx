import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../../services/api'

import SelectWeapon from '../../../components/SelectWeapon'
import SelectCharacter from '../../../components/SelectCharacter'

import * as Styles from './styles'

interface Character {
  id: number
  name: string
}

interface ArmoryProps {
  character: any
  weapons: any[]
  loadChar: boolean
}

export default function Armory({ character, weapons, loadChar }: ArmoryProps) {
  const { profile } = useSelector((state: any) => state.user)
  const from = profile.id

  const [weapon, setWeapon] = useState()
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [characterWeapons, setCharacterWeapons] = useState<any[]>([])
  const [loadingCharacters, setLoadingCharacters] = useState(false)
  const [loadingWeapons, setLoadingWeapons] = useState(false)

  // Carregar personagens do usuário
  async function loadUserCharacters() {
    if (loadingCharacters) return

    setLoadingCharacters(true)
    try {
      const response = await api.get(`/combats/characters/${profile.id}`)
      const characters = response.data || []
      setUserCharacters(characters)

      // Se há apenas um personagem, selecionar automaticamente
      if (characters.length === 1) {
        setSelectedCharacter(characters[0])
      }
    } catch (error) {
      toast.error('Erro ao carregar seus personagens')
    } finally {
      setLoadingCharacters(false)
    }
  }

  // Carregar armas do personagem selecionado
  async function loadCharacterWeapons(characterId: number) {
    if (loadingWeapons) return

    setLoadingWeapons(true)
    try {
      const response = await api.get(`/combats/${profile.id}/${characterId}`)
      const characterData = response.data
      setCharacterWeapons(characterData?.Weapon || [])
    } catch (error) {
      toast.error('Erro ao carregar armas do personagem')
    } finally {
      setLoadingWeapons(false)
    }
  }

  // Carregar personagens ao montar o componente
  useEffect(() => {
    loadUserCharacters()
  }, [])

  // Carregar armas quando um personagem for selecionado
  useEffect(() => {
    if (selectedCharacter) {
      loadCharacterWeapons(selectedCharacter.id)
      setWeapon(undefined) // Reset da arma selecionada
    }
  }, [selectedCharacter])

  // Usar as armas do personagem selecionado, ou as armas passadas por props como fallback
  const weaponsToUse = characterWeapons.length > 0 ? characterWeapons : weapons

  async function handleAttack() {
    if (weapon) {
      const wep = await weaponsToUse?.find((w: any) => w.id === weapon)
      const extraHit = wep?.hit || 0
      const critFrom =
        wep?.crit_from_mod > 0 ? wep?.crit_from_mod : wep?.crit_from

      const name =
        wep?.nickname !== '' &&
        wep?.nickname !== undefined &&
        wep?.nickname !== null
          ? wep?.nickname
          : wep?.name

      const dice = Math.floor(Math.random() * 20) + 1

      let isCrit = ''

      if (dice >= critFrom) {
        isCrit = 'HIT'
      } else if (dice === 1) {
        isCrit = 'FAIL'
      } else {
        isCrit = 'NORMAL'
      }

      let mod = 0

      // Usar dados do personagem selecionado ou do character prop
      const currentChar = selectedCharacter
        ? await loadCharacterData(selectedCharacter.id)
        : character

      const StrMod = currentChar?.StrModTemp
        ? currentChar?.StrModTemp
        : currentChar?.StrMod

      const DexMod = currentChar?.DexModTemp
        ? currentChar?.DexModTemp
        : currentChar?.DexMod

      if (wep?.range > 3) {
        mod = DexMod
      } else {
        mod = StrMod
      }

      const base = currentChar?.BaseAttack + mod
      const attack = Number(base) + Number(dice) + Number(extraHit)

      let rolled = ''

      if (isCrit === 'HIT') {
        rolled = `ACERTO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
      } else if (isCrit === 'FAIL') {
        rolled = `ERRO CRÍTICO com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
      } else {
        rolled = `ATACOU com ${name} => d20: ${dice} + ${base} de base + ${extraHit} de bônus, com resultado: ${attack}`
      }

      api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: attack,
        type: 3,
        isCrit: isCrit,
      })
    } else {
      toast.error('Escolha por favor uma arma antes de realizar o ataque.')
    }
  }

  async function handleDamage() {
    if (weapon) {
      const wep = await weaponsToUse?.find((w: any) => w.id === weapon)
      const currentChar = selectedCharacter
        ? await loadCharacterData(selectedCharacter.id)
        : character
      const size = await currentChar?.Size

      let mod = 0
      let modType = ''

      if (wep?.dex_damage === true) {
        mod = (await currentChar?.DexModTemp)
          ? currentChar.DexModTemp
          : currentChar.DexMod

        modType = 'de mod de Destreza'
      } else {
        mod = (await currentChar?.StrModTemp)
          ? currentChar.StrModTemp
          : currentChar.StrMod

        modType = 'de mod de Força'
      }

      const exMod = Math.floor(wep?.str_bonus * mod)

      const dice = size === 'MÉDIO' ? wep?.dice_m : wep?.dice_s
      const multi = size === 'MÉDIO' ? wep?.multiplier_m : wep?.multiplier_s

      const name =
        wep?.nickname !== '' &&
        wep?.nickname !== undefined &&
        wep?.nickname !== null
          ? wep?.nickname
          : wep?.name

      const extraDamage = wep?.damage || 0

      const element =
        wep?.element > 0 ? Math.floor(Math.random() * wep?.element) + 1 : 0

      const dices = []

      const random = () => {
        return Math.floor(Math.random() * Number(dice)) + 1
      }

      // eslint-disable-next-line
      for (let i = 0; i < multi; i++) {
        dices.push(random())
      }

      let result = dices.reduce((a, b) => a + b, 0)

      const totalDamage =
        Number(result) + Number(extraDamage) + Number(exMod) + Number(element)

      const rolled = `CAUSOU DANO com ${name} => ${multi} x d${dice}: ${result} + ${exMod} ${modType} + ${extraDamage} de bônus da arma + ${element} bônus de elemento. Com resultado: ${totalDamage}`

      api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: totalDamage,
        type: 4,
      })
    } else {
      toast.error('Escolha por favor uma arma antes de realizar o dano.')
    }
  }

  async function handleCritDamage() {
    const wep = await weaponsToUse?.find((w: any) => w.id === weapon)
    const currentChar = selectedCharacter
      ? await loadCharacterData(selectedCharacter.id)
      : character
    const size = await currentChar?.Size
    const critMult = wep?.crit_mod > 0 ? wep?.crit_mod : wep?.critical

    let mod = 0
    let modType = ''

    if (wep?.dex_damage === true) {
      mod = (await currentChar?.DexModTemp)
        ? currentChar.DexModTemp
        : currentChar.DexMod

      modType = 'bônus de Destreza'
    } else {
      mod = (await currentChar?.StrModTemp)
        ? currentChar.StrModTemp
        : currentChar.StrMod

      modType = 'bônus de Força'
    }

    const exMod = Math.floor(wep?.str_bonus * mod)
    const extraDamage = wep?.damage || 0

    const name =
      wep?.nickname !== '' &&
      wep?.nickname !== undefined &&
      wep?.nickname !== null
        ? wep?.nickname
        : wep?.name

    const dice = size === 'MÉDIO' ? wep?.dice_m : wep?.dice_s
    const multi = size === 'MÉDIO' ? wep?.multiplier_m : wep?.multiplier_s

    const element =
      wep?.element > 0 ? Math.floor(Math.random() * wep?.element) + 1 : 0

    const dices = []

    const random = () => {
      return Math.floor(Math.random() * Number(dice)) + 1
    }

    // eslint-disable-next-line
    for (let i = 0; i < multi; i++) {
      dices.push(random())
    }

    let result = dices.reduce((a, b) => a + b, 0)

    const multCrit = multi * critMult
    const diceCrit = result * critMult
    const modCrit = exMod * critMult
    const extCrit = extraDamage * critMult

    const totalDamage =
      Number(diceCrit) + Number(modCrit) + Number(extCrit) + Number(element)

    const rolled = `CAUSOU DANO CRÍTICO com ${name} => ${multi} x d${dice}: ${result} x ${multCrit} CRIT: ${diceCrit} + ${modCrit} ${modType} + ${extCrit} de bônus da arma, + ${element} de bônus elemento. Com resultado: ${totalDamage}`

    if (!weapon) {
      toast.error('Escolha por favor uma arma antes de realizar o dano.')
    } else {
      api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: totalDamage,
        type: 4,
        isCrit: 'HIT',
      })
    }
  }

  // Função para carregar dados completos do personagem
  async function loadCharacterData(characterId: number) {
    try {
      const response = await api.get(`/combats/${profile.id}/${characterId}`)
      return response.data
    } catch (error) {
      return character // fallback para o character passado por props
    }
  }

  async function handleSubmit(data: any) {
    try {
      const weaponData = {
        weapon: data.weapon,
        hit: Number(data.hit),
        damage: Number(data.damage),
        element: Number(data.element),
        crit_mod: Number(data.crit_mod),
        crit_from_mod: Number(data.crit_from_mod),
        dex_damage: data.dex_damage === 'true',
        price: Number(data.price),
        nickname: data.nickname,
        description: data.description,
      }

      await api.post(`/characters/${data.character}/weapons`, weaponData)
      toast.success('Arma vinculada com sucesso!')
    } catch (error) {
      toast.error('Erro ao vincular arma ao personagem')
    }
  }

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
                characters={userCharacters.map(char => ({
                  value: char.id.toString(),
                  label: char.name,
                }))}
                changeCharacter={(characterId: string | null) => {
                  if (characterId) {
                    const char = userCharacters.find(
                      c => c.id.toString() === characterId
                    )
                    setSelectedCharacter(char || null)
                  } else {
                    setSelectedCharacter(null)
                  }
                }}
              />
            )}
          </Styles.WeaponContainer>
        )}

        {/* Seleção de arma */}
        <Styles.WeaponContainer>
          <label>Arma:</label>
          {!loadChar && userCharacters.length > 0 && (
            <>
              {loadingWeapons ? (
                <p>Carregando armas...</p>
              ) : weaponsToUse.length > 0 ? (
                <SelectWeapon
                  weapons={weaponsToUse as never[]}
                  changeWeapon={(e: any) => setWeapon(e?.value)}
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
