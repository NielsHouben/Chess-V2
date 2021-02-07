const Express = require('express')
const Http = require('http').Server(Express)
const Socketio = require('socket.io')(Http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
})

//no need for db btw, not for actuall game
//this object can be expanded to have multiple gameboards with sharable keys to join each others games
//
// var position = {
//   x: 200,
//   y: 200,
// }
let board = ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR", "BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP", "WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR",]

Socketio.on("connection", socket => {
  socket.emit("board", board)
  socket.on("move", move => {
    board[move[1]] = board[move[0]] //second square gets the piece that occupies the first square
    board[move[0]] = "" //clar second square
    Socketio.emit("board", board)
  })
})


port = 3000
Http.listen(port, () => {
  console.log(`Listening at :${port}...`)
})


