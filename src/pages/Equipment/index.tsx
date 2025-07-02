/* eslint-disable no-console */

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Select } from "antd"
import type { ColumnsType } from "antd/es/table"

import Button from "../../components/Button"
import { FaPlusCircle } from "react-icons/fa"
import ModalEquipmentBind from "../../components/Modals/ModalEquipmentBind"

import api from "../../services/api"

import * as Styles from "./styles"

interface FormData {
  name: string
  str_temp: string
  dex_temp: string
  con_temp: string
  int_temp: string
  wis_temp: string
  cha_temp: string
  price: string
  weight: string
  book: string
  version: string
}

interface Equipment {
  id: number
  name: string
  str_temp: string
  dex_temp: string
  con_temp: string
  int_temp: string
  wis_temp: string
  cha_temp: string
  price: number
  weight: number
  book: string
  version: string
}

const { Option } = Select

export default function Equipment() {
  const { handleSubmit, register, reset, control } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Equipment[]>([])
  const [showform, setShowform] = useState("hide")

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const response = await api.get("equipments")
        const equipments = (response.data || []).map((item: any) => ({
          ...item,
          id: String(item.id),
        }))
        setList(equipments)
      } catch (error) {
        console.error("Erro ao carregar equipamentos:", error)
        setList([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const response = await api.post("equipments", data)
      const newEquipment = {
        ...response.data,
        id: String(response.data.id),
      }
      const newList = [newEquipment, ...list]
      setList(newList)
      reset()
      setShowform("hide")
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<Equipment> = [
    {
      title: "Cod",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Força",
      dataIndex: "str_temp",
      key: "str_temp",
    },
    {
      title: "Destreza",
      dataIndex: "dex_temp",
      key: "dex_temp",
    },
    {
      title: "Constituição",
      dataIndex: "con_temp",
      key: "con_temp",
    },
    {
      title: "Inteligência",
      dataIndex: "int_temp",
      key: "int_temp",
    },
    {
      title: "Sabedoria",
      dataIndex: "wis_temp",
      key: "wis_temp",
    },
    {
      title: "Carisma",
      dataIndex: "cha_temp",
      key: "cha_temp",
    },
    {
      title: "Preço",
      dataIndex: "price",
      render: (text, item) => `${item.price} PO`,
    },

    {
      title: "Peso",
      dataIndex: "weight",
      render: (text, item) => `${item.weight} kg`,
    },

    {
      title: "Livro",
      dataIndex: "book",
      render: (text, item) => `${item.book}`,
    },
    {
      title: "Versão",
      dataIndex: "version",
      render: (text, item) => `${item.version}`,
    },
    {
      title: "Comprar",
      dataIndex: "buy",
      render: (text, item) => <ModalEquipmentBind equipment={item} />,
    },
  ]

  function handleAdd() {
    setShowform("show")
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
            cursor={"pointer"}
          />
        </Styles.HeaderContainer>

        <Styles.FormContainer showform={showform}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Styles.InputContainer>
              <div>
                <label htmlFor="name">Nome</label>
                <Styles.InputLarge {...register("name", { required: true })} />
              </div>
              <div>
                <label htmlFor="str_temp">Força</label>
                <Styles.InputShort
                  {...register("str_temp", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="dex_temp">Destreza</label>
                <Styles.InputShort
                  {...register("dex_temp", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="con_temp">Constituição</label>
                <Styles.InputShort
                  {...register("con_temp", { required: true })}
                />
              </div>

              <div>
                <label htmlFor="int_temp">Inteligência</label>
                <Styles.InputShort
                  {...register("int_temp", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="wis_temp">Sabedoria</label>
                <Styles.InputShort
                  {...register("wis_temp", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="cha_temp">Carisma</label>
                <Styles.InputShort
                  {...register("cha_temp", { required: true })}
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="price">Preço</label>
                <Styles.InputMed {...register("price", { required: true })} />
              </div>
              <div>
                <label htmlFor="weight">Peso</label>
                <Styles.InputMed {...register("weight", { required: true })} />
              </div>
              <div>
                <label htmlFor="book">Livro</label>
                <Styles.InputLarge {...register("book", { required: true })} />
              </div>
              <Styles.SelectContainer>
                <label htmlFor="version">Versão</label>
                <section>
                  <Controller
                    control={control}
                    name="version"
                    defaultValue=""
                    render={({ field }) => (
                      <Styles.SelectFormated
                        {...field}
                        size={"large"}
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Escolha a Versão"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children
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
                    )}
                  />
                </section>
              </Styles.SelectContainer>
            </Styles.InputContainer>

            <Styles.InputContainer $loading={loading}>
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
