import { useEffect, useState } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

import * as Styles from './styles'

interface Option {
  value: string
  label: string
}

interface SelectLevelProps {
  value?: string
  changeLevel: (_value: string | null) => void
  levels?: Option[]
}

export default function SelectLevel({
  value,
  changeLevel,
  levels = [],
}: SelectLevelProps) {
  const [levelOptions, setLevelOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = levels.map(level => ({
      value: level.value,
      label: level.label.toUpperCase(),
    }))

    setLevelOptions(data)
    setLoading(false)
  }, [levels])

  const customStyles = {
    input: (styles: any) => ({
      ...styles,
      height: '30px',
      minHeight: '30px',
    }),
  }

  return (
    <Styles.Container>
      <Select
        value={levelOptions.find(option => option.value === value)}
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O NÍVEL"
        onChange={(
          newValue: SingleValue<Option>,
          _actionMeta: ActionMeta<Option>
        ) => changeLevel(newValue ? newValue.value : null)}
        isLoading={loading}
        options={levelOptions}
        isClearable
      />
    </Styles.Container>
  )
}
