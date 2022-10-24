<template>
  <div>
    <Profil v-if="connected && Game == undefined" />
    <Classement v-else-if="Classement != undefined"/>
    <Lobby v-else-if="Game != undefined && Game.status == 'Lobby'"/>
    <Game v-else-if="Game != undefined && Game.status == 'InGame'"/>
    
    <Disconnected v-else />
  </div>
</template>

<script>
import Disconnected from "../components/Disconnected.vue";
import Profil from "../components/Profil.vue";
var socket;
export default {
  name: "IndexPage",
  data: function () {
    return {
      connected: true,
      socket:"oui",
      Game: undefined,
      Question : undefined,
      Gr: undefined,
      Classement:undefined
    };
  },
  beforeMount() {
    socket = io();
    this.socket = socket
    socket.on("connect", (socket) => {
      this.connected = true;
      console.log("Connectée....");
    });
    socket.on("disconnect", (socket) => {
      this.connected = false;
      Game = undefined
      console.log("Vous n'êtes plus connecté au serveur merci patienter.");
    });
    socket.on("UpdateLobby", (data) => {
      console.log("Update Lobby");
      console.log(data);
      this.$buefy.toast.open({
        message: data.message,
        type: data.type,
      });

      this.Game = data.Game;
    });
  },
  components: { Disconnected, Profil },
};
</script>
