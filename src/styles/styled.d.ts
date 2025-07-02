import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      title: string
      border: string
      background: string
      text: string
      primary: string
      secondary: string
    }
  }
}
