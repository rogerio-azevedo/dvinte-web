/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import Select, { type SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectCharacterProps {
  changeCharacter: (value: string | null) => void
  characters?: Option[]
}

export default function SelectCharacter({
  changeCharacter,
  characters = [],
}: SelectCharacterProps) {
  const [characterOptions, setCharacterOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = characters.map(character => ({
      value: character.value,
      label: character.label.toUpperCase(),
    }))

    setCharacterOptions(data)
    setLoading(false)
  }, [characters])

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
    <div className="w-72">
      <Select
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O PERSONAGEM"
        onChange={handleChange}
        isLoading={loading}
        options={characterOptions}
        isClearable
      />
    </div>
  )
}
