<template>
  <!-- <div>
    <canvas ref="game" width="640" height="480" style="border: 1px solid black"></canvas>
    <p>
      <button @click="move('right')">Right</button>
      <button @click="move('left')">Left</button>
      <button @click="move('up')">Up</button>
      <button @click="move('down')">Down</button>
    </p>
  </div> -->
  <div id="board">
    <div class="gameBoard">
      <div
        v-for="(piece, index) in this.board"
        :key="piece.id"
        :id="index"
        @click="move(piece, index)"
      >
        <div class="square" :class="colorDecider(index) ? 'first-color' : 'second-color'">
          <img
            v-if="piece"
            :src="require(`../assets/Pieces/${piece}.webp`)"
            unselectable="on"
            ondragstart="return false;"
            draggable="false"
          />
        </div>
      </div>
    </div>
    <!-- <canvas ref="game" width="640" height="480" style="border: 1px solid black"></canvas> -->
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "BlockGame",
  data() {
    return {
      socket: {},
      board: [
        "BR",
        "BN",
        "BB",
        "BQ",
        "BK",
        "BB",
        "BN",
        "BR",
        "BP",
        "BP",
        "BP",
        "BP",
        "BP",
        "BP",
        "BP",
        "BP",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "WP",
        "WP",
        "WP",
        "WP",
        "WP",
        "WP",
        "WP",
        "WP",
        "WR",
        "WN",
        "WB",
        "WQ",
        "WK",
        "WB",
        "WN",
        "WR",
      ],
      room: String,
      activePiecePos: Number,
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  created() {
    console.log("I am created");
    this.socket = io("http://localhost:3000/game", { transport: ["websocket"] });

    //check if gameRoom already in url
    console.log(this.$route.query.id);
    if (this.$route.query.id) {
      this.socket.emit("joinRoom", this.$route.query.id);
    } else {
      //create room and join
      this.socket.emit("joinRoom", "create");
    }

    // this.socket.on("message", function (data) {
    //   console.log(data);
    // });

    // socket.emit("subscribe", "roomOne");
    // socket.emit("subscribe", "roomTwo");

    // $("#send").click(function () {
    //   var room = $("#room").val(),
    //     message = $("#message").val();

    //   socket.emit("send", { room: room, message: message });
    // });
  },
  mounted() {
    // this.context = this.$refs.game.getContext("2d");
    // this.socket.on("position", (data) => {
    //   this.position = data;
    //   this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
    //   this.context.fillRect(this.position.x, this.position.y, 20, 20);
    // });
    this.socket.on("status", (data) => {
      this.room = data[1]; // add data to url and make url sharable
      console.log("joined room: " + this.room);
      if (!this.$route.query.id) {
        this.$router.push({ query: { id: this.room } });
      }
    });

    this.socket.on("board", (data) => {
      this.board = data;
      console.log(data);
    });

    this.socket.on("err", (err) => {
      console.log(err);
    });
    this.socket.on("success", (res) => {
      console.log(res);
    });
  },
  methods: {
    // move(direction) {
    //   // this.socket.emit("move", direction);
    //   this.socket.emit("move", direction);
    // },
    colorDecider(index) {
      return Math.floor(index / 8) % 2 == 0 ? index % 2 == 0 : index % 2 != 0;
    },

    move(piece, index) {
      console.log(piece ? piece : "no piece", index);

      if (piece) {
        this.activePiecePos = index;
      } else {
        console.log(this.activePiecePos, index);
        this.socket.emit("move", [this.room, [this.activePiecePos, index]]);
        // this.socket.emit("move", [this.activePiecePos, index]);
      }
    },
  },
};
</script>

<style scoped>
.second-color {
  background-color: #0042ac;
}

.first-color {
  background-color: #dcdcdc;
}

.gameBoard {
  background-color: red;
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);

  width: 500px;
  height: 500px;
}

.square {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

img {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  /* For Opera and <= IE9, we need to add unselectable="on" attribute onto each element */
  /* Check this site for more details: http://help.dottoro.com/lhwdpnva.php */
}
</style>
