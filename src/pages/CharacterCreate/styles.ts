import styled from 'styled-components'

interface ContainerProps {
  loading: number
}

interface ImageContainerProps {
  ispicked: string | null
}

interface ItemProps {
  ispicked: number
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 50px;

  h1 {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 600px;
`

export const ImageContainer = styled.div<ImageContainerProps>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 15px;
  padding: 20px 20px 0 20px;
  overflow-y: scroll;
  border-radius: 6px;
`

export const DivPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin-top: 10px;
`

export const ActivePage = styled.div`
  background: #8e0e00;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`

export const Page = styled.div`
  background: #bbb;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`

export const Item = styled.div<ItemProps>`
  width: 90px;
  height: 110px;
  cursor: pointer;

  img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-radius: 15%;
    background: #aaa;
    pointer-events: none;

    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;

    border: ${props => (props.ispicked ? '4px solid' : '0')};
    border-color: ${props => (props.ispicked ? '#26d61c' : 'black')};
    box-shadow: ${props =>
      props.ispicked
        ? '0px 0px 16px 0px rgba(0, 0, 0, 0.6)'
        : '0px 0px 10px 0px rgba(0, 0, 0, 0.6)'};
  }
`
