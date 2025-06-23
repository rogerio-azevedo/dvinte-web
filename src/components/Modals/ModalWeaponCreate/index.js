import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa/'
import { FaRegMoneyBillAlt } from 'react-icons/fa/'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Switch } from 'antd'

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

export default function ModalWeaponCreate({ weapon }) {
  const { handleSubmit, register, setValue } = useForm()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedWeapon, setSelectedWeapon] = useState()

  useEffect(() => {
    register({ name: 'character' })
    register({ name: 'dex_damage' })
  }, [register])

  const onSubmit = (data, e) => {
    async function saveData() {
      await api.post('characterweapons', data)
      e.target.reset()
      toast.success('Arma vinculada com sucesso!')
    }
    saveData()

    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    setSelectedWeapon(weapon)
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false)
  }

  function onChange(checked) {
    if (checked === true) {
      setValue('dex_damage', checked)
    } else {
      setValue('dex_damage', false)
    }
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
              <Styles.WeaponShort
                name="weapon"
                ref={register({ required: true })}
                readOnly
                value={selectedWeapon?.id}
              />
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
                name="price"
                defaultValue={0}
                ref={register({ required: true })}
              />
            </div>
            <div>
              <label htmlFor="nickname">Apelido</label>
              <Styles.WeaponLarge
                name="nickname"
                ref={register({ required: true })}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="weapon">Acerto Extra</label>
              <Styles.WeaponMed
                name="hit"
                type="number"
                maxLength={1}
                defaultValue={0}
                ref={register({ required: true, maxLength: 1 })}
              />
            </div>
            <div>
              <label htmlFor="weapon">Dano Extra</label>
              <Styles.WeaponMed
                name="damage"
                defaultValue={0}
                ref={register({ required: true })}
              />
            </div>

            <div>
              <label htmlFor="weapon">Elemento (dado)</label>
              <Styles.WeaponMed
                name="element"
                defaultValue={0}
                ref={register({ required: true })}
              />
            </div>

            <div>
              <label htmlFor="weapon">Dex (dano)</label>
              <div style={{ marginTop: '18px' }}>
                <Switch
                  name="dex_damage"
                  defaultChecked={false}
                  onChange={onChange}
                />
              </div>
            </div>
          </Styles.InputContainer>
          <Styles.InputContainer>
            <div>
              <label htmlFor="weapon">Crítico Mínimo</label>
              <Styles.WeaponMed
                name="crit_from_mod"
                defaultValue={0}
                ref={register({ required: true })}
              />
            </div>
            <div>
              <label htmlFor="weapon">Crit Multiplicador</label>
              <Styles.WeaponMed
                name="crit_mod"
                defaultValue={0}
                ref={register({ required: true })}
              />
            </div>
            <div>
              <label style={{ color: '#fff' }} htmlFor="weapon">
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
              <label htmlFor="weapon">Observação</label>
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
