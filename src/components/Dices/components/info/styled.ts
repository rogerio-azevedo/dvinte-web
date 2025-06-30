import styled from 'styled-components'

export const CenterField = styled.div`
  position: absolute;
  text-align: center;
  height: 100%;
  width: 100%;

  * {
        position: relative;
        font-family: Trebuchet MS;
        background-color: rgba(255, 255, 255, 0.6);
        padding: 5px 15px;
    }

 br {
    background-color: rgba(0, 0, 0, 0);
}
`
export const BottomField = styled.div`
  position: absolute;
  text-align: center;
  bottom: 5px;
  width: inherit;
  padding: 0px;
`
