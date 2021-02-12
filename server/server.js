const uuid = require("uuid") // console.log(uuid.v4())
function randString (length) {
  const list = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let res = ""
  for (let i = 0; i < length; i++) {
    let rnd = Math.floor(Math.random() * list.length)
    res = res + list.charAt(rnd)
  }
  return res
}

const express = require('express')
const http = require('http').Server(express)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
})

//no need for db btw, not for actuall game
//this object can be expanded to have multiple gameboards with sharable keys to join each others games
//
// let position = {
//   x: 200,
//   y: 200,
// }
const board = ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR", "BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP", "WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR",]
let rooms = {}




io.of("/game").on("connection", socket => {



  socket.on("joinRoom", (room) => {
    if (room == "create") {
      room = randString(6)
      socket.join(room)
      // rooms.push({ room: board })
      rooms[room] = { board: board.slice() }
      rooms[room].p1 = socket.id



      console.log(`created room: ${room}`)
      io.of("/game").in(room).emit("status", ["someone joined", room])

    }
    else if (1) { //games.includes(room)
      socket.join(room)

      if (!rooms[room].p2) { //if p2 doesn't already exist
        rooms[room].p2 = socket.id
      }
      io.of("/game").in(room).emit("board", rooms[room].board)
      return io.of("/game").in(room).emit("status", ["someone joined", room])
    }
    else {
      return socket.emit("err", `ERROR, No room named ${room}`)
    }
  })


  socket.on("move", data => {
    room = data[0] //CHECK IF ROOM EXISTS, ELSE CRASH!!!!!!!
    move = data[1]
    // player = socket.id == rooms[room].p1 ? "p1" : "p2"
    if (socket.id == rooms[room].p1) {
      console.log("player one")
    }
    else if (socket.id == rooms[room].p2) {
      console.log("player two")
    }
    else {
      return console.log("UNATHOURIZED TRIED TO MOVE")
    }

    // switch (socket.id) {
    //   case rooms[room].p1:
    //     console.log("player one")
    //     break
    //   case rooms[room].p2:
    //     console.log("player two")
    //     break

    //   default:

    //     break
    // }

    //console.log(player)



    rooms[room].board[move[1]] = rooms[room].board[move[0]] //second square gets the piece that occupies the first square
    rooms[room].board[move[0]] = "" //clar second square
    io.of("/game").in(room).emit("board", rooms[room].board)



  })

})
// io.sockets.on('connection', function (client) {
//   client.on('subscribe', function (room) {
//     console.log('joining room', room)
//     client.join(room)
//   })

//   client.on('unsubscribe', function (room) {
//     console.log('leaving room', room)
//     client.leave(room)
//   })

//   client.on('send', function (data) {
//     console.log('sending message')
//     io.sockets.in(data.room).emit('message', data)
//   })
// })


port = 3000
http.listen(port, () => {
  console.log(`Listening at :${port}...`)

})


