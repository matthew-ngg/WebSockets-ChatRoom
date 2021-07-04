import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
`

const ConversationContainer = styled.div`
  width: 700px;
  height: 500px;
  background-color: gainsboro;
`

const MessageRowContainer = styled.div`
  display: flex;
  > * {
    padding-left: 30px;
  }
`

const MessageInput = styled.input`
  width: 700px;
`

export { StyledWrapper, ConversationContainer, MessageRowContainer, MessageInput }