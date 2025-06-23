import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'

import CharClass from '../../components/CharClass'
import CharArmor from '../../components/CharArmor'
import CharWeapon from '../../components/CharWeapon'
import CharEquipment from '../../components/CharEquipment'
import CharCa from '../../components/CharCa'
import CharResist from '../../components/CharResist'

import * as Styles from './styles'

export default function CharacterDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [char, setChar] = useState()
  const [classes, setClasses] = useState()
  const [armors, setArmors] = useState()
  const [weapons, setWeapons] = useState()
  const [equipments, setEquipments] = useState()
  const [resist, setResist] = useState()
  const [strMod, setStrMod] = useState()
  const [dexMod, setDexMod] = useState()

  useEffect(() => {
    async function loadChar() {
      const response = await api.get(`characters/${id}`)
      const { data } = response

      const str = data.StrModTemp ? data.StrModTemp : data.StrMod
      const dex = data.DexModTemp ? data.DexModTemp : data.DexMod

      setStrMod(str)
      setDexMod(dex)
      setChar(data)
      setClasses(response.data.Classes)
      setArmors(response.data.Armor)
      setWeapons(response.data.Weapon)
      setEquipments(response.data.Equipment)
      setResist(response.data)
      setLoading(false)
    }

    loadChar()
  }, [id])

  return (
    <Styles.Container loading={loading ? 1 : 0}>
      <Styles.HeaderContainer>
        <legend>Dados Básicos</legend>
        <div>
          <Styles.Portrait>
            <img src={char && char.Portrait} alt="" />
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
                  defaultValue={char && char?.BaseAttack + strMod}
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
            {!loading && <CharClass classes={classes} />}
          </Styles.ClassContainer>
        </Styles.HealthClassContainer>

        <Styles.ResistContainer>
          <legend>Testes de Resistência</legend>
          {!loading && <CharResist resist={resist} />}
          <Styles.DefenseContainer>
            {!loading && <CharCa armors={armors} dextMod={dexMod} />}
          </Styles.DefenseContainer>
        </Styles.ResistContainer>
      </Styles.StatsContainer>
      <Styles.ArmoryContainer>
        <Styles.ArmorContainer>
          <legend>Armaduras e Escudos</legend>
          {!loading && (
            <CharArmor armors={armors} size={char?.Size} char={char?.Cod} />
          )}
        </Styles.ArmorContainer>
      </Styles.ArmoryContainer>
      <Styles.ArmoryContainer>
        <Styles.WeaponContainer>
          <legend>Armas</legend>
          {!loading && (
            <CharWeapon weapons={weapons} size={char?.Size} char={char?.Cod} />
          )}
        </Styles.WeaponContainer>
      </Styles.ArmoryContainer>
      <Styles.ArmoryContainer>
        <Styles.EquipmentContainer>
          <legend>Equipamentos</legend>
          {!loading && (
            <CharEquipment equipments={equipments} char={char?.Cod} />
          )}
        </Styles.EquipmentContainer>
      </Styles.ArmoryContainer>
    </Styles.Container>
  )
}
