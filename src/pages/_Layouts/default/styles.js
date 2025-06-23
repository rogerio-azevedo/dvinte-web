import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const PageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* overflow: ${props => (props.overFlow ? 'auto' : 'none')}; */
  overflow: auto;
  /* height: Calc(100% - 51px); */
`
