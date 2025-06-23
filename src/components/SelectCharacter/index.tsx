import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectCharacterProps {
  changeCharacter: (_: string | null) => void
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

  return (
    <div style={{ width: '220px', marginRight: '15px' }}>
      <Select
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O PERSONAGEM"
        onChange={(newValue: SingleValue<Option>) =>
          changeCharacter(newValue ? newValue.value : null)
        }
        isLoading={loading}
        options={characterOptions}
        isClearable
      />
    </div>
  )
}
