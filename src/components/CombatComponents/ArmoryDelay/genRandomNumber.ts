/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '../../../services/api'

export const generateSecureRandomNumber = async (
  min: number,
  max: number,
  userId?: number,
  userName?: string
): Promise<any> => {
  try {
    let diceType = ''
    if (max === 4) diceType = 'd4'
    else if (max === 6) diceType = 'd6'
    else if (max === 8) diceType = 'd8'
    else if (max === 10) diceType = 'd10'
    else if (max === 12) diceType = 'd12'
    else if (max === 20) diceType = 'd20'
    else if (max === 100) diceType = 'd100'
    else diceType = `d${max}`

    const response = await api.post('/dice/roll', {
      diceType,
      diceMult: 1,
      diceSides: max,
      userId,
      userName,
    })
    return response.data.data.diceResult[0]
  } catch (error) {
    console.warn('⚠️ Fallback: usando Math.random devido a erro:', error)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
