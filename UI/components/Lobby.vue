<template>
  <div class="main">
    <div class="top">
      <b-button type="is-danger" @click="Leave()"> Quitté le lobby </b-button>
    </div>
    <div class="mid">
      <div class="playerlist">
        <h2 class="title">JOUEURS</h2>
        <div class="users">
          <div
            class="user"
            v-for="player in $parent.Game.players"
            :key="player.Username"
          >
            <div>
              <b-image
                :src="require('@/assets/avatars/' + player.PlayerIcon + '.png')"
                class="playericons"
              ></b-image>
            </div>
            <p class="playername">{{ player.Username }}</p>
          </div>
        </div>
      </div>

      <div class="param">
        <h2 class="title">Paramètres</h2>
        <div>Code de partie : {{ $parent.Game.code }}</div>
        <b-button type="is-success is-light" @click="Copy()">
          Copier le code</b-button
        >
        <b-button type="is-info" @click="StartGame()">
          Lancer la partie
        </b-button>
      </div>
    </div>
    <div class="bottom">
      <div>
        Crée par
        <a href="https://www.sylvainrougie.fr" target="_blank"
          >Sylvain Rougié</a
        >
      </div>
    </div>
  </div>
</template>

<script>
var socket;
export default {
  mounted() {
    socket = this.$parent.socket;

    socket.on("GameStarting", (data) => {
      if (data.starting) {
        console.log(data.Question);
        this.$parent.Question = data.Question;
        this.$parent.Game = data.Game;
      } else {
        this.$buefy.toast.open({
          message: data.message,
          type: "is-danger",
        });
        this.$parent.Question = data.Question;
        console.log(data.Question);
        this.$parent.Game = data.Game;
      }
    });
  },
  methods: {
    Leave: function () {
      socket.emit("LeaveGame");
      this.$parent.Game = undefined;
    },
    StartGame: function () {
      socket.emit("StartGame");
    },
    Copy: async function () {
      try {
        navigator.clipboard.writeText(this.$parent.Game.code);
        this.$buefy.toast.open({
          message: "Code de partie copié",
          type: "is-info",
        });
      } catch (error) {
        this.$buefy.toast.open({
          message: "Erreur lors de la copie",
          type: "is-danger",
        });
        console.log(error);
      }
    },
  },
};
</script>

<style>
.main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  min-height: 100vh;
}
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.mid {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  align-items: center;
  flex-grow: 1;
  flex-wrap: wrap;
}
p {
  color: black;
}
.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}
.playerlist {
  background-color: #454647;
  width: 700px;
  border-radius: 7px;
}
.param {
  background-color: #454647;
  width: 700px;
  border-radius: 7px;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}
.title {
  text-align: center;
  color: white;
}
.playericons {
  width: 90px;
}
.playername {
  text-align: center;
}
.users {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.user {
  padding: 10px;
}
.user p {
  color: white;
}
@media (max-width: 700px) {
  .playerlist {
    width: 100%;
  }
}
</style>
