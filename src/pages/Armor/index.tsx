import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Select } from 'antd'
import { SubmitHandler } from 'react-hook-form'

import Button from '../../components/Button'
import { FaPlusCircle } from 'react-icons/fa'
import ModalArmorCreate from '../../components/Modals/ModalArmorCreate'

import api from '../../services/api'

import * as Styles from './styles'

const { Option } = Select

interface ArmorData {
  id: number
  name: string
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
  type: string
}

export default function Armor() {
  const { handleSubmit, register, reset, control } = useForm<ArmorData>()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ArmorData[]>([])
  const [showform, setShowform] = useState('hide')

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const response = await api.get('armors')

      setList(response.data)
      setLoading(false)
    }

    loadData()
  }, [])

  const onSubmit: SubmitHandler<ArmorData> = data => {
    async function saveData() {
      setLoading(true)

      const weapons = await api.post('armors', data)

      const newList = [weapons.data, ...list]

      setList(newList)
      setLoading(false)

      reset()
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
      render: (_: any, item: any) => item.name.toUpperCase(),
    },
    {
      title: 'Bônus',
      dataIndex: 'bonus',
      render: (_: any, item: any) => `${item.bonus} CA`,
    },
    {
      title: 'Dex Maxima',
      dataIndex: 'dexterity',
      render: (_: any, item: any) => `${item.dexterity}`,
    },
    {
      title: 'Penalidade',
      dataIndex: 'penalty',
      render: (_: any, item: any) => `${item.penalty}`,
    },
    {
      title: 'Magia',
      dataIndex: 'magic',
      render: (_: any, item: any) => `${item.magic}%`,
    },
    {
      title: 'Desloc(P)',
      dataIndex: 'displacement_s',
      render: (_: any, item: any) => `${item.displacement_s} m`,
    },
    {
      title: 'Desloc(M)',
      dataIndex: 'displacement_m',
      render: (_: any, item: any) => `${item.displacement_m} m`,
    },
    {
      title: 'Peso',
      dataIndex: 'weight',
      render: (_: any, item: any) => `${item.weight} kg`,
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      render: (_: any, item: any) => `${item.price} PO`,
    },
    {
      title: 'Livro',
      dataIndex: 'book',
      render: (_: any, item: any) => `${item.book}`,
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      render: (_: any, item: any) => `${item.version}`,
    },
    {
      title: 'Comprar',
      dataIndex: 'buy',
      render: (_: any, item: any) => <ModalArmorCreate armor={item} />,
    },
  ]

  function handleAdd() {
    setShowform('show')
  }

  return (
    <Styles.Container>
      <Styles.ContentContainer>
        <Styles.HeaderContainer>
          <h1>Cadastro de Armaduras e Escudos</h1>

          <FaPlusCircle
            color="#8e0e00"
            size={40}
            onClick={handleAdd}
            cursor={'pointer'}
          />
        </Styles.HeaderContainer>

        <Styles.FormContainer showform={showform}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Styles.InputContainer loading={loading ? 1 : 0}>
              <div>
                <label htmlFor="character">Tipo</label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Escolha o Tipo"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        typeof option?.children === 'string' &&
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="ARMADURA">ARMADURA</Option>
                      <Option value="ESCUDO">ESCUDO</Option>
                      <Option value="NATURAL">NATURAL</Option>
                      <Option value="DEFLEXÃO">DEFLEXÃO</Option>
                      <Option value="OUTRO">OUTRO</Option>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label htmlFor="character">Nome</label>
                <Styles.InputLarge {...register('name', { required: true })} />
              </div>
              <div>
                <label htmlFor="character">Bonus</label>
                <Styles.InputMed {...register('bonus', { required: true })} />
              </div>
              <div>
                <label htmlFor="character">Dex Maxima</label>
                <Styles.InputMed
                  {...register('dexterity', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Penalidade</label>
                <Styles.InputMed {...register('penalty', { required: true })} />
              </div>
              <div>
                <label htmlFor="character">Magia</label>
                <Styles.InputMed {...register('magic', { required: true })} />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer loading={loading ? 1 : 0}>
              <div>
                <label htmlFor="character">Desloc (P)</label>
                <Styles.InputMed
                  {...register('displacement_s', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Desloc (M)</label>
                <Styles.InputMed
                  {...register('displacement_m', { required: true })}
                />
              </div>
              <div>
                <label htmlFor="character">Peso</label>
                <Styles.InputMed {...register('weight', { required: true })} />
              </div>
              <div>
                <label htmlFor="character">Preço</label>
                <Styles.InputMed {...register('price', { required: true })} />
              </div>
              <div>
                <label htmlFor="character">Livro</label>
                <Styles.InputLarge {...register('book', { required: true })} />
              </div>

              <div>
                <label htmlFor="character">Versão</label>
                <Controller
                  control={control}
                  name="version"
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      style={{ width: 180 }}
                      placeholder="Escolha a Versão"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        typeof option?.children === 'string' &&
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
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

            <Styles.InputContainer loading={loading ? 1 : 0}>
              <Button type="submit" TextButton="Gravar" />
            </Styles.InputContainer>
          </form>
          <Styles.TableContainer>
            <Styles.MyTable
              rowKey="id"
              dataSource={list}
              columns={columns}
              pagination={{ pageSize: 15 }}
            />
          </Styles.TableContainer>
        </Styles.FormContainer>
      </Styles.ContentContainer>
    </Styles.Container>
  )
}
