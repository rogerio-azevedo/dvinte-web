import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectClasseProps {
  value?: string
  changeClasse: (_: string | null) => void
  classes?: Option[]
}

export default function SelectClasse({
  value,
  changeClasse,
  classes = [],
}: SelectClasseProps) {
  const [classeOptions, setClasseOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = classes.map(classe => ({
      value: classe.value,
      label: classe.label.toUpperCase(),
    }))

    setClasseOptions(data)
    setLoading(false)
  }, [classes])

  // Encontrar a opção selecionada
  const selectedOption =
    classeOptions.find(option => option.value === value) || null

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
        placeholder="ESCOLHA A CLASSE"
        value={selectedOption}
        onChange={(newValue: SingleValue<Option>) =>
          changeClasse(newValue ? newValue.value : null)
        }
        isLoading={loading}
        options={classeOptions}
        isClearable
      />
    </div>
  )
}
