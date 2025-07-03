/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import Button from '../../components/Button'
import { FaPlusCircle } from 'react-icons/fa'

import api from '../../services/api'

import * as Styles from './styles'
import ModalArmorBind from '../../components/Modals/ModalArmorBind'

const { Option } = Select

interface ArmorFormData {
  name: string
  type: string
  bonus: string
  dexterity: string
  penalty: string
  magic: string
  displacement_s: string
  displacement_m: string
  weight: string
  price: string
  book: string
  version: string
}

interface ArmorProps {
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

const defaultValues: Partial<ArmorFormData> = {
  name: '',
  type: '',
  bonus: '',
  dexterity: '',
  penalty: '',
  magic: '',
  displacement_s: '',
  displacement_m: '',
  weight: '',
  price: '',
  book: '',
  version: '',
}

export default function Armor() {
  const { handleSubmit, register, reset, control } = useForm<ArmorFormData>({
    defaultValues,
  })
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ArmorProps[]>([])
  const [showform, setShowform] = useState<'hide' | 'show'>('hide')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const response = await api.get('/armors')
        setList(response.data || [])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar armaduras:', error)
        setList([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: ArmorFormData) => {
    try {
      setLoading(true)
      const response = await api.post('/armors', data)
      const newList = [response.data, ...list]
      setList(newList)
      reset(defaultValues)
      setShowform('hide')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar armadura:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<ArmorProps> = [
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      render: type => {
        switch (type) {
          case 1:
            return 'Armadura'
          case 2:
            return 'Escudo'
          case 3:
            return 'Natural'
          case 5:
            return 'Outros'
          default:
            return 'Desconhecido'
        }
      },
    },
    {
      title: 'Bônus',
      dataIndex: 'bonus',
      key: 'bonus',
    },
    {
      title: 'Destreza',
      dataIndex: 'dexterity',
      key: 'dexterity',
    },
    {
      title: 'Penalidade',
      dataIndex: 'penalty',
      key: 'penalty',
    },
    {
      title: 'Mágica',
      dataIndex: 'magic',
      key: 'magic',
    },
    {
      title: 'Desloc (P)',
      dataIndex: 'displacement_s',
      key: 'displacement_s',
    },
    {
      title: 'Desloc (M)',
      dataIndex: 'displacement_m',
      key: 'displacement_m',
    },
    {
      title: 'Peso',
      dataIndex: 'weight',
      render: (_, item) => `${item.weight} kg`,
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      render: (_, item) => `${item.price || 0} PO`,
    },
    {
      title: 'Livro',
      dataIndex: 'book',
      key: 'book',
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Comprar',
      dataIndex: 'buy',
      render: (_, item) => (
        <ModalArmorBind armor={{ id: String(item.id), name: item.name }} />
      ),
    },
  ]

  function handleAdd() {
    setShowform('show')
  }

  return (
    <Styles.Container>
      <Styles.ContentContainer>
        <Styles.HeaderContainer>
          <h1>Cadastro de Armaduras</h1>

          <FaPlusCircle
            color="#8e0e00"
            size={40}
            onClick={handleAdd}
            style={{ cursor: 'pointer' }}
          />
        </Styles.HeaderContainer>

        <Styles.FormContainer showform={showform}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Styles.InputContainer>
              <div>
                <label htmlFor="name">Nome</label>
                <Styles.InputLarge {...register('name', { required: true })} />
              </div>
              <div>
                <label htmlFor="type">Tipo</label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Styles.SelectFormated
                      {...field}
                      size="large"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Escolha o Tipo"
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        if (!input || !option?.children) return false
                        return (
                          String(option.children)
                            .toLowerCase()
                            .indexOf(String(input).toLowerCase()) >= 0
                        )
                      }}
                    >
                      <Option value="1">Armadura</Option>
                      <Option value="2">Escudo</Option>
                      <Option value="3">Natural</Option>
                      <Option value="5">Outros</Option>
                    </Styles.SelectFormated>
                  )}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="bonus">Bônus</label>
                <Styles.InputMed
                  type="number"
                  {...register('bonus', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="dexterity">Destreza</label>
                <Styles.InputMed
                  type="number"
                  {...register('dexterity', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="penalty">Penalidade</label>
                <Styles.InputMed
                  type="number"
                  {...register('penalty', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="magic">Mágica</label>
                <Styles.InputMed
                  type="number"
                  {...register('magic', { required: true })}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="displacement_s">Desloc (P)</label>
                <Styles.InputMed
                  type="number"
                  {...register('displacement_s', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="displacement_m">Desloc (M)</label>
                <Styles.InputMed
                  type="number"
                  {...register('displacement_m', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="weight">Peso</label>
                <Styles.InputMed
                  type="number"
                  step="0.1"
                  {...register('weight', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="price">Preço</label>
                <Styles.InputMed
                  type="number"
                  {...register('price', { required: true })}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="book">Livro</label>
                <Styles.InputLarge {...register('book', { required: true })} />
              </div>

              <div>
                <label htmlFor="version">Versão</label>
                <Controller
                  name="version"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Styles.SelectFormated
                      {...field}
                      size="large"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Escolha a Versão"
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        if (!input || !option?.children) return false
                        return (
                          String(option.children)
                            .toLowerCase()
                            .indexOf(String(input).toLowerCase()) >= 0
                        )
                      }}
                    >
                      <Option value="V 1.0e">Versão 1.0e</Option>
                      <Option value="V 2.0e">Versão 2.0e</Option>
                      <Option value="V 3.0e">Versão 3.0e</Option>
                      <Option value="V 3.5e">Versão 3.5e</Option>
                      <Option value="V 4.0e">Versão 4.0e</Option>
                      <Option value="V 5.0e">Versão 5.0e</Option>
                    </Styles.SelectFormated>
                  )}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <Button type="submit" TextButton="Gravar" />
            </Styles.InputContainer>
          </form>
        </Styles.FormContainer>

        <Styles.TableContainer>
          <Styles.MyTable
            rowKey="id"
            dataSource={list}
            columns={columns as any}
            loading={loading}
            pagination={{ pageSize: 15 }}
            size="small"
          />
        </Styles.TableContainer>
      </Styles.ContentContainer>
    </Styles.Container>
  )
}
