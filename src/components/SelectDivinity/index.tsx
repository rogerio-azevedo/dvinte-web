import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectDivinityProps {
  value: string | null
  changeDivinity: (_: string | null) => void
  divinities?: Option[]
}

export default function SelectDivinity({
  value,
  changeDivinity,
  divinities = [],
}: SelectDivinityProps) {
  const [divinityOptions, setDivinityOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = divinities.map(divinity => ({
      value: divinity.value,
      label: divinity.label.toUpperCase(),
    }))

    setDivinityOptions(data)
    setLoading(false)
  }, [divinities])

  // Encontrar a opção selecionada baseada no value
  const selectedOption =
    divinityOptions.find(option => option.value === value) || null

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
        placeholder="ESCOLHA A DIVINDADE"
        value={selectedOption}
        onChange={(newValue: SingleValue<Option>) =>
          changeDivinity(newValue ? newValue.value : null)
        }
        isLoading={loading}
        options={divinityOptions}
        isClearable
      />
    </div>
  )
}
