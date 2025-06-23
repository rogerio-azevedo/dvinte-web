/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../../services/api'

import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'

import SelectLevel from '../../../components/SelectLevel'
import SelectClasse from '../../../components/SelectClasse'

import ButtonPrev from '../../../components/ButtonPrev'
import ButtonNext from '../../../components/ButtonNext'

import * as Styles from './styles'

interface Option {
  value: string
  label: string
}

interface CharacterClass {
  class_id: string
  className: string
  level: number
}

interface ApiClassResponse {
  id: number
  name: string
}

export default function CharClass() {
  const { state, actions } = useCharacterCreation()

  const [level, setLevel] = useState<string>('')
  const [classe, setClasse] = useState<string>('')
  const [classes, setClasses] = useState<CharacterClass[]>(state.classe || [])

  // Dados estáticos para os selects
  const [availableClasses, setAvailableClasses] = useState<Option[]>([])
  const levelOptions: Option[] = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
    { value: '20', label: '20' },
  ]

  // Carregar classes disponíveis
  useEffect(() => {
    async function loadClasses() {
      try {
        const response = await api.get<ApiClassResponse[]>('classes')
        const classOptions = response.data.map(cls => ({
          value: cls.id.toString(),
          label: cls.name,
        }))
        setAvailableClasses(classOptions)
      } catch (error) {
        toast.error('Erro ao carregar classes disponíveis')
      }
    }

    loadClasses()
  }, [])

  // Sincronizar com o contexto
  useEffect(() => {
    setClasses(state.classe || [])
  }, [state.classe])

  const handleNewClass = (newClass: CharacterClass) => {
    const updatedClasses = [...classes, newClass]
    setClasses(updatedClasses)
  }

  async function handleAdd() {
    if (!classe || !level) {
      toast.error('Selecione uma classe e um nível')
      return
    }

    try {
      const response = await api.get<ApiClassResponse>(`classes/${classe}`)

      const newClass: CharacterClass = {
        class_id: classe,
        className: response.data && response.data.name.toUpperCase(),
        level: parseInt(level),
      }

      // Verificar se a classe já foi adicionada
      const classExists = classes.find(c => c.class_id === classe)
      if (classExists) {
        toast.error('Esta classe já foi adicionada')
        return
      }

      handleNewClass(newClass)
      setClasse('')
      setLevel('')
      toast.success('Classe adicionada com sucesso!')
    } catch (error) {
      toast.error('Erro ao adicionar classe')
    }
  }

  function handleRemove(item: CharacterClass) {
    const newClasses = classes.filter(c => c.class_id !== item.class_id)
    setClasses(newClasses)
    toast.success('Classe removida')
  }

  function handleSave() {
    // Salvar no contexto
    actions.setClasses(classes)
    toast.success('Classes salvas com sucesso!')
  }

  return (
    <Styles.Container>
      <ButtonPrev linkto="/charbase" display="show" />

      <Styles.ContentContainer>
        <h1>Cadastro de Personagem - CLASSE</h1>
        <Styles.FormContainer>
          <div>
            <Styles.InputContainer>
              <div>
                <label htmlFor="character">Classe</label>
                <SelectClasse
                  value={classe}
                  changeClasse={setClasse}
                  classes={availableClasses}
                />
              </div>
              <div>
                <label htmlFor="character">Level</label>
                <SelectLevel
                  value={level}
                  changeLevel={setLevel}
                  levels={levelOptions}
                />
              </div>
              <div>
                <Styles.ButtonAdd type="button" onClick={handleAdd}>
                  Adicionar
                </Styles.ButtonAdd>
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <ul>
                {classes &&
                  classes.map((item, index) => (
                    <li key={`${item.class_id}-${index}`}>
                      <Styles.ClassInput readOnly value={item.className} />
                      <Styles.ClassValueInput readOnly value={item.level} />
                      <FaTimes
                        onClick={() => handleRemove(item)}
                        size={20}
                        color="#8e0e00"
                        style={{ cursor: 'pointer' }}
                      />
                    </li>
                  ))}
              </ul>
            </Styles.InputContainer>
          </div>
        </Styles.FormContainer>

        {/* Debug - mostrar dados do contexto */}
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            fontSize: '12px',
          }}
        >
          <strong>Debug - Classes no contexto:</strong>
          <pre>{JSON.stringify(state.classe, null, 2)}</pre>
        </div>

        <Styles.DivPage>
          <Link to="charactercreate">
            <Styles.Page />
          </Link>

          <Link to="charbase">
            <Styles.Page />
          </Link>

          <Link to="charclass">
            <Styles.ActivePage />
          </Link>

          <Link to="charattributes">
            <Styles.Page />
          </Link>

          <Link to="charpreview">
            <Styles.Page />
          </Link>
        </Styles.DivPage>
      </Styles.ContentContainer>

      <ButtonNext
        linkto="/charattributes"
        display="show"
        handleSave={handleSave}
      />
    </Styles.Container>
  )
}
