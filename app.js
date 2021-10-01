const index = '/index.html'
const port = process.env.PORT || 3000;

const express = require('express')
const app = express()
  .use((req, res) => res.sendFile(index, { root: __dirname}))
  .listen(port, () => console.log(`Server running port ${port}`))

const io = require('socket.io')(app, {
  options: {
    cors: '*'
  }
});

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    const { idPeer, roomName } = data;
    io.emit('join', `${idPeer} entered ${roomName}`)
    socket.join(roomName);
    socket.to(roomName).broadcast.emit('new-user', data)

    socket.on('disconnect', () => {
      io.emit('disconnect', `${idPeer} exited ${roomName}`)
      socket.to(roomName).broadcast.emit('bye-user', data)
    })
  })
})

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
