<template>
  <div class="hori">
    <div class="vert">
      <div class="Joueurs">


        <div class="Joueur" v-for="p in $parent.Classement" :key="p.Username">
          <div class="position">{{$parent.Classement.indexOf(p)+1}}</div>
          <div class="playerimg">
            <b-image :src="require('@/assets/avatars/' +p.PlayerIcon + '.png')"></b-image>
          </div>
          <div class="pstat">
            <div>{{p.Username}}</div>
            <div>Score: {{p.score}}</div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<style>
.hori {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
    -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.vert {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.Joueurs {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 60%;
}
.Joueur {
  background-color: rgb(145, 145, 145);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
  padding: 10px;
  border-radius: 10px;
  font-size: 25px;
}

.playerimg {
  width: 80px;
}
.position {
  font-size: 30px;
  padding: 25px
}
.pstat{
    padding-left: 20px;
    padding-right: 20px;
}
</style>