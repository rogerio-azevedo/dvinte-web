import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    margin-top: 20px;
  }
`

export const ChatContainer = styled.div`
  width: 50%;
  flex-direction: row;
  font-family: Arial, sans-serif;

  margin-top: 10px;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
`

export const ChatHistory = styled.div`
  padding: 30px 30px 20px;
  border-bottom: 2px solid white;
  overflow-y: scroll;
  height: 550px;
`

export const List = styled.ul``

export const MessageData = styled.div`
  margin-bottom: 15px;
  text-align: ${props => (props.from ? 'right' : 'left')};
`
export const MessageDateTime = styled.span`
  color: #999;
  padding-left: 6px;
  font-size: 13px;
`

export const MessageDataName = styled.span`
  color: #000;
  padding-left: 6px;
  font-size: 15px;
  float: ${props => (props.from ? 'right' : 'left')};
`

export const Message = styled.div`
  color: #000;
  padding: 8px 12px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 6px;
  margin-bottom: 30px;
  width: 100%;
  position: relative;

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
  border-radius: 4px;
`

export const InputMessage = styled.input`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  color: #333;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  width: 100%;

  :focus {
    border-color: #a3f7ff;
    box-shadow: 0 0 7px #a3f7ff;
    outline: none;
  }
`
