/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from 'react'
import Select, { type SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectCharacterProps {
  changeCharacter: (value: string | null) => void
  characters?: Option[]
  value?: string
}

export default function SelectCharacter({
  changeCharacter,
  characters = [],
  value,
}: SelectCharacterProps) {
  const [characterOptions, setCharacterOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const hasAutoSelected = useRef(false)

  useEffect(() => {
    const data = characters.map(character => ({
      value: character.value,
      label: character.label.toUpperCase(),
    }))

    setCharacterOptions(data)
    setLoading(false)
  }, [characters])

  // Auto-seleciona quando há um value (apenas uma vez)
  useEffect(() => {
    if (
      value &&
      characterOptions.length > 0 &&
      !loading &&
      !hasAutoSelected.current
    ) {
      const defaultOption = characterOptions.find(
        option => option.value === value
      )
      if (defaultOption) {
        console.log('🎯 SelectCharacter: Auto-selecionando', defaultOption)
        hasAutoSelected.current = true
        changeCharacter(value)
      }
    }
  }, [value, characterOptions, loading, changeCharacter])

  const customStyles = {
    input: (styles: any) => ({
      ...styles,
      height: '30px',
      minHeight: '30px',
    }),
  }

  const handleChange = (selectedOption: SingleValue<Option>) => {
    // Se não houver seleção, passa null
    if (!selectedOption) {
      changeCharacter(null)
      return
    }

    // Passa o value (que é o ID do personagem)
    changeCharacter(selectedOption.value)
  }

  return (
    <div className="w-full px-2">
      <Select
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="Selecione o personagem"
        onChange={handleChange}
        isLoading={loading}
        options={characterOptions}
        isClearable
      />
    </div>
  )
}
