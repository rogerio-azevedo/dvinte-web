import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import Button from '../../components/Button'
import { FaPlusCircle } from 'react-icons/fa'

import api from '../../services/api'

import * as Styles from './styles'
import ModalWeaponBind from '../../components/Modals/ModalWeaponBind'

const { Option } = Select

interface WeaponFormData {
  name: string
  dice_s: string
  dice_m: string
  multiplier_s: string
  multiplier_m: string
  critical: string
  crit_from: string
  range: string
  price: string
  weight: string
  type: string
  material: string
  book: string
  version: string
  str_bonus: string
}

interface WeaponProps {
  id: number
  name: string
  dice_s: number
  dice_m: number
  multiplier_s: number
  multiplier_m: number
  critical: number
  crit_from: number
  range: number
  price: number
  weight: number
  type: string
  material: string
  book: string
  version: string
  str_bonus: number
}

const defaultValues: Partial<WeaponFormData> = {
  name: '',
  dice_s: '',
  dice_m: '',
  multiplier_s: '',
  multiplier_m: '',
  critical: '',
  crit_from: '',
  range: '',
  price: '',
  weight: '',
  type: '',
  material: '',
  book: '',
  version: '',
  str_bonus: '',
}

export default function Weapon() {
  const { handleSubmit, register, reset, control } = useForm<WeaponFormData>({
    defaultValues,
  })
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<WeaponProps[]>([])
  const [showform, setShowform] = useState<'hide' | 'show'>('hide')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const response = await api.get('/weapons')
        setList(response.data || [])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar armas:', error)
        setList([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: WeaponFormData) => {
    try {
      setLoading(true)
      const response = await api.post('/weapons', data)
      const newList = [response.data, ...list]
      setList(newList)
      reset(defaultValues)
      setShowform('hide')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar arma:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<WeaponProps> = [
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
      title: 'Dano (P)',
      dataIndex: 'dice_s',
      render: (_, item) => `${item.multiplier_s}d${item.dice_s}`,
    },
    {
      title: 'Dano (M)',
      dataIndex: 'dice_m',
      render: (_, item) => `${item.multiplier_m}d${item.dice_m}`,
    },
    {
      title: 'Crítico',
      dataIndex: 'critical',
      render: (_, item) => `${item.crit_from}-20/x${item.critical}`,
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      render: (_, item) => `${item.price || 0} PO`,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Alcance',
      dataIndex: 'range',
      render: (_, item) => `${item.range} m`,
    },
    {
      title: 'Peso',
      dataIndex: 'weight',
      render: (_, item) => `${item.weight} kg`,
    },
    {
      title: 'Força',
      dataIndex: 'str_bonus',
      key: 'str_bonus',
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
        <ModalWeaponBind weapon={{ ...item, id: String(item.id) }} />
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
          <h1>Cadastro de Armas</h1>

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
                <label htmlFor="dice_s">Dano (dado) (P)</label>
                <Styles.InputMed
                  type="number"
                  {...register('dice_s', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="multiplier_s">Qtde Dados (P)</label>
                <Styles.InputMed
                  type="number"
                  {...register('multiplier_s', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="dice_m">Dano (dado) (M)</label>
                <Styles.InputMed
                  type="number"
                  {...register('dice_m', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="multiplier_m">Qtde Dados (M)</label>
                <Styles.InputMed
                  type="number"
                  {...register('multiplier_m', { required: true })}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="crit_from">Crítico Mínimo</label>
                <Styles.InputMed
                  type="number"
                  {...register('crit_from', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="critical">Crítico Multiplicador</label>
                <Styles.InputMed
                  type="number"
                  {...register('critical', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="range">Alcance</label>
                <Styles.InputMed
                  type="number"
                  step="0.1"
                  {...register('range', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="price">Preço</label>
                <Styles.InputMed
                  type="number"
                  {...register('price', { required: true })}
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
              <Styles.SelectContainer>
                <label htmlFor="type">Tipo</label>
                <section>
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
                        <Option value="CONCUSSÃO">CONCUSSÃO</Option>
                        <Option value="CORTANTE">CORTANTE</Option>
                        <Option value="PERFURANTE">PERFURANTE</Option>
                      </Styles.SelectFormated>
                    )}
                  />
                </section>
              </Styles.SelectContainer>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="material">Material</label>
                <Styles.InputLarge
                  {...register('material', { required: true })}
                />
              </div>

              <div>
                <label htmlFor="book">Livro</label>
                <Styles.InputLarge {...register('book', { required: true })} />
              </div>

              <Styles.SelectContainer>
                <label htmlFor="version">Versão</label>
                <section>
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
                </section>
              </Styles.SelectContainer>

              <Styles.SelectContainer>
                <label htmlFor="str_bonus">Bônus de Força</label>
                <section>
                  <Controller
                    name="str_bonus"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Styles.SelectFormated
                        {...field}
                        size="large"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Escolha o Bônus"
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
                        <Option value="0">Sem bônus de Força</Option>
                        <Option value="0.5">Bônus de 0.5 a Força</Option>
                        <Option value="1">Bônus de 1x a Força</Option>
                        <Option value="1.5">Bônus de 1.5x a Força</Option>
                        <Option value="2">Bônus de 2x a Força</Option>
                        <Option value="2.5">Bônus de 2.5x a Força</Option>
                        <Option value="3">Bônus de 3x a Força</Option>
                      </Styles.SelectFormated>
                    )}
                  />
                </section>
              </Styles.SelectContainer>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <Button type="submit" TextButton="Gravar" />
            </Styles.InputContainer>
          </form>

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
        </Styles.FormContainer>
      </Styles.ContentContainer>
    </Styles.Container>
  )
}
