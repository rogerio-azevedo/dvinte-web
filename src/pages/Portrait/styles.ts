import styled from 'styled-components'

interface ContainerProps {
  loading: number
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  opacity: ${props => (props.loading ? 0.6 : 1)};
  pointer-events: ${props => (props.loading ? 'none' : 'auto')};
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

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 100%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    padding: 10px;
  }
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

export const Item = styled.div`
  width: 120px;
  height: 150px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.7);
  }

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

  @media (max-width: 768px) {
    width: 100px;
    height: 125px;

    img {
      height: 125px;
    }
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 100px;

    img {
      height: 100px;
    }
  }
`
