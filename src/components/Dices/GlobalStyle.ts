import { createGlobalStyle, DefaultTheme } from 'styled-components'

interface GlobalStyleProps {
  theme?: DefaultTheme
  whiteColor?: boolean
}

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  body {
    background: ${({ whiteColor }) => (whiteColor ? 'white' : 'black')};
    margin: 0;
    font-family: Georgia, serif;
  }

  #svg *, .svg * {
    user-select: none;
  }

  #waitform {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10000;
    cursor: wait;
  }

  a {
    color: gray;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: darkgray;
    }
  }

  em {
    border: 1px rgba(0, 0, 0, 0.2) solid;
    font-style: normal;
    padding: 0 3px;
    background-color: rgba(0, 0, 0, 0.08);
    border-radius: 3px;
  }

  h6 {
    font-size: 100%;
    font-weight: normal;
    margin: 0;
  }

  p {
    font-size: 80%;
    margin: 5px 0 0;
  }

  #label {
    font-size: 32pt;
    word-spacing: 0.5em;
    padding: 5px 15px;
    color: rgba(0, 0, 0, 0.8);
    background-color: lightblue;
    top: 45%;
  }

  #labelhelp {
    font-size: 12pt;
    padding: 5px 15px;
    color: rgba(0, 0, 0, 0.8);
    bottom: 50px;
  }

  #set {
    text-align: center;
    font-size: 26pt;
    border: none;
    color: rgba(0, 0, 0, 0.8);
    background-color: lightblue;
    top: 60%;
  }

  #sethelp {
    font-size: 12pt;
    color: rgba(21, 26, 26, 0.5);
    background: none;
    top: 25%;
  }

  #selector_div {
    button {
      font-size: 20pt;
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
      border: none;
      width: 5em;
      top: 62%;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }

      &:active {
        background-color: rgba(0, 0, 0, 1);
      }
    }
  }

  .dice_place {
    position: absolute;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  #main {
    height: 20vh;
    width: 100%;
    position: relative;
  }
`
