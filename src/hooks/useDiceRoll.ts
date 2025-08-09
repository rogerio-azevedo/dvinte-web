import { useState, useCallback } from 'react'
import { useDices } from './useDices'
import api from '../services/api'
import { toast } from 'react-toastify'

// Interface para o request de dados
export interface DiceRollRequest {
  diceType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'
  diceMult: number
  diceSides: number
  characterId?: number
}

// Interface para a resposta do backend
export interface DiceRollResponse {
  success: boolean
  data: {
    user: string
    userId: number
    diceType: string
    diceSides: number
    diceMult: number
    diceResult: number[]
    timestamp: string
    characterId?: number
  }
}

// Interface para permissões de dados
export interface DicePermissions {
  canRoll: boolean
  maxDicePerRoll: number
  allowedDiceTypes: string[]
  cooldownSeconds: number
}

interface UseDiceRollReturn {
  isRolling: boolean
  permissions: DicePermissions | null
  rollDiceSecure: (request: DiceRollRequest) => Promise<void>
  refreshPermissions: () => Promise<void>
}

/**
 * Hook para rolagem segura de dados via backend
 */
export function useDiceRoll(): UseDiceRollReturn {
  const { setDiceData } = useDices()
  const [isRolling, setIsRolling] = useState(false)
  const [permissions, setPermissions] = useState<DicePermissions | null>(null)

  // Carrega as permissões do usuário
  const refreshPermissions = useCallback(async () => {
    try {
      const response = await api.get<DicePermissions>('/dice/permissions')
      setPermissions(response.data)
    } catch (error) {
      // Erro ao carregar permissões
      // Permissões padrão em caso de erro
      setPermissions({
        canRoll: true,
        maxDicePerRoll: 10,
        allowedDiceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
        cooldownSeconds: 0,
      })
    }
  }, [])

  // Rola dados de forma segura via backend
  const rollDiceSecure = useCallback(
    async (request: DiceRollRequest) => {
      if (isRolling) {
        toast.warn('Aguarde a rolagem anterior terminar')
        return
      }

      // Verificar permissões localmente (se carregadas)
      if (permissions) {
        if (!permissions.canRoll) {
          toast.error('Você não tem permissão para rolar dados')
          return
        }

        if (request.diceMult > permissions.maxDicePerRoll) {
          toast.error(`Máximo ${permissions.maxDicePerRoll} dados por rolagem`)
          return
        }

        if (!permissions.allowedDiceTypes.includes(request.diceType)) {
          toast.error(`Tipo de dado ${request.diceType} não permitido`)
          return
        }
      }

      setIsRolling(true)

      try {
        // Iniciando rolagem segura

        // Chama a API do backend
        const response = await api.post<DiceRollResponse>('/dice/roll', request)

        // Atualiza o contexto local com os dados retornados
        setDiceData({
          diceType: response.data.data.diceType,
          diceSides: response.data.data.diceSides,
          diceMult: response.data.data.diceMult,
          diceResult: response.data.data.diceResult,
          diceRoll: true, // Dispara a animação 3D
          diceShow: true, // Mostra os dados
        })

        // Mostra o resultado
        const resultSum = response.data.data.diceResult.reduce(
          (sum: number, val: number) => sum + val,
          0
        )
        const resultText =
          response.data.data.diceResult.length > 1
            ? `[${response.data.data.diceResult.join(', ')}] = ${resultSum}`
            : `${resultSum}`

        toast.success(
          `🎲 ${response.data.data.user} rolou ${response.data.data.diceMult}${response.data.data.diceType}: ${resultText}`,
          { autoClose: 5000 }
        )

        // Rolagem segura concluída
      } catch (error: unknown) {
        // Erro na rolagem segura

        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido'

        if (errorMessage.includes('não autenticado')) {
          toast.error('Você precisa estar logado para rolar dados')
        } else if (errorMessage.includes('Dados inválidos')) {
          toast.error('Parâmetros de dados inválidos')
        } else {
          toast.error(`Erro ao rolar dados: ${errorMessage}`)
        }
      } finally {
        setIsRolling(false)
      }
    },
    [isRolling, permissions, setDiceData]
  )

  return {
    isRolling,
    permissions,
    rollDiceSecure,
    refreshPermissions,
  }
}
