import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa/'
import { FaRegMoneyBillAlt } from 'react-icons/fa/'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import api from '../../../services/api'

import SelectCharacter from '../../../components/SelectCharacter'

import * as Styles from './styles'

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

export default function ModalEquipmentCreate({ equipment }) {
  const { handleSubmit, register, setValue } = useForm()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState()

  useEffect(() => {
    register({ name: 'character' })
  }, [register])

  const onSubmit = (data, e) => {
    async function saveData() {
      await api.post('characterequipments', data)
      e.target.reset()
      toast.success('Equipamento vinculado com sucesso!')
    }
    saveData()

    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    setSelectedEquipment(equipment)
    //setValue('cod', selectedWeapon?.id)
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
          <h2>Cadastro de Equipamento</h2>
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
              <Styles.WeaponShort
                name="equipment"
                ref={register({ required: true })}
                readOnly
                value={selectedEquipment?.id}
              />
            </div>
            <div>
              <label htmlFor="weapon">Nome</label>
              <Styles.WeaponLarge
                readOnly
                value={selectedEquipment?.name.toUpperCase()}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label style={{ color: '#fff' }} htmlFor="equipment">
                .
              </label>
              <SelectCharacter
                name="character"
                changeCharacter={e => setValue('character', e?.value)}
              />
            </div>
          </Styles.InputContainer>

          <Styles.ButtonsContainer>
            <div>
              <label htmlFor="equipment">Observação</label>
              <Styles.WeaponExtLarge
                type="text"
                name="description"
                ref={register({ required: true })}
              />
            </div>
            <Styles.Button type="submit">Vincular</Styles.Button>
          </Styles.ButtonsContainer>
        </form>
      </Modal>
    </Styles.Container>
  )
}
