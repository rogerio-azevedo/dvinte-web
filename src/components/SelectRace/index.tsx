import React, { useEffect, useState } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectRaceProps {
  value?: string
  changeRace: (_value: string | null) => void
  races?: Option[]
}

export default function SelectRace({
  value,
  changeRace,
  races = [],
}: SelectRaceProps) {
  const [raceOptions, setRaceOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = races.map(race => ({
      value: race.value,
      label: race.label.toUpperCase(),
    }))

    setRaceOptions(data)
    setLoading(false)
  }, [races])

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
        value={raceOptions.find(option => option.value === value)}
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA A RAÇA"
        onChange={(
          newValue: SingleValue<Option>,
          _actionMeta: ActionMeta<Option>
        ) => changeRace(newValue ? newValue.value : null)}
        isLoading={loading}
        options={raceOptions}
        isClearable
      />
    </div>
  )
}
