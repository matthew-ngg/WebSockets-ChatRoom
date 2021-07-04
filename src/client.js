import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import moment from 'moment'

import { StyledWrapper } from './client.styles'

const username = prompt('What is your name')

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
})

const Client = ({}) => {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('username', username)
    })

    socket.on('users', users => {
      setUsers(users)
    })

    socket.on('message', message => {
      setMessages(messages => [...messages, message])
    })

    socket.on('connected', user => {
      setUsers(user => [...users, user])
    })

    socket.on('disconnected', id => {
      setUsers(users => users.filter(user => user.id !== id))
    })
  }, [])

  const onSubmit = event => {
    event.preventDefault()
    socket.emit('send', message)
    setMessage('')
  }

  return (
    <>
      <h1>{`Hello ${username}`}</h1>
      <StyledWrapper>
      <div>
        {messages.map(({ user, date, text }, index) => (
          <>
            {moment(date).format('h:mm:ss a')}
            <p>{user.name}</p>
            <p>{text}</p>
          </>
        ))}
      </div>

      <div>
        <form onSubmit={onSubmit}>
          <input  type='text' onChange={e => setMessage(e.currentTarget.value)} value={message} />
          <button type="submit">Send</button>
        </form>
      </div>

      <div>
          <h1>Users</h1>
          <ul>
            {users.map(({ name, id }) => (
              <li>{name}</li>
            ))}
          </ul>
      </div>
      </StyledWrapper>
    </>
  );
}

ReactDOM.render(<Client />, document.getElementById("root"));
