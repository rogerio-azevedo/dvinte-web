export async function calcDext(
  dexMod: number,
  maxDex: number
): Promise<number> {
  let dextBonus = 0

  if (maxDex !== undefined && dexMod <= maxDex) {
    dextBonus = dexMod
  } else if (!maxDex || maxDex === 0) {
    dextBonus = dexMod
  } else {
    dextBonus = maxDex
  }

  return dextBonus
}
