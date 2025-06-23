import { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectMonsterSubTypeProps {
  changeMonsterSubType: (_: string | null) => void
  monsterSubTypes?: Option[]
}

export default function SelectMonsterSubType({
  changeMonsterSubType,
  monsterSubTypes = [],
}: SelectMonsterSubTypeProps) {
  const [monsterSubTypeOptions, setMonsterSubTypeOptions] = useState<Option[]>(
    []
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = monsterSubTypes.map(subType => ({
      value: subType.value,
      label: subType.label.toUpperCase(),
    }))

    setMonsterSubTypeOptions(data)
    setLoading(false)
  }, [monsterSubTypes])

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
        placeholder="ESCOLHA O SUBTIPO DE MONSTRO"
        onChange={(newValue: SingleValue<Option>) =>
          changeMonsterSubType(newValue ? newValue.value : null)
        }
        isLoading={loading}
        options={monsterSubTypeOptions}
        isClearable
      />
    </div>
  )
}
