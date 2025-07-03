interface RandomOrgResponse {
  jsonrpc: string
  result: {
    random: {
      data: number[]
    }
  }
  id: number
}

const RANDOM_ORG_API_KEY = import.meta.env.VITE_RANDOM_ORG_API_KEY
const RANDOM_ORG_URL = 'https://api.random.org/json-rpc/4/invoke'

export async function generateRandomNumber(
  min: number,
  max: number
): Promise<number> {
  try {
    if (!RANDOM_ORG_API_KEY) {
      console.warn('❌ API key não encontrada no .env')
      throw new Error('Random.org API key not found')
    }

    const response = await fetch(RANDOM_ORG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey: RANDOM_ORG_API_KEY,
          n: 1,
          min,
          max,
          replacement: true,
        },
        id: 1,
      }),
    })

    if (!response.ok) {
      console.error(
        '❌ Erro na resposta da API:',
        response.status,
        response.statusText
      )
      throw new Error('Failed to fetch from Random.org')
    }

    const data: RandomOrgResponse = await response.json()
    const randomNumber = data.result.random.data[0]
    console.log('✅ Número gerado via Random.org:', randomNumber)
    return randomNumber
  } catch (error) {
    console.warn('⚠️ Fallback: usando Math.random devido a erro:', error)
    const fallbackNumber = Math.floor(Math.random() * (max - min + 1)) + min
    console.log('🎲 Número gerado via fallback:', fallbackNumber)
    return fallbackNumber
  }
}
