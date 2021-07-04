import io from 'socket.io-client'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import "bootstrap/dist/css/bootstrap.css"
import "./styles.css"

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

    socket.on('subscribe', res => {
      if(username === res.user.name) alert(`You've successfully subscribed!`)
    })
  }, [])

  const onSubmit = event => {
    event.preventDefault()
    socket.emit('send', message)
    setMessage('')
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mt-4 mb-4">
          <h4>Hello {username}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h5>Messages</h5>
          <div id="messages">
            {messages.map(({ user, date, text }, index) => (
              <div key={index} className="row mb-2">
                <h6 className="col-lg-3">
                  {moment(date).format("h:mm:ss a")}
                </h6>
                <h6 className="col-lg-2">{user.name}</h6>
                <h6 className="col-lg-2">{text}</h6>
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} id="form">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                onChange={e => setMessage(e.currentTarget.value)}
                value={message}
                id="text"
              />
              <span className="input-group-btn">
                <button id="submit" type="submit" className="btn btn-primary">
                  Send
                </button>
              </span>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <h5>Users</h5>
          <ul id="users">
            {users.map(({ name, id }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Client />, document.getElementById("root"));
