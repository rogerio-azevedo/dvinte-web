/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '../../../services/api'

const MAX_DICE_PER_API_CALL = 20

function maxToDiceType(max: number): string {
  if (max === 4) return 'd4'
  if (max === 6) return 'd6'
  if (max === 8) return 'd8'
  if (max === 10) return 'd10'
  if (max === 12) return 'd12'
  if (max === 20) return 'd20'
  if (max === 100) return 'd100'
  return `d${max}`
}

/**
 * Gera vários valores de dado em uma ou mais chamadas à API (máx. 20 por request,
 * conforme validação do servidor), para evitar N eventos de socket e N animações.
 */
export const generateSecureRandomNumbers = async (
  min: number,
  max: number,
  count: number = 1,
  userId?: number,
  userName?: string
): Promise<number[]> => {
  if (count < 1) return []

  const diceType = maxToDiceType(max)
  const results: number[] = []

  try {
    let remaining = count
    while (remaining > 0) {
      const batchSize = Math.min(remaining, MAX_DICE_PER_API_CALL)
      const response = await api.post('/dice/roll', {
        diceType,
        diceMult: batchSize,
        diceSides: max,
        userId,
        userName,
      })
      const batch: number[] = response.data.data.diceResult
      results.push(...batch)
      remaining -= batchSize
    }
    return results
  } catch (error) {
    console.warn('⚠️ Fallback: usando Math.random devido a erro:', error)
    const fallback: number[] = []
    for (let i = 0; i < count; i++) {
      fallback.push(Math.floor(Math.random() * (max - min + 1)) + min)
    }
    return fallback
  }
}

export const generateSecureRandomNumber = async (
  min: number,
  max: number,
  userId?: number,
  userName?: string
): Promise<any> => {
  const arr = await generateSecureRandomNumbers(min, max, 1, userId, userName)
  return arr[0]
}
