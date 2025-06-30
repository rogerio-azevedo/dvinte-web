/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import api from '../../services/api'

import CharClass from '../../components/CharClass'
import CharArmor from '../../components/CharArmor'
import CharWeapon from '../../components/CharWeapon'
import CharEquipment from '../../components/CharEquipment'
import CharCa from '../../components/CharCa'
import CharResist from '../../components/CharResist'

import * as Styles from './styles'

// Interfaces dos componentes filhos
interface CharacterClass {
  id: number
  name: string
  level: number
}

interface Armor {
  id: number
  type: number
  bonus: number
  defense: number
  dexterity: number
  name: string
  penalty: number
  displacement_m: number
  displacement_s: number
  weight: number
  price: number
}

interface Weapon {
  id: number
  name: string
  damage: string
  critical: string
  range: number
  type: string
  weight: number
}

interface Equipment {
  id: number
  name: string
  quantity: number
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
  weight: number
  price: number
  CharacterEquipment?: {
    id: number
    description: string
  }
}

interface Character {
  id: number
  Name: string
  User: string
  Race: string
  Alig: string
  Age: number
  Gender: string
  Size: string
  Divin: string
  Height: string
  Weight: string
  Eye: string
  Hair: string
  Skin: string
  Portrait: string
  Level: number
  Exp: number
  Health: number
  HealthNow: number
  BaseAttack: number
  Str: number
  StrMod: number
  StrTemp: number
  StrModTemp: number
  Dex: number
  DexMod: number
  DexTemp: number
  DexModTemp: number
  Con: number
  ConMod: number
  ConTemp: number
  ConModTemp: number
  Int: number
  IntMod: number
  IntTemp: number
  IntModTemp: number
  Wis: number
  WisMod: number
  WisTemp: number
  WisModTemp: number
  Cha: number
  ChaMod: number
  ChaTemp: number
  ChaModTemp: number
  Cod: number
  Classes: CharacterClass[]
  Armor: Armor[]
  Weapon: Weapon[]
  Equipment: Equipment[]
  Fortitude: number
  Reflex: number
  Will: number
}

