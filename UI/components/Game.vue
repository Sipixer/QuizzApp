<template>
  <div class="mai">
    <div class="QuesionTitle">
      <h1>QUESION N°{{ $parent.Question.number }}/{{$parent.Game.maxquestion}}</h1>
      <h2>{{ $parent.Question.Question }}</h2>
    </div>

    <div class="reponses">
      <div
        class="reponse"
        @click="SelectReponse($parent.Question.Posibilite.indexOf(reponse))"
        v-for="reponse in $parent.Question.Posibilite"
        :key="reponse"
        v-bind:class="{
          selected: Reponse == $parent.Question.Posibilite.indexOf(reponse),mauvaise: $parent.Gr != $parent.Question.Posibilite.indexOf(reponse)&&  $parent.Gr!= undefined,bonne: $parent.Gr == $parent.Question.Posibilite.indexOf(reponse)
        }"
      >
        <p>{{ reponse }}</p>
      </div>
    </div>
    <div class="IGPlayers">
      <div class="player"  v-for="player in $parent.Game.players"
        :key="player.Username">
          <b-image
            :src="require('@/assets/avatars/' + player.PlayerIcon + '.png')"
            class="playericons"
          ></b-image>

        <div class="pstat">
            <p>{{player.Username}}</p>
            <p>Score: {{player.score}}</p>
            <p v-if="player.repondu">✔️</p>
            <p v-else>❌</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var socket;
export default {
  mounted() {
    socket = this.$parent.socket;
    socket.on("UpdateIGPlayerStatus",(data)=>{
        this.$parent.Game = data.Game
    })
    socket.on("GoodReponseIs",(data)=>{
        this.$parent.Gr = data.Gr
        this.Reponse = -1
    })
    socket.on("NewQuestion",(data)=>{
        this.$parent.Gr = undefined
        this.Reponse = undefined
        this.$parent.Question = data.Question
    })
    socket.on("Classement",(data)=>{
        this.$parent.Classement = data
    })
  },
  data() {
    return {
      Reponse: undefined,
    };
  },
  methods: {
    SelectReponse(Rep) {
      if (this.Reponse == undefined) {
        this.Reponse = Rep;
        socket.emit("ReponseQuestion", { Reponse: Rep });
      }
    },
  },
};
</script>

<style>
.mai {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  align-items: center;
}
.QuesionTitle {
    padding-top: 100px;
  text-align: center;
  font-size: 32px;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.reponses {
  display: flex;
  flex-wrap: wrap;
  width: 50%;
}

.reponse {
  display: flex;
  flex: 1 0 40%; /* explanation below */
  margin: 5px;
  height: 100px;
  background-color: rgb(199, 199, 255);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  font-size: 22px;
}
.selected {
  background-color: rgb(42, 78, 236);
}
.mauvaise {
  background-color: rgb(253, 53, 53);
}
.bonne {
  background-color: rgb(0, 182, 30);
}
.reponse p {
  vertical-align: middle;
  text-align: center;
  color: black;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.pstat{
    text-align: center;
    
}
.IGPlayers{
    display: flex;
    justify-content: center;
    justify-self: center;
    gap: 20px;
    width: 100%;
}


</style>