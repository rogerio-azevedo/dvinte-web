import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
`

export const ImageContainer = styled.div`
  display: grid;
  max-width: 900px;
  max-height: 600px;

  grid-template-columns: repeat(6, 1fr);
  grid-gap: 15px;
  padding: 20px 20px 0 20px;
  overflow-y: scroll;
  border-radius: 6px;
`

export const List = styled.ul`
  /* padding-bottom: 10px; */
`

export const Item = styled.div`
  width: 120px;
  height: 150px;

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 15%;

    background: #333;
    -webkit-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
  }
`
