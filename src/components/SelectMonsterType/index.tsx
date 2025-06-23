import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectMonsterTypeProps {
  changeMonsterType: (_: string | null) => void
  monsterTypes?: Option[]
}

export default function SelectMonsterType({
  changeMonsterType,
  monsterTypes = [],
}: SelectMonsterTypeProps) {
  const [monsterTypeOptions, setMonsterTypeOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = monsterTypes.map(type => ({
      value: type.value,
      label: type.label.toUpperCase(),
    }))

    setMonsterTypeOptions(data)
    setLoading(false)
  }, [monsterTypes])

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
        placeholder="ESCOLHA O TIPO DE MONSTRO"
        onChange={(newValue: SingleValue<Option>) =>
          changeMonsterType(newValue ? newValue.value : null)
        }
        isLoading={loading}
        options={monsterTypeOptions}
        isClearable
      />
    </div>
  )
}
