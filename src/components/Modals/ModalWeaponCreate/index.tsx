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

  useEffect(() => {
    register('character')
    register('dex_damage')
  }, [register])

  const onSubmit: SubmitHandler<FormData> = (data, e) => {
    async function saveData() {
      await api.post('characterweapons', data)
      e?.target.reset()
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

  function onChange(checked: boolean) {
    setValue('dex_damage', checked)
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
                {...register('weapon', { required: true })}
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
                {...register('price', { required: true })}
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="nickname">Apelido</label>
              <Styles.WeaponLarge
                {...register('nickname', { required: true })}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="weapon">Acerto Extra</label>
              <Styles.WeaponMed
                {...register('hit', { required: true, maxLength: 1 })}
                type="number"
                maxLength={1}
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="weapon">Dano Extra</label>
              <Styles.WeaponMed
                {...register('damage', { required: true })}
                defaultValue={0}
              />
            </div>

            <div>
              <label htmlFor="weapon">Elemento (dado)</label>
              <Styles.WeaponMed
                {...register('element', { required: true })}
                defaultValue={0}
              />
            </div>

            <div>
              <label htmlFor="weapon">Dex (dano)</label>
              <div style={{ marginTop: '18px' }}>
                <Switch defaultChecked={false} onChange={onChange} />
              </div>
            </div>
          </Styles.InputContainer>
          <Styles.InputContainer>
            <div>
              <label htmlFor="weapon">Crítico Mínimo</label>
              <Styles.WeaponMed
                {...register('crit_from_mod', { required: true })}
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="weapon">Crit Multiplicador</label>
              <Styles.WeaponMed
                {...register('crit_mod', { required: true })}
                defaultValue={0}
              />
            </div>
            <div>
              <label style={{ color: '#fff' }} htmlFor="weapon">
                .
              </label>
              <SelectCharacter
                changeCharacter={e => setValue('character', e)}
              />
            </div>
          </Styles.InputContainer>

          <Styles.ButtonsContainer>
            <div>
              <label htmlFor="weapon">Observação</label>
              <Styles.WeaponExtLarge
                {...register('description', { required: true })}
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
