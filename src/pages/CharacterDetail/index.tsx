import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { Button } from 'antd'
import { FaSync } from 'react-icons/fa'

import CharClass from '../../components/CharClass'
import CharArmor from '../../components/CharArmor'
import CharWeapon from '../../components/CharWeapon'
import CharEquipment from '../../components/CharEquipment'
import CharCa from '../../components/CharCa'
import CharResist from '../../components/CharResist'
import ModalEditCharacterProgress from '../../components/Modals/ModalEditCharacterProgress'
import { calculateEquipmentBonuses } from '../../util/calculateEquipmentBonuses'
import { useAuth } from '../../hooks/useAuth'

import type {
  Character,
  CharacterClass,
  Armor,
  Weapon,
  Equipment,
  Resistance,
} from './interfaces'

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [char, setChar] = useState<Character>()
  const [classes, setClasses] = useState<CharacterClass[]>()
  const [armors, setArmors] = useState<Armor[]>()
  const [weapons, setWeapons] = useState<Weapon[]>()
  const [equipments, setEquipments] = useState<Equipment[]>()
  const [resist, setResist] = useState<Resistance>()
  const [strMod, setStrMod] = useState<number>()
  const [dexMod, setDexMod] = useState<number>()

  const isGM = user?.is_gm || false

  async function loadChar() {
    setLoading(true)
    try {
      const response = await api.get<Character>(`characters/${id}`)
      const { data } = response

      const str = data.StrModTemp || data.StrMod
      const dex = data.DexModTemp || data.DexMod

      // Calcular bônus dos equipamentos
      const equipmentBonuses = calculateEquipmentBonuses(data.Equipment || [])

      setStrMod(str)
      setDexMod(dex)
      setChar(data)
      setClasses(data.Classes)
      setArmors(data.Armor)
      setWeapons(data.Weapon)
      setEquipments(data.Equipment)
      setResist({
        Fortitude: data.Fortitude,
        Reflex: data.Reflex,
        Will: data.Will,
        ConMod: data.ConMod,
        DexMod: data.DexMod,
        WisMod: data.WisMod,
        ConModTemp: data.ConModTemp,
        DexModTemp: data.DexModTemp,
        WisModTemp: data.WisModTemp,
        // Adicionar bônus dos equipamentos
        fortitudeBonus: equipmentBonuses.fortitude,
        reflexBonus: equipmentBonuses.reflex,
        willBonus: equipmentBonuses.will,
      })
    } catch (error) {
      console.error('Erro ao carregar personagem:', error)
    } finally {
      setLoading(false)
    }
  }

  async function recalculateAttributes() {
    try {
      await api.post(`attributes-temp/${id}/recalculate`)
      toast.success('Atributos recalculados com sucesso!')
      await loadChar() // Recarregar dados
    } catch (error) {
      console.error('Erro ao recalcular atributos:', error)
      toast.error('Erro ao recalcular atributos')
    }
  }

  useEffect(() => {
    loadChar()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`flex flex-col items-center w-full justify-center ${
        loading ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {/* Header */}
      <fieldset className="mt-4 border border-[#6f0000] rounded shadow-md w-[1240px]">
        <legend className="text-[18px] font-semibold ml-5 w-[160px] text-[#6f0000] bg-white shadow px-2 py-1 rounded">
          Dados Básicos
        </legend>
        <div className="flex flex-row items-center justify-around w-[1200px] rounded p-1">
          <div className="h-[160px] w-[130px] mr-4 ml-2">
            <img
              src={char?.Portrait}
              alt={char?.Name || ''}
              className="w-full h-[160px] object-cover rounded-[6%] bg-[#eee] shadow"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 mb-2">
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Name || ''}
                  className="w-[260px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Nome</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.User || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Usuário</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Race || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Raça</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Alig || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Alinhamento</label>
              </div>
            </div>

            <div className="flex flex-row gap-2 mb-2">
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Age || ''}
                  className="w-[110px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Idade</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Gender || ''}
                  className="w-[190px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Gênero</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Size || ''}
                  className="w-[190px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Tamanho</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Divin || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Divino</label>
              </div>
            </div>
            <div className="flex flex-row gap-2 mb-2">
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Height || ''}
                  className="w-[110px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Altura</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Weight || ''}
                  className="w-[110px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Peso</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Eye || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Olhos</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Hair || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Cabelo</label>
              </div>
              <div className="flex flex-col items-center">
                <input
                  readOnly
                  value={char?.Skin || ''}
                  className="w-[240px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow mx-1"
                />
                <label className="text-xs text-gray-700">Pele</label>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex justify-around items-center mt-4 w-[1240px]">
        {/* Atributos */}
        <fieldset className="border border-[#6f0000] rounded flex flex-col items-center p-2 shadow-md min-w-[340px] h-[360px]">
          <div className="flex items-center justify-between w-full mb-2">
            <legend className="text-[18px] font-semibold ml-5 w-[100px] text-[#6f0000] bg-white shadow px-2 py-1 rounded">
              Atributos
            </legend>
            <Button
              icon={<FaSync />}
              size="small"
              onClick={recalculateAttributes}
              className="mr-2"
              title="Recalcular atributos temporários baseado nos equipamentos"
            >
              Recalcular
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-x-3 gap-y-2 mt-2 ">
            {/* Primeira linha: labels */}
            <div></div>
            <div className="text-xs text-gray-700 text-center">Valor</div>
            <div className="text-xs text-gray-700 text-center">Mod</div>
            <div className="text-xs text-gray-700 text-center">V.Temp</div>
            <div className="text-xs text-gray-700 text-center">M.Temp</div>
            {/* FOR */}
            <div>
              <input
                readOnly
                value="FOR"
                className="bg-[#6f0000] text-white w-[48px] font-bold text-[18px] text-center rounded py-2"
              />
            </div>
            <input
              readOnly
              value={char?.Str || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.StrMod || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.StrTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.StrModTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            {/* DES */}
            <div>
              <input
                readOnly
                value="DES"
                className="bg-[#6f0000] text-white w-[48px] font-bold text-[18px] text-center rounded py-2"
              />
            </div>
            <input
              readOnly
              value={char?.Dex || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.DexMod || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.DexTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.DexModTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            {/* CON */}
            <div>
              <input
                readOnly
                value="CON"
                className="bg-[#6f0000] text-white w-[48px] font-bold text-[18px] text-center rounded py-2"
              />
            </div>
            <input
              readOnly
              value={char?.Con || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.ConMod || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.ConTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.ConModTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            {/* INT */}
            <div>
              <input
                readOnly
                value="INT"
                className="bg-[#6f0000] text-white w-[48px] font-bold text-[18px] text-center rounded py-2"
              />
            </div>
            <input
              readOnly
              value={char?.Int || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.IntMod || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.IntTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.IntModTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            {/* SAB */}
            <div>
              <input
                readOnly
                value="SAB"
                className="bg-[#6f0000] text-white w-[48px] font-bold text-[18px] text-center rounded py-2"
              />
            </div>
            <input
              readOnly
              value={char?.Wis || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.WisMod || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.WisTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.WisModTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            {/* CAR */}
            <div>
              <input
                readOnly
                value="CAR"
                className="bg-[#6f0000] text-white w-[48px] font-bold text-[18px] text-center rounded py-2"
              />
            </div>
            <input
              readOnly
              value={char?.Cha || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.ChaMod || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.ChaTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
            <input
              readOnly
              value={char?.ChaModTemp || ''}
              className="w-[48px] h-[36px] text-[#6f0000] font-bold text-[18px] text-center rounded shadow-md"
            />
          </div>
        </fieldset>

        {/* Classes e Level */}
        <fieldset className="border border-[#6f0000] rounded flex flex-col p-2 shadow-md ml-4 h-[360px]">
          <div className="flex items-center justify-between w-full mb-2 px-2">
            <legend className="text-[18px] font-semibold ml-3 text-[#6f0000] bg-white shadow px-2 py-1 rounded">
              Classes e Level
            </legend>
            {isGM && char && classes && (
              <div className="mr-2">
                <ModalEditCharacterProgress
                  characterId={char.Cod}
                  currentLevel={char.Level}
                  currentHealth={char.Health}
                  currentExp={char.Exp}
                  currentClasses={classes}
                  onSuccess={loadChar}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex flex-row gap-2">
                <div className="flex flex-col items-center">
                  <input
                    readOnly
                    value={char?.Level || ''}
                    className="w-[100px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow-md"
                  />
                  <label className="text-xs text-gray-700">Level</label>
                </div>

                <div className="flex flex-col items-center">
                  <input
                    readOnly
                    value={char?.Health || ''}
                    className="w-[100px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow-md"
                  />
                  <label className="text-xs text-gray-700">Vida (HP)</label>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    readOnly
                    value={
                      char?.BaseAttack && strMod ? char.BaseAttack + strMod : ''
                    }
                    className="w-[100px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow-md"
                  />
                  <label className="text-xs text-gray-700">Corpo a Corpo</label>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col items-center">
                  <input
                    readOnly
                    value={char?.Exp || ''}
                    className="w-[100px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow-md"
                  />
                  <label className="text-xs text-gray-700">Exp</label>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    readOnly
                    value={char?.HealthNow || ''}
                    className="w-[100px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow-md"
                  />
                  <label className="text-xs text-gray-700">Vida Atual</label>
                </div>

                <div className="flex flex-col items-center">
                  <input
                    readOnly
                    value={dexMod ?? ''}
                    className="w-[100px] h-[30px] rounded border border-[#333] text-[#6f0000] font-semibold text-[16px] text-center shadow-md"
                  />
                  <label className="text-xs text-gray-700">Iniciativa</label>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2 mb-2">
              {!loading && classes && <CharClass classes={classes} />}
            </div>
          </div>
        </fieldset>
        {/* Testes de Resistência */}
        <fieldset className="border border-[#6f0000] rounded flex flex-col items-center p-2 shadow-md ml-4 h-[360px]">
          <legend className="text-[18px] font-semibold ml-5 w-[210px] text-[#6f0000] bg-white shadow px-2 py-1 rounded">
            Testes de Resistência
          </legend>
          <div className="flex flex-col items-center w-full mt-2">
            {!loading && resist && <CharResist resist={resist} />}
            <div className="flex flex-row gap-2 mb-2">
              {!loading && armors && dexMod !== undefined && (
                <CharCa
                  armors={armors}
                  dextMod={dexMod}
                  equipmentArmorBonus={
                    calculateEquipmentBonuses(equipments || []).armorClass
                  }
                />
              )}
            </div>
          </div>
        </fieldset>
      </div>
      {/* Armaduras, Armas, Equipamentos */}
      <div className="flex flex-col gap-2 mt-4 w-[1240px]">
        <fieldset className="border border-[#6f0000] rounded w-full flex flex-col items-center p-2 shadow-md">
          <legend className="text-[18px] font-semibold ml-5 w-[250px] text-[#6f0000] bg-white shadow px-2 py-1 rounded">
            Armaduras e Escudos
          </legend>
          {!loading && armors && char && (
            <CharArmor
              armors={armors}
              size={char.Size}
              char={char.Cod}
              onArmorRemoved={loadChar}
            />
          )}
        </fieldset>
        <fieldset className="border border-[#6f0000] rounded w-full flex flex-col items-center p-2 shadow-md">
          <legend className="text-[18px] font-semibold ml-5 w-[250px] text-[#6f0000] bg-white shadow px-2 py-1 rounded">
            Armas
          </legend>
          {!loading && weapons && char && (
            <CharWeapon
              weapons={weapons}
              size={char.Size}
              char={char.Cod}
              onWeaponRemoved={loadChar}
            />
          )}
        </fieldset>
        <fieldset className="border border-[#6f0000] rounded w-full flex flex-col items-center p-2 shadow-md">
          <legend className="text-[18px] font-semibold ml-5 w-[250px] text-[#6f0000] bg-white shadow px-2 py-1 rounded">
            Equipamentos
          </legend>
          {!loading && equipments && char && (
            <CharEquipment
              equipments={equipments}
              char={char.Cod}
              onEquipmentRemoved={loadChar}
            />
          )}
        </fieldset>
      </div>
    </div>
  )
}
