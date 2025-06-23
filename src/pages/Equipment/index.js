import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Select } from 'antd'

import Button from '../../components/Button'
import { FaPlusCircle } from 'react-icons/fa'
import ModalEquipmentCreate from '../../components/Modals/ModalEquipmentCreate'

import api from '../../services/api'

import * as Styles from './styles'

const defaultValues = {
  Select: '',
  switch: false,
}

const { Option } = Select

export default function Equipment() {
  const { handleSubmit, register, reset, control } = useForm({ defaultValues })
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [showform, setShowform] = useState('hide')

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const response = await api.get('equipments')

      setList(response.data)
      setLoading(false)
    }

    loadData()
  }, [])

  const onSubmit = data => {
    async function saveData() {
      setLoading(true)

      const equipments = await api.post('equipments', data)

      const newList = [equipments.data, ...list]

      setList(newList)
      setLoading(false)

      reset(defaultValues)
      setShowform('hide')
    }
    saveData()
  }

  const columns = [
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Força',
      dataIndex: 'str_temp',
      key: 'str_temp',
    },
    {
      title: 'Destreza',
      dataIndex: 'dex_temp',
      key: 'dex_temp',
    },
    {
      title: 'Constituição',
      dataIndex: 'con_temp',
      key: 'con_temp',
    },
    {
      title: 'Inteligência',
      dataIndex: 'int_temp',
      key: 'int_temp',
    },
    {
      title: 'Sabedoria',
      dataIndex: 'wis_temp',
      key: 'wis_temp',
    },
    {
      title: 'Carisma',
      dataIndex: 'cha_temp',
      key: 'cha_temp',
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      render: (text, item) => `${item.price} PO`,
    },

    {
      title: 'Peso',
      dataIndex: 'weight',
      render: (text, item) => `${item.weight} kg`,
    },

    {
      title: 'Livro',
      dataIndex: 'book',
      render: (text, item) => `${item.book}`,
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      render: (text, item) => `${item.version}`,
    },
    {
      title: 'Comprar',
      dataIndex: 'buy',
      render: (text, item) => <ModalEquipmentCreate equipment={item} />,
    },
  ]

  function handleAdd() {
    setShowform('show')
  }

  return (
    <Styles.Container>
      <Styles.ContentContainer>
        <Styles.HeaderContainer>
          <h1>Cadastro de Equipamentos</h1>

          <FaPlusCircle
            color="#8e0e00"
            size={40}
            onClick={handleAdd}
            cursor={'pointer'}
          />
        </Styles.HeaderContainer>

        <Styles.FormContainer showform={showform}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Styles.InputContainer>
              <div>
                <label htmlFor="character">Nome</label>
                <Styles.InputLarge
                  name="name"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Força</label>
                <Styles.InputShort
                  name="str_temp"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Destreza</label>
                <Styles.InputShort
                  name="dex_temp"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Constituição</label>
                <Styles.InputShort
                  name="con_temp"
                  ref={register({ required: true })}
                />
              </div>

              <div>
                <label htmlFor="character">Inteligência</label>
                <Styles.InputShort
                  name="int_temp"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Sabedoria</label>
                <Styles.InputShort
                  name="wis_temp"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Carisma</label>
                <Styles.InputShort
                  name="cha_temp"
                  ref={register({ required: true })}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="character">Preço</label>
                <Styles.InputMed
                  name="price"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Peso</label>
                <Styles.InputMed
                  name="weight"
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Livro</label>
                <Styles.InputLarge
                  name="book"
                  ref={register({ required: true })}
                />
              </div>
              <Styles.SelectContainer>
                <label htmlFor="character">Versão</label>
                <section>
                  <Controller
                    as={
                      <Styles.SelectFormated
                        size={'large'}
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Escolha a Versão"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="V 1.0e">Versão 1.0e</Option>
                        <Option value="V 2.0e">Versão 2.0e</Option>
                        <Option value="V 3.0e">Versão 3.0e</Option>
                        <Option value="V 3.5e">Versão 3.5e</Option>
                        <Option value="V 4.0e">Versão 4.0e</Option>
                        <Option value="V 5.0e">Versão 5.0e</Option>
                      </Styles.SelectFormated>
                    }
                    name="version"
                    control={control}
                  />
                </section>
              </Styles.SelectContainer>
            </Styles.InputContainer>

            <Styles.InputContainer loading={loading ? 1 : 0}>
              <Button type="submit" TextButton="Gravar" />
            </Styles.InputContainer>
          </form>
          <Styles.TableContainer>
            <Styles.MyTable
              rowKey="id"
              dataSource={list}
              columns={columns}
              pagination={{ pageSize: 25 }}
            />
          </Styles.TableContainer>
        </Styles.FormContainer>
      </Styles.ContentContainer>
    </Styles.Container>
  )
}
