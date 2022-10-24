const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var GameList = {};
var QuestionList = GetAllQuestion();
io.on("connection", (socket) => {
  console.log("[+] " + socket.id);
  socket.on("disconnect", (socket) => {
    console.log("[-] user");
  });

  socket.on("CreateGame", () => {
    var randomNumber = Math.random().toString(36).slice(2, 7).toUpperCase();
    if (GameList[randomNumber] == undefined) {
      GameList[randomNumber] = new Gculture(randomNumber);
      socket.emit("GameCreated", {
        create: true,
        code: randomNumber,
        message: "Connexion a la partie en cours...",
      });
      console.log("Partie crée: " + randomNumber);
    } else {
      console.log("Erreur lors de la création de la partie: Partie existante.");
      socket.emit("GameCreated", {
        create: false,
        code: randomNumber,
        message: "Erreur lors de la création de la partie merci de ressayer.",
      });
    }
  });
  socket.on("JoinGame", (data) => {
    var game = GameList[data.code];
    if (game == undefined) {
      console.log("Partie non trouvé :" + data.code);
      socket.emit("JoinedGame", {
        joined: false,
        Game: undefined,
        message: "Partie non trouvé.",
      });
      return;
    }
    data.User.socket = socket;
    data.User.score = 0;
    data.User.repondu = false;
    var test = game.Join(data.User);
    socket.emit("JoinedGame", test);
  });
});
var port = 3021;

server.listen(port, () => {
  console.log("listening on *:" + port);
});

class Gculture {
  status = "Lobby";
  players = [];
  maxquestion = 25;

  Question = {
    number: 0,
    Question: "****",
    Posibilite: ["**"],
  };
  Gr = -1;
  ReponseL = [];
  constructor(code) {
    this.code = code;
  }
  Join(User) {
    if (this.players.includes(User)) {
      console.log("Erreur, joueur deja dans la partie");
      return { joined: false, message: "Tu es déja dans la partie." };
    }
    if (this.status != "Lobby") {
      return {
        joined: false,
        message:
          "La partie a déja été lancer tu ne peux pas la rejoindre en cours.",
      };
    }

    this.players.push(User);
    io.to(this.code).emit("UpdateLobby", {
      Game: this.GameObject(),
      message: User.Username + " a rejoint la partie.",
      type: "is-success",
    });
    User.socket.join(this.code);

    User.socket.on("disconnect", () => {
      if (User.socket.rooms.has(this.code) || this.players.includes(User))
        this.Leave(User);
    });
    User.socket.on("LeaveGame", () => {
      if (User.socket.rooms.has(this.code) || this.players.includes(User))
        this.Leave(User);
    });
    User.socket.on("StartGame", () => {
      if (User.socket.rooms.has(this.code)) this.Start();
    });
    User.socket.on("ReponseQuestion", (data) => {
      if (User.socket.rooms.has(this.code)) {
        User.repondu = true;
        this.ReponseL.push({ user: User, Reponse: data.Reponse });
        var LittleGameObject = this.GameObject();
        io.to(this.code).emit("UpdateIGPlayerStatus", {
          Game: LittleGameObject,
        });
        if (LittleGameObject.players.every((p) => p.repondu)) {
          setTimeout(() => {
            io.to(this.code).emit("GoodReponseIs", { Gr: this.Gr });
            setTimeout(() => {
              for (const r of this.ReponseL) {
                if (r.Reponse == this.Gr) {
                  r.user.score = r.user.score + 10;
                }
              }

              io.to(this.code).emit("UpdateIGPlayerStatus", {
                Game: this.GameObject(),
              });
              setTimeout(() => {
                this.NextQuestion();
              }, 2000);
            }, 2000);
          }, 2000);
        }
      }
    });
    return { joined: true, Game: this.GameObject() };
  }
  Leave(User) {
    this.players = arrayRemove(this.players, User);
    User.socket.leave(this.code);
    io.to(this.code).emit("UpdateLobby", {
      Game: this.GameObject(),
      message: User.Username + " a quitté la partie.",
      type: "is-danger",
    });
    if (this.players.length == 0) {
      console.log("Suppression de la partie " + this.code);
      delete GameList[this.code];
    }
  }
  PlayerListN() {
    var PlayerL = [];
    for (const p of this.players) {
      PlayerL.push({
        Username: p.Username,
        PlayerIcon: p.PlayerIcon,
        score: p.score,
        repondu: p.repondu,
      });
    }
    return PlayerL;
  }
  GameObject() {
    return {
      code: this.code,
      status: this.status,
      players: this.PlayerListN(),
      maxquestion: this.maxquestion,
    };
  }
  Start() {
    if (this.status == "Lobby") {
      this.status = "InGame";
      this.SetRandomQuestion();
      io.to(this.code).emit("GameStarting", {
        starting: true,
        Game: this.GameObject(),
        Question: this.Question,
      });
    } else {
      io.to(this.code).emit("GameStarting", {
        starting: false,
        message: "Cette partie est déja en cours...",
        Game: this.GameObject(),
      });
    }
  }
  NextQuestion() {
    if (this.Question.number + 1 > this.maxquestion) {
      console.log("FIN DE PARTIE");
      this.status = "End";
      this.Classement();
      io.to(this.code).emit("Classement", this.Classement());
      return;
    }

    console.log("Envoie d'une nouvelle question.");
    this.SetRandomQuestion();
    this.ReponseL = [];
    for (const p of this.players) {
      p.repondu = false;
    }
    io.to(this.code).emit("NewQuestion", { Question: this.Question });
    io.to(this.code).emit("UpdateIGPlayerStatus", { Game: this.GameObject() });
  }
  SetRandomQuestion() {
    if (QuestionList == 0) {
      QuestionList = GetAllQuestion();
    }
    var Rn = Math.floor(Math.random() * QuestionList.length);
    var Question = QuestionList[Rn];
    console.log(Question);
    this.Gr = Question.Posibilite.indexOf(Question.Grn);
    Question.Grn = undefined;
    Question.number = this.Question.number + 1;
    this.Question = Question;
    console.log(this.Question);
    QuestionList = arrayRemove(QuestionList, Question);
    console.log(QuestionList.length);
  }
  Classement() {
    var Classement = [];
    for (const p of this.players) {
      Classement.push({
        score: p.score,
        Username: p.Username,
        PlayerIcon: p.PlayerIcon,
      });
    }

    return Classement.sort((a, b) => b.score - a.score);
  }
}

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}
function GetAllQuestion() {
  const fs = require("fs");

  var ListQuestion = [];
  var ListTitre = [];
  fs.readdirSync("./Question").forEach((fn) => {
    var file = JSON.parse(fs.readFileSync("./Question/" + fn));
    var Nom = file["catégorie-nom-slogan"].fr.nom;
    ListTitre.push(Nom);
    for (const Question of file.quizz.fr.débutant) {
      ListQuestion.push({
        Question: Question.question,
        Posibilite: Question.propositions,
        Grn: Question.réponse,
      });
    }
  });

  return ListQuestion;
}
