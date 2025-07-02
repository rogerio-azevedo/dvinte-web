/* eslint-disable no-console */
import { useEffect, useRef, useState } from "react"
import { useField } from "@rocketseat/unform"
import Select, { type StylesConfig } from "react-select"
import api from "../../services/api"

import * as Styles from "./styles"

interface Option {
  value: string
  label: string
}

interface PortraitInputProps {
  changePortrait: (value: string | null) => void
  portraits?: Option[]
  onUploadSuccess?: () => void
}

interface UploadResponse {
  id: string
  url: string
}

export default function PortraitInput({
  changePortrait,
  portraits = [],
  onUploadSuccess,
}: PortraitInputProps) {
  const { defaultValue, registerField } = useField("avatar")

  const [file, setFile] = useState<string | undefined>(defaultValue?.id)
  const [preview, setPreview] = useState<string | undefined>(defaultValue?.url)
  const [portraitOptions, setPortraitOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: "portrait_id",
        ref: ref.current,
        path: "dataset.file",
      })
    }
  }, [ref, registerField])

  useEffect(() => {
    function loadOptions() {
      const options = portraits.map((portrait) => ({
        value: portrait.value,
        label: portrait.label.toUpperCase(),
      }))

      setPortraitOptions(options)
      setLoading(false)
    }

    loadOptions()
  }, [portraits])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return

      const data = new FormData()
      data.append("file", files[0])

      const response = await api.post<UploadResponse>("portraits", data)
      const { id, url } = response.data

      setFile(id)
      setPreview(url)

      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error) {
      console.error("Erro ao fazer upload do retrato:", error)
    }
  }

  const customStyles: StylesConfig<Option, false> = {
    input: (styles) => ({
      ...styles,
      height: "30px",
      minHeight: "30px",
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#ddd",
      "&:hover": {
        borderColor: "#999",
      },
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#6f0000"
        : isFocused
        ? "rgba(111, 0, 0, 0.1)"
        : "white",
      color: isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "rgba(111, 0, 0, 0.6)",
    }),
  }

  return (
    <Styles.Container>
      <label htmlFor="avatar">
        <img
          src={
            preview || "https://api.adorable.io/avatars/50/abott@adorable.png"
          }
          alt="Avatar do personagem"
        />

        <input
          type="file"
          id="avatar"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>

      <Styles.SelectContainer>
        <Select<Option>
          styles={customStyles}
          maxMenuHeight={220}
          placeholder="ESCOLHA O RETRATO"
          onChange={(newValue) => changePortrait(newValue?.value || null)}
          isLoading={loading}
          options={portraitOptions}
          isClearable
        />
      </Styles.SelectContainer>
    </Styles.Container>
  )
}
