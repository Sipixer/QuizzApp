<template>
  <div class="fl">
    <div class="middle">
      <div class="box playercard">
        <div class="title">JOUER</div>
        <div style="padding: 20px">
          <ssr-carousel show-arrows show-dots @change="logEvent($event)">
            <div class="slide" v-for="i in 10" :key="i">
              <b-image
                :src="require('@/assets/avatars/' + i + '.png')"
                style="padding: 40px"
              ></b-image>
            </div>
          </ssr-carousel>
        </div>
        <div class="pseudo">
          <input
            v-model="pseudo"
            type="text"
            name="Pseudo"
            id="pseudo"
            placeholder="Pseudo"
            maxlength="100"
            autocomplete="off"
          />
          <b-button
            type="is-danger"
            @click="createPrivateGame"
            :disabled="loading"
          >
            Créer une partie privé
          </b-button>
          <b-button type="is-info" @click="joinPrivateGame" :disabled="loading">
            Rejoindre une partie privé
          </b-button>
        </div>
      </div>

      <div class="buttons help">
        <b-button type="is-success" @click="help"> Aide </b-button>
        <b-button type="is-warning" @click="question">
          Proposer une question
        </b-button>
        <b-button type="is-link" @click="rules"> Règles </b-button>
      </div>

      <div class="appstore" v-if="false">
        <b-tooltip label="En développement..." class="store">
          <b-image
            :src="require('@/assets/img/Download_on_the_App_Store_Badge.png')"
            alt="Download_on_the_App_Store"
          ></b-image>
        </b-tooltip>

        <b-tooltip label="En développement..." class="store"
          ><b-image
            :src="require('@/assets/img/google-play-badge.png')"
            alt="Download_on_the_App_Store"
          ></b-image
        ></b-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
var socket;
export default {
  mounted() {
    socket = this.$parent.socket;
    socket.on("GameCreated", (data) => {
      if (data.create) {
        this.$buefy.toast.open(data.message);
        socket.emit("JoinGame", {
          code: data.code,
          User: { Username: this.pseudo, PlayerIcon: this.index },
        });
      } else {
        console.log(data.message);
        this.$buefy.toast.open({
          duration: 5000,
          message: data.message,
          type: "is-danger",
        });
        this.loading = false;
      }
    });

    socket.on("JoinedGame", (data) => {
      console.log(data);
      if (!data.joined) {
        this.$buefy.toast.open({
          duration: 5000,
          message: data.message,
          type: "is-danger",
        });
        this.loading = false;
        return;
      }

      this.$parent.Game = data.Game;
    });
  },
  data() {
    return {
      pseudo: "",
      index: 1,
      loading: false,
    };
  },

  methods: {
    logEvent(index) {
      this.index = index.index + 1;
    },
    rules() {
      this.$buefy.dialog.alert({
        title: "Règles",
        message: "Testez votre culture entre amis.",
        type: "is-info",
        ariaRole: "alertdialog",
        ariaModal: true,
      });
    },
    help() {
      console.log(socket.id);
      this.$buefy.dialog.alert({
        title: "Aides",
        message:
          "Pour tout aides ou rapport de bug merci de me contacter sur discord: <b>Sipixer#8715 </b>.",
        type: "is-info",
        ariaRole: "alertdialog",
        ariaModal: true,
      });
    },
    question() {
      this.$buefy.dialog.alert({
        title: "Proposition de question",
        message:
          "Le systeme d'ajout de question comunautaire est en cours de dévelopement.<br>Merci de me contacter sur discord si vous avez une idée de question ou des sugestion. <br><b>Sipixer#8715 </b>.",
        type: "is-info",
        ariaRole: "alertdialog",
        ariaModal: true,
      });
    },
    createPrivateGame() {
      if (this.pseudo.length < 2) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Pseudo non <b>valide</b>`,
          position: "is-bottom",
          type: "is-danger",
        });
        return;
      }
      this.loading = true;
      this.$buefy.toast.open(`Création de la partie en cours...`);
      socket.emit("CreateGame");
    },
    joinPrivateGame() {
      if (this.pseudo.length < 2) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Pseudo non <b>valide</b>`,
          position: "is-bottom",
          type: "is-danger",
        });
        return;
      }

      this.$buefy.dialog.prompt({
        message: `Specifiez le code de la partie privé.`,
        inputAttrs: {
          placeholder: "ex: AB53MP",
        },
        trapFocus: true,
        onConfirm: (value) => {
          socket.emit("JoinGame", {
            code: value,
            User: { Username: this.pseudo, PlayerIcon: this.index },
          });
          this.$buefy.toast.open(`Connexion a la partie en cours...`),
            (this.loading = true);
        },
      });
    },
  },
};
</script>

<style>
.fl {
  display: flex;
  justify-content: space-around;
  align-content: space-around;
  flex-direction: row;
  min-height: 100vh;
}
.title {
  text-align: center;
  color: white;
}
.appstore {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
}
.middle {
  width: 375px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
  align-content: center;
  justify-content: center;
}
.store {
  flex: 1 1 0px;
}
.help {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.playercard {
  background-color: #d99b77;
}
.pseudo {
  align-items: center;
  width: 90%;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-direction: column;
}
.pseudo input {
  width: 70%;
  text-align: center;
  font-size: larger;
  background: transparent;
  outline: 0;
  border-width: 0 0 2px;
}
.pseudo input:focus {
  outline: none !important;
}
.modal-card-body {
  color: black;
}
</style>
