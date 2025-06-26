/* eslint-disable no-console */

import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Select } from 'antd'

import api from '../../../services/api'

import * as Styles from './styles'

const { Option } = Select

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

interface FormData {
  name: string
  type: number
  bonus: number
  dexterity: number
  penalty: number
  magic: number
  displacement_s: number
  displacement_m: number
  weight: number
  price: number
  book: string
  version: string
}

interface ArmorProps {
  armor: {
    id: number
    name: string
    type: number
    bonus: number
    dexterity: number
    penalty: number
    magic: number
    displacement_s: number
    displacement_m: number
    weight: number
    price: number
    book: string
    version: string
  }
}

const ModalArmorCreate: React.FC<ArmorProps> = ({ armor }) => {
  const { handleSubmit, register, control } = useForm<FormData>()
  const [modalIsOpen, setIsOpen] = useState(false)

  const onSubmit = async (data: FormData, e: any) => {
    try {
      const armorData = {
        name: data.name,
        type: Number(data.type || 1),
        bonus: Number(data.bonus || 0),
        dexterity: Number(data.dexterity || 0),
        penalty: Number(data.penalty || 0),
        magic: Number(data.magic || 0),
        displacement_s: Number(data.displacement_s || 0),
        displacement_m: Number(data.displacement_m || 0),
        weight: Number(data.weight || 0),
        price: Number(data.price || 0),
        book: data.book || 'Livro do Jogador',
        version: data.version || 'V 3.5e',
      }

      await api.post('/armors', armorData)
      e?.target.reset()
      toast.success('Armadura criada com sucesso!')
      setIsOpen(false)
    } catch (error) {
      console.error('Error saving armor:', error)
      toast.error('Erro ao criar armadura')
    }
  }

  function openModal() {
    setIsOpen(true)
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
          <h2>Cadastro de Armadura</h2>
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
              <label htmlFor="name">Nome</label>
              <Styles.WeaponLarge
                {...register('name')}
                type="text"
                defaultValue=""
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="type">Tipo</label>
              <Controller
                control={control}
                name="type"
                defaultValue={1}
                render={({ field }) => (
                  <Select {...field} style={{ width: 120 }} placeholder="Tipo">
                    <Option value={1}>Armadura</Option>
                    <Option value={2}>Escudo</Option>
                    <Option value={3}>Natural</Option>
                    <Option value={5}>Outros</Option>
                  </Select>
                )}
              />
            </div>
            <div>
              <label htmlFor="bonus">Bônus</label>
              <Styles.WeaponMed
                {...register('bonus')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="dexterity">Destreza</label>
              <Styles.WeaponMed
                {...register('dexterity')}
                type="number"
                defaultValue={0}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="penalty">Penalidade</label>
              <Styles.WeaponMed
                {...register('penalty')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="magic">Mágica</label>
              <Styles.WeaponMed
                {...register('magic')}
                type="number"
                defaultValue={0}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="displacement_s">Desloc (P)</label>
              <Styles.WeaponMed
                {...register('displacement_s')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="displacement_m">Desloc (M)</label>
              <Styles.WeaponMed
                {...register('displacement_m')}
                type="number"
                defaultValue={0}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="weight">Peso</label>
              <Styles.WeaponMed
                {...register('weight')}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="price">Preço</label>
              <Styles.WeaponMed
                {...register('price')}
                type="number"
                defaultValue={0}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="book">Livro</label>
              <Styles.WeaponLarge
                {...register('book')}
                type="text"
                defaultValue="Livro do Jogador"
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="version">Versão</label>
              <Controller
                control={control}
                name="version"
                defaultValue="V 3.5e"
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: 120 }}
                    placeholder="Versão"
                  >
                    <Option value="V 1.0e">V 1.0e</Option>
                    <Option value="V 2.0e">V 2.0e</Option>
                    <Option value="V 3.0e">V 3.0e</Option>
                    <Option value="V 3.5e">V 3.5e</Option>
                    <Option value="V 4.0e">V 4.0e</Option>
                    <Option value="V 5.0e">V 5.0e</Option>
                  </Select>
                )}
              />
            </div>
          </Styles.InputContainer>

          <Styles.ButtonsContainer>
            <Styles.Button type="submit">Gravar</Styles.Button>
          </Styles.ButtonsContainer>
        </form>
      </Modal>
    </Styles.Container>
  )
}
export default ModalArmorCreate
