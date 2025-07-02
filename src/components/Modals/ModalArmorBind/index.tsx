/* eslint-disable no-console */

import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import { FaTimes } from "react-icons/fa"
import { FaRegMoneyBillAlt } from "react-icons/fa"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"

import api from "../../../services/api"

import SelectCharacter from "../../SelectCharacter"

import * as Styles from "./styles"

interface Character {
  id: number
  name: string
}

interface ModalArmorBindProps {
  armor: {
    id: string
    name: string
  }
}

interface FormData {
  character: string
  armor: string
  price: number
  defense: number
  description: string
}

const customStyles = {
  content: {
    width: "750px",
    height: "550px",
    top: "45%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

Modal.setAppElement("#root")

const ModalArmorBind: React.FC<ModalArmorBindProps> = ({ armor }) => {
  const { handleSubmit, register, setValue, watch } = useForm<FormData>()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedArmor, setSelectedArmor] = useState(armor)
  const [characters, setCharacters] = useState<
    { value: string; label: string }[]
  >([])
  // const [loadingCharacters, setLoadingCharacters] = useState(false)

  // Monitorar o valor do personagem selecionado
  const selectedCharacter = watch("character")

  useEffect(() => {
    register("character", { required: true })
    register("armor")
    setValue("armor", selectedArmor?.id)
  }, [register, selectedArmor, setValue])

  async function loadCharacters() {
    try {
      const response = await api.get("/characters")
      const charactersData = response.data || []

      const characterOptions = charactersData.map((char: Character) => ({
        value: char.id.toString(),
        label: char.name,
      }))

      setCharacters(characterOptions)
    } catch (error) {
      toast.error("Erro ao carregar personagens")
    }
  }

  const onSubmit: SubmitHandler<FormData> = (data, e) => {
    async function saveData() {
      try {
        if (!data.character) {
          toast.error("Selecione um personagem")
          return
        }

        // Formato exato do legado
        const armorData = {
          character_id: data.character,
          armor_id: Number(selectedArmor.id),
          defense: Number(data.defense || 0),
          price: Number(data.price || 0),
          description: data.description || "",
        }

        console.log("Sending armor data:", armorData)
        await api.post(`/characters/${data.character}/armors`, armorData)
        e?.target.reset()
        toast.success("Armadura vinculada com sucesso!")
        setIsOpen(false)
      } catch (error) {
        console.error("Error saving armor:", error)
        toast.error("Erro ao vincular armadura ao personagem")
      }
    }
    saveData()
  }

  function openModal() {
    setIsOpen(true)
    setSelectedArmor(armor)
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
          <h2>Compra / Vinculação de Armadura</h2>
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
              <label htmlFor="armor">Cod</label>
              <Styles.WeaponShort readOnly value={selectedArmor?.id} />
            </div>
            <div>
              <label htmlFor="armor">Nome</label>
              <Styles.WeaponLarge
                readOnly
                value={selectedArmor?.name.toUpperCase()}
              />
            </div>
          </Styles.InputContainer>

          <Styles.InputContainer>
            <div>
              <label htmlFor="price">Preço</label>
              <Styles.WeaponMed
                {...register("price")}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="defense">Defesa Extra</label>
              <Styles.WeaponMed
                {...register("defense")}
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label style={{ color: "#fff" }} htmlFor="character">
                .
              </label>
              <SelectCharacter
                characters={characters}
                changeCharacter={(value) => {
                  console.log("Selected character:", value)
                  setValue("character", value || "")
                }}
              />
            </div>
          </Styles.InputContainer>

          <Styles.ButtonsContainer>
            <div>
              <label htmlFor="description">Observação</label>
              <Styles.WeaponExtLarge
                {...register("description")}
                defaultValue=""
              />
            </div>
            <Styles.Button type="submit" disabled={!selectedCharacter}>
              Vincular
            </Styles.Button>
          </Styles.ButtonsContainer>
        </form>
      </Modal>
    </Styles.Container>
  )
}

export default ModalArmorBind
