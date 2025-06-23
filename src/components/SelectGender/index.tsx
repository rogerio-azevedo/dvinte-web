import { useEffect, useState } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectGenderProps {
  value?: string
  changeGender: (_value: string | null) => void
  genders?: Option[]
}

export default function SelectGender({
  value,
  changeGender,
  genders = [],
}: SelectGenderProps) {
  const [genderOptions, setGenderOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = genders.map(gender => ({
      value: gender.value,
      label: gender.label.toUpperCase(),
    }))

    setGenderOptions(data)
    setLoading(false)
  }, [genders])

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
        value={genderOptions.find(option => option.value === value)}
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O GÊNERO"
        onChange={(
          newValue: SingleValue<Option>,
          _actionMeta: ActionMeta<Option>
        ) => changeGender(newValue ? newValue.value : null)}
        isLoading={loading}
        options={genderOptions}
        isClearable
      />
    </div>
  )
}