interface Resistance {
  Fortitude: number
  Reflex: number
  Will: number
  ConMod: number
  DexMod: number
  WisMod: number
  ConModTemp?: number
  DexModTemp?: number
  WisModTemp?: number
}

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [char, setChar] = useState<Character>()
  const [classes, setClasses] = useState<CharacterClass[]>()
  const [armors, setArmors] = useState<Armor[]>()
  const [weapons, setWeapons] = useState<Weapon[]>()
  const [equipments, setEquipments] = useState<Equipment[]>()
  const [resist, setResist] = useState<Resistance>()
  const [strMod, setStrMod] = useState<number>()
  const [dexMod, setDexMod] = useState<number>()

  async function loadChar() {
    try {
      const response = await api.get<Character>(`characters/${id}`)
      const { data } = response

      const str = data.StrModTemp || data.StrMod
      const dex = data.DexModTemp || data.DexMod

      setStrMod(str)
      setDexMod(dex)
      setChar(data)
      setClasses(data.Classes)
      setArmors(data.Armor)
      setWeapons(data.Weapon)
      setEquipments(data.Equipment)
      setResist({
        Fortitude: data.Fortitude,
        Reflex: data.Reflex,
        Will: data.Will,
        ConMod: data.ConMod,
        DexMod: data.DexMod,
        WisMod: data.WisMod,
        ConModTemp: data.ConModTemp,
        DexModTemp: data.DexModTemp,
        WisModTemp: data.WisModTemp,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar personagem:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChar()
  }, [id])

  return (
    <Styles.Container $loading={loading}>
      <Styles.HeaderContainer>
        <legend>Dados Básicos</legend>
        <div>
          <Styles.Portrait>
            <img src={char?.Portrait} alt={char?.Name || ''} />
          </Styles.Portrait>

          <Styles.BaseContainer>
            <Styles.LineContaniner>
              <div>
                <Styles.InputLarge readOnly defaultValue={char?.Name} />
                <label htmlFor="CharName">Nome do Personagem</label>
              </div>

              <div>
                <Styles.InputLarge readOnly defaultValue={char?.User} />
                <label htmlFor="CharName">Nome do Jogador</label>
              </div>

              <div>
                <Styles.InputLarge readOnly defaultValue={char?.Race} />
                <label htmlFor="CharRace">Raça</label>
              </div>
              <div>
                <Styles.InputLarge readOnly defaultValue={char?.Alig} />
                <label htmlFor="CharAlignment">Tendência</label>
              </div>
            </Styles.LineContaniner>

            <Styles.LineContaniner>
              <div>
                <Styles.InputShort readOnly defaultValue={char?.Age} />
                <label htmlFor="CharAge">Idade</label>
              </div>

              <div>
                <Styles.InputMed readOnly defaultValue={char?.Gender} />
                <label htmlFor="CharGender">Sexo</label>
              </div>
              <div>
                <Styles.InputMed readOnly defaultValue={char?.Size} />
                <label htmlFor="CharSize">Tamanho</label>
              </div>
              <div>
                <Styles.InputLarge readOnly defaultValue={char?.Divin} />
                <label htmlFor="CharDivinity">Divindade</label>
              </div>
            </Styles.LineContaniner>

            <Styles.LineContaniner>
              <div>
                <Styles.InputShort defaultValue={char?.Height} />
                <label htmlFor="CharHeight">Altura</label>
              </div>
              <div>
                <Styles.InputShort readOnly defaultValue={char?.Weight} />
                <label htmlFor="CharWeight">Peso</label>
              </div>
              <div>
                <Styles.InputMed readOnly defaultValue={char?.Eye} />
                <label htmlFor="CharEye">Olhos</label>
              </div>
              <div>
                <Styles.InputMed readOnly defaultValue={char?.Hair} />
                <label htmlFor="CharHair">Cabelos</label>
              </div>
              <div>
                <Styles.InputMed readOnly defaultValue={char?.Skin} />
                <label htmlFor="CharSkin">Pele</label>
              </div>
            </Styles.LineContaniner>
          </Styles.BaseContainer>
        </div>
      </Styles.HeaderContainer>

      <Styles.StatsContainer>
        <Styles.AttributesContainer>
          <legend>Atributos</legend>
          <div>
            <Styles.AttrLabel1 readOnly defaultValue="FOR" />
            <div>
              <label htmlFor="inputResist">valor</label>
              <input readOnly defaultValue={char?.Str} />
            </div>
            <div>
              <label htmlFor="inputResist">mod</label>
              <input readOnly defaultValue={char?.StrMod} />
            </div>
            <div>
              <label htmlFor="inputResist">v.temp</label>
              <input readOnly defaultValue={char?.StrTemp} />
            </div>
            <div>
              <label htmlFor="inputResist">m.temp</label>
              <input readOnly defaultValue={char?.StrModTemp} />
            </div>
          </div>

          <div>
            <Styles.AttrLabel readOnly defaultValue="DES" />
            <div>
              <input readOnly defaultValue={char?.Dex} />
            </div>
            <div>
              <input readOnly defaultValue={char?.DexMod} />
            </div>
            <div>
              <input readOnly defaultValue={char?.DexTemp} />
            </div>
            <div>
              <input readOnly defaultValue={char?.DexModTemp} />
            </div>
          </div>

          <div>
            <Styles.AttrLabel readOnly defaultValue="CON" />
            <div>
              <input readOnly defaultValue={char?.Con} />
            </div>
            <div>
              <input readOnly defaultValue={char?.ConMod} />
            </div>
            <div>
              <input readOnly defaultValue={char?.ConTemp} />
            </div>
            <div>
              <input readOnly defaultValue={char?.ConModTemp} />
            </div>
          </div>

          <div>
            <Styles.AttrLabel readOnly defaultValue="INT" />
            <div>
              <input readOnly defaultValue={char?.Int} />
            </div>
            <div>
              <input readOnly defaultValue={char?.IntMod} />
            </div>
            <div>
              <input readOnly defaultValue={char?.IntTemp} />
            </div>
            <div>
              <input readOnly defaultValue={char?.IntModTemp} />
            </div>
          </div>

          <div>
            <Styles.AttrLabel readOnly defaultValue="SAB" />
            <div>
              <input readOnly defaultValue={char?.Wis} />
            </div>
            <div>
              <input readOnly defaultValue={char?.WisMod} />
            </div>
            <div>
              <input readOnly defaultValue={char?.WisTemp} />
            </div>
            <div>
              <input readOnly defaultValue={char?.WisModTemp} />
            </div>
          </div>

          <div>
            <Styles.AttrLabel readOnly defaultValue="CAR" />
            <div>
              <input readOnly defaultValue={char?.Cha} />
            </div>
            <div>
              <input readOnly defaultValue={char?.ChaMod} />
            </div>
            <div>
              <input readOnly defaultValue={char?.ChaTemp} />
            </div>
            <div>
              <input readOnly defaultValue={char?.ChaModTemp} />
            </div>
          </div>
        </Styles.AttributesContainer>

        <Styles.HealthClassContainer>
          <legend>Classes e Level</legend>
          <Styles.HealthContainer>
            <div>
              <div>
                <Styles.InputMini readOnly defaultValue={char?.Level} />
                <label htmlFor="CharLevel">Level</label>
              </div>
              <div>
                <Styles.InputMini readOnly defaultValue={char?.Exp} />
                <label htmlFor="charExp">Experiência</label>
              </div>
            </div>
            <div>
              <div>
                <Styles.InputMini readOnly defaultValue={char?.Health} />
                <label htmlFor="charHealth">PV</label>
              </div>
              <div>
                <Styles.InputMini readOnly defaultValue={char?.HealthNow} />
                <label htmlFor="charHealth">PV Atual</label>
              </div>
            </div>
            <div>
              <div>
                <Styles.InputMini
                  readOnly
                  defaultValue={
                    char?.BaseAttack && strMod ? char.BaseAttack + strMod : ''
                  }
                />
                <label htmlFor="CharLevel">Corpo a Corpo</label>
              </div>
              <div>
                <Styles.InputMini readOnly defaultValue={dexMod} />
                <label htmlFor="charExp">Iniciativa</label>
              </div>
            </div>
          </Styles.HealthContainer>

          <Styles.ClassContainer>
            {!loading && classes && <CharClass classes={classes} />}
          </Styles.ClassContainer>
        </Styles.HealthClassContainer>

        <Styles.ResistContainer>
          <legend>Testes de Resistência</legend>
          {!loading && resist && <CharResist resist={resist} />}
          <Styles.DefenseContainer>
            {!loading && armors && dexMod !== undefined && (
              <CharCa armors={armors} dextMod={dexMod} />
            )}
          </Styles.DefenseContainer>
        </Styles.ResistContainer>
      </Styles.StatsContainer>
      <Styles.ArmoryContainer>
        <Styles.ArmorContainer>
          <legend>Armaduras e Escudos</legend>
          {!loading && armors && char && (
            <CharArmor
              armors={armors}
              size={char.Size}
              char={char.Cod}
              onArmorRemoved={loadChar}
            />
          )}
        </Styles.ArmorContainer>
      </Styles.ArmoryContainer>
      <Styles.ArmoryContainer>
        <Styles.WeaponContainer>
          <legend>Armas</legend>
          {!loading && weapons && char && (
            <CharWeapon
              weapons={weapons}
              size={char.Size}
              char={char.Cod}
              onWeaponRemoved={loadChar}
            />
          )}
        </Styles.WeaponContainer>
      </Styles.ArmoryContainer>
      <Styles.ArmoryContainer>
        <Styles.EquipmentContainer>
          <legend>Equipamentos</legend>
          {!loading && equipments && char && (
            <CharEquipment
              equipments={equipments}
              char={char.Cod}
              onEquipmentRemoved={loadChar}
            />
          )}
        </Styles.EquipmentContainer>
      </Styles.ArmoryContainer>
    </Styles.Container>
  )
}
