import styled from 'styled-components'

export const ChatContainer = styled.div`
  display: flex;
  width: auto;
  flex-direction: column;
  font-family: Arial, sans-serif;
  align-self: left;
  height: 100%;
  overflow: auto;
`

export const ChatHistory = styled.div`
  padding: 30px 30px 20px;
  border-bottom: 2px solid white;
  overflow: auto;
  height: 100%;
`

export const MessageData = styled.div`
  margin-bottom: 15px;
  text-align: ${props => (props.from ? 'right' : 'left')};
`
export const MessageDateTime = styled.span`
  color: #999;
  padding-left: 6px;
  font-size: 12px;
`

export const MessageDataName = styled.span`
  color: #000;
  padding-left: 6px;
  font-size: 14px;
  float: ${props => (props.from ? 'right' : 'left')};
`

export const Message = styled.div`
  padding: 8px 12px;
  line-height: 26px;
  font-size: 14px;
  border-radius: 6px;
  margin-bottom: 30px;
  width: 100%;
  position: relative;

  color: ${props =>
    props.crit === 'HIT'
      ? '#0000FF'
      : props.crit === 'FAIL'
      ? '#FF0000'
      : '#000'};

  background: ${props => (props.from ? '#c3e88d' : '#94c2ed')};
  float: ${props => (props.from ? 'right' : 'left')};

  &:after {
    bottom: 100%;
    left: ${props => (props.from ? '93%' : '7%')};
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: ${props => (props.from ? '#c3e88d' : '#94c2ed')};
    border-width: 10px;
    margin-left: -10px;
  }
`

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  display: inline-block;
  text-align: ${props => (props.from ? 'right' : 'left')};
`

export const ListMessage = styled.li`
  list-style: none;
  text-align: ${props => (props.from ? 'right' : 'left')};

  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
`

export const FormMessage = styled.form`
  background: #8e0e00;
  padding: 8px;
  display: flex;
  flex-direction: flex-end;
`

export const InputMessage = styled.input`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  color: #333;
  font-size: 16px;
  padding: 10px 10px;
  width: 100%;

  :focus {
    border-color: #a3f7ff;
    box-shadow: 0 0 7px #a3f7ff;
    outline: none;
  }
`
