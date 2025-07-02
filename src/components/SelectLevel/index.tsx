import { useEffect, useState } from "react";
import Select, { type StylesConfig } from "react-select";

import * as Styles from "./styles";

interface Option {
  value: string;
  label: string;
}

interface SelectLevelProps {
  value: string;
  changeLevel: (value: string) => void;
  levels: Option[];
}

export default function SelectLevel({
  value,
  changeLevel,
  levels,
}: SelectLevelProps) {
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadOptions() {
      const options = levels.map((level) => ({
        value: level.value,
        label: level.label.toUpperCase(),
      }));

      setLevelOptions(options);
      setLoading(false);
    }

    loadOptions();
  }, [levels]);

  const customStyles: StylesConfig<Option, false> = {
    input: (styles) => ({
      ...styles,
      height: "30px",
      minHeight: "30px",
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#ddd",
      "&:hover": {
        borderColor: "#999",
      },
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#6f0000"
        : isFocused
        ? "rgba(111, 0, 0, 0.1)"
        : "white",
      color: isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "rgba(111, 0, 0, 0.6)",
    }),
  };

  const selectedOption = levelOptions.find((option) => option.value === value);

  return (
    <Styles.Container>
      <Select<Option>
        value={selectedOption}
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O NÍVEL"
        onChange={(newValue) => changeLevel(newValue?.value || "")}
        isLoading={loading}
        options={levelOptions}
        isClearable
      />
    </Styles.Container>
  );
}
