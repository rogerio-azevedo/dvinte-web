import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => (props.whiteColor ? 'white' : 'black')};
    margin: 0;
  }

  #svg *, .svg * {
  -moz-user-select: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -o-user-select: none;
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
}

em {
  border: 1px rgba(0, 0, 0, 0.2) solid;
  font-style: normal;
  padding: 0px 3px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
}

body {
  font-family: Georgia;
}

h6 {
  font-size: 100%;
  font-weight: normal;
  margin: 0px;
}

p {
  font-size: 80%;
  margin-top: 5px;
  margin-bottom: 0px;
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

#selector_div button {
  font-size: 20pt;
  color: rgb(255, 255, 255);
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border: none;
  width: 5em;
  top: 62%;
}

.dice_place {
  position: absolute;
  border: solid black 1px;
}

#main {
  height: 20vh;
}
`
