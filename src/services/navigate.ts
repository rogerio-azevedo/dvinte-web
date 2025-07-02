/* eslint-disable no-console */

let navigator: (path: string) => void

export const setNavigator = (navFn: (path: string) => void) => {
  navigator = navFn
}

export const navigate = (path: string) => {
  if (navigator) {
    navigator(path)
  } else {
    console.warn('Navigator is not set')
  }
}
