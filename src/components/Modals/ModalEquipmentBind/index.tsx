/* eslint-disable no-console */

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

import api from '../../../services/api'

import SelectCharacter from '../../SelectCharacter'

import * as Styles from './styles'

interface Character {
  id: number
  name: string
}

interface ModalEquipmentBindProps {
  equipment: {
    id: number
    name: string
  }
}

interface FormData {
  character: string
  equipment: number
  description: string
}

const customStyles = {
  content: {
    width: '750px',
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

const ModalEquipmentBind: React.FC<ModalEquipmentBindProps> = ({
  equipment,
}) => {
  const { handleSubmit, register, setValue } = useForm<FormData>()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(equipment)
  const [characters, setCharacters] = useState<
    { value: string; label: string }[]
  >([])
  const [loadingCharacters, setLoadingCharacters] = useState(false)

  useEffect(() => {
    register('character')
    register('equipment', { value: selectedEquipment?.id })
  }, [register, selectedEquipment])

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
        const equipmentData = {
          equipment: data.equipment,
          description: data.description || '',
        }

        console.log('Sending equipment data:', equipmentData)
        await api.post(
          `/characters/${data.character}/equipments`,
          equipmentData
        )
        e?.target.reset()
        toast.success('Equipamento vinculado com sucesso!')
        setIsOpen(false)
      } catch (error) {
        console.error('Error saving equipment:', error)
        toast.error('Erro ao vincular equipamento ao personagem')
      }
    }
    saveData()
  }

  function openModal() {
    setIsOpen(true)
    setSelectedEquipment(equipment)
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
          <h2>Compra / Vinculação de Equipamento</h2>
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
              <label htmlFor="equipment">Cod</label>
              <Styles.WeaponShort readOnly value={selectedEquipment?.id} />
            </div>
            <div>
              <label htmlFor="equipment">Nome</label>
              <Styles.WeaponLarge
                readOnly
                value={selectedEquipment?.name.toUpperCase()}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
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

export default ModalEquipmentBind
