/* eslint-disable no-console */

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Switch } from 'antd'

import api from '../../../services/api'

import SelectCharacter from '../../../components/SelectCharacter'

import * as Styles from './styles'

interface Character {
  id: number
  name: string
}

interface ModalWeaponCreateProps {
  weapon: {
    id: string
    name: string
  }
}

interface FormData {
  character: string
  dex_damage: boolean
  weapon: string
  price: number
  nickname: string
  hit: number
  damage: number
  element: number
  crit_from_mod: number
  crit_mod: number
  description: string
}

const customStyles = {
  content: {
    width: '550px',
    height: '550px',
    top: '45%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

Modal.setAppElement('#root')

const ModalWeaponCreate: React.FC<ModalWeaponCreateProps> = ({ weapon }) => {
  const { handleSubmit, register, setValue } = useForm<FormData>()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedWeapon, setSelectedWeapon] = useState(weapon)
  const [characters, setCharacters] = useState<
    { value: string; label: string }[]
  >([])
  const [loadingCharacters, setLoadingCharacters] = useState(false)

  useEffect(() => {
    register('character')
    register('dex_damage', { value: false })
    register('weapon', { value: selectedWeapon?.id })
  }, [register, selectedWeapon])

  async function loadCharacters() {
    try {
      setLoadingCharacters(true)
      const response = await api.get('/characters')
      const charactersData = response.data || []

      const characterOptions = charactersData.map((char: Character) => ({
        value: char.id.toString(),
        label: char.name,
      }))

      setCharacters(characterOptions)
    } catch (error) {
      toast.error('Erro ao carregar personagens')
    } finally {
      setLoadingCharacters(false)
    }
  }

  const onSubmit: SubmitHandler<FormData> = (data, e) => {
    async function saveData() {
      try {
        const weaponData = {
          weapon: data.weapon,
          hit: Number(data.hit || 0),
          damage: Number(data.damage || 0),
          element: Number(data.element || 0),
          crit_mod: Number(data.crit_mod || 0),
          crit_from_mod: Number(data.crit_from_mod || 0),
          dex_damage: Boolean(data.dex_damage),
          price: Number(data.price || 0),
          nickname: data.nickname || '',
          description: data.description || '',
        }

        console.log('Sending weapon data:', weaponData)
        await api.post(`/characters/${data.character}/weapons`, weaponData)
        e?.target.reset()
        toast.success('Arma vinculada com sucesso!')
        setIsOpen(false)
      } catch (error) {
        console.error('Error saving weapon:', error)
        toast.error('Erro ao vincular arma ao personagem')
      }
    }
    saveData()
  }

  function openModal() {
    setIsOpen(true)
    setSelectedWeapon(weapon)
    loadCharacters()
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Styles.Container>
      <FaRegMoneyBillAlt
        size={25}
        color="#8e0e00"
        cursor="pointer"
        onClick={openModal}
      />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Styles.HeaderContainer>
          <h2>Cadastro de Arma</h2>
          <FaTimes
            onClick={closeModal}
            color="red"
            size={20}
            cursor="pointer"
          />
        </Styles.HeaderContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styles.InputContainer>
            <div>
              <label htmlFor="weapon">Cod</label>
              <Styles.WeaponShort readOnly value={selectedWeapon?.id} />
            </div>
            <div>
              <label htmlFor="weapon">Nome</label>
              <Styles.WeaponLarge
                readOnly
                value={selectedWeapon?.name.toUpperCase()}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="price">Preço</label>
              <Styles.WeaponMed
                {...register('price')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="nickname">Apelido</label>
              <Styles.WeaponLarge {...register('nickname')} defaultValue="" />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="hit">Acerto Extra</label>
              <Styles.WeaponMed
                {...register('hit')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="damage">Dano Extra</label>
              <Styles.WeaponMed
                {...register('damage')}
                type="number"
                defaultValue={0}
              />
            </div>

            <div>
              <label htmlFor="element">Elemento (dado)</label>
              <Styles.WeaponMed
                {...register('element')}
                type="number"
                defaultValue={0}
              />
            </div>

            <div>
              <label htmlFor="dex_damage">Dex (dano)</label>
              <div style={{ marginTop: '18px' }}>
                <Switch
                  defaultChecked={false}
                  onChange={checked => setValue('dex_damage', checked)}
                />
              </div>
            </div>
          </Styles.InputContainer>
          <Styles.InputContainer>
            <div>
              <label htmlFor="crit_from_mod">Crítico Mínimo</label>
              <Styles.WeaponMed
                {...register('crit_from_mod')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="crit_mod">Crit Multiplicador</label>
              <Styles.WeaponMed
                {...register('crit_mod')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label style={{ color: '#fff' }} htmlFor="character">
                .
              </label>
              <SelectCharacter
                characters={characters}
                changeCharacter={e => setValue('character', e)}
              />
            </div>
          </Styles.InputContainer>

          <Styles.ButtonsContainer>
            <div>
              <label htmlFor="description">Observação</label>
              <Styles.WeaponExtLarge
                {...register('description')}
                defaultValue=""
              />
            </div>
            <Styles.Button type="submit">Vincular</Styles.Button>
          </Styles.ButtonsContainer>
        </form>
      </Modal>
    </Styles.Container>
  )
}

export default ModalWeaponCreate
