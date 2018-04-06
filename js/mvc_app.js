var gameController = (function(){
  var Player = function(name, score){
    this.name = name;
    this.score = score;
  }
  Player.prototype.updateScore = function(){

  }
  var data = {
    participants: [],
    dice: [0,0],
    roundScore: 0,
    activePlayer: 0,
    winningScore: 100,
    stillPlaying: true,
    grip: true
  }
  // Random number generator
  var rng = function(){
    return Math.floor(Math.random() * 6) + 1;
  }
  return {
    setWinScore: function(winScore){
      data.winningScore = winScore;
    },
    setPlayers: function(player1, player2){
      var p1, p2;
      p1 = new Player(player1, 0);
      p2 = new Player(player2, 0);
      data.participants = [p1, p2];
    },
    setScore: function(){
      data.participants[data.activePlayer].score += data.roundScore;
    },
    rollDices: function(){
      data.dice[0] = rng();
      data.dice[1] = rng();
      return {
        dice1: data.dice[0],
        dice2: data.dice[1]
      }
    },
    validateRoll: function(){
      data.grip = true;
      if(data.dice[0] === 1 && data.dice[1] === 1){
        data.participants[data.activePlayer].score = 0;
        return 'ones';
      } else if (data.dice[0] === data.dice[1]) {
        data.roundScore += data.dice[0] + data.dice[1];
        data.grip = false;
        return 'pairs';
      } else if(data.dice[0] !== 1 && data.dice[1] !== 1) {
        data.roundScore += data.dice[0] + data.dice[1];
        return 'add';
      } else {
        return 'next';
      }
    },
    getActivePlayer: function(){
      return data.activePlayer;
    },
    getPlayers: function(){
      return data.participants;
    },
    getRoundScore: function(){
      return data.roundScore;
    },
    nextPlayer: function(){
      data.roundScore = 0;
      data.activePlayer === 0 ? data.activePlayer = 1 : data.activePlayer = 0;
      return data.activePlayer;
    },
    checkVictory: function(){
      if(data.participants[data.activePlayer].score >= data.winningScore){
        data.stillPlaying = false;
        return true;
      } else {
        return false;
      }
    },
    canHold: function(){
      return data.grip;
    },
    playAgain: function(){
      data.stillPlaying = true;
    },
    stillPlaying: function(){
      return data.stillPlaying;
    },
    testing:  function(){
      console.log(data);
    }
  }
})();

var UIController = (function() {
  var DOMstrings = {
    btnHold: '.btn-hold',
    btnRoll: '.btn-roll',
    btnNew: '.btn-new',
    btnMenu: '.btn-menu',
    btnResume: '.btn-resume',
    mainPanel: '.main-panel',
    finalScore: '.final-score',
    notificationPanel: '.notif-panel',
    turnPlayer: 'turn-player',
    dice: function(num) {
      return 'dice-' + num;
    },
    score: function(num) {
      return 'score-' + num;
    },
    current: function(num) {
      return 'current-' + num;
    },
    name: function(num) {
      return 'name-' + num;
    },
    playerPanel: function(num) {
      return 'player-' + num + '-panel';
    },
    inputName: function(num) {
      return 'inputName-' + num;
    }
  }
  var updateMainPanel = function(){
    document.querySelector(DOMstrings.mainPanel).classList.toggle('hide-panel');
  }
  var hideNotification = function(){
    document.querySelector(DOMstrings.notificationPanel).style.opacity = '0';
  }
  return {
    getDOMstrings: function(){
      return DOMstrings;
    },
    getInput: function(){
      return {
        player1: document.getElementById(DOMstrings.inputName(0)).value,
        player2: document.getElementById(DOMstrings.inputName(1)).value,
        finalScore: document.querySelector(DOMstrings.finalScore).value
      }
    },
    displayDices: function(craps){
      document.getElementById(DOMstrings.dice(0)).src = 'img/dice-' + craps.dice1 + '.png';
      document.getElementById(DOMstrings.dice(1)).src = 'img/dice-' + craps.dice2 + '.png';
      document.getElementById(DOMstrings.dice(0)).style.display = 'block';
      document.getElementById(DOMstrings.dice(1)).style.display = 'block';
    },
    hideDices: function(){
      document.getElementById(DOMstrings.dice(0)).style.display = 'none';
      document.getElementById(DOMstrings.dice(1)).style.display = 'none';
      hideNotification();
    },
    initDisplay: function(){
      for(var i = 0; i < 2; i++){
        document.getElementById(DOMstrings.score(i)).textContent = 0;
        document.getElementById(DOMstrings.current(i)).textContent = 0;
        document.getElementById(DOMstrings.playerPanel(i)).classList.remove('winner');
        document.getElementById(DOMstrings.playerPanel(i)).classList.remove('active');
      }
      document.getElementById(DOMstrings.playerPanel(0)).classList.add('active');
      updateMainPanel();
    },
    updateDisplay: function(aPlayer, players){
      document.getElementById(DOMstrings.current(aPlayer)).textContent = 0;
      document.getElementById(DOMstrings.playerPanel(0)).classList.toggle('active');
      document.getElementById(DOMstrings.playerPanel(1)).classList.toggle('active');
      document.getElementById(DOMstrings.turnPlayer).textContent = players[aPlayer].name + ' turn!';
      document.querySelector(DOMstrings.notificationPanel).style.opacity = '1';
    	window.setTimeout(hideNotification, 2000);
    },
    notification: function(){
      document.getElementById(DOMstrings.turnPlayer).textContent = 'You got pairs, roll dices again!';
      document.querySelector(DOMstrings.notificationPanel).style.opacity = '1';
    	window.setTimeout(hideNotification, 2000);
    },
    updateMenu: updateMainPanel,
    updateCurrent: function(aPlayer, roundScore){
      document.getElementById(DOMstrings.current(aPlayer)).textContent = roundScore;
    },
    updateScore: function(aPlayer, score){
      document.getElementById(DOMstrings.score(aPlayer)).textContent = score;
    },
    win: function(aPlayer, players){
      document.getElementById(DOMstrings.name(aPlayer)).textContent = 'Winner!';
      document.getElementById(DOMstrings.playerPanel(aPlayer)).classList.add('winner');
      document.getElementById(DOMstrings.playerPanel(aPlayer)).classList.remove('active');
    },
    displayPlayerNames: function(p1, p2){
      document.getElementById(DOMstrings.name(0)).textContent = p1;
      document.getElementById(DOMstrings.name(1)).textContent = p2;
    }
  }
})();

var controller = (function(gmCtrl, UICtrl){
  var players;
  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();

    // Button New Game
    document.querySelector(DOM.btnNew).addEventListener('click', newGame);

    // Button Roll Dices
    document.querySelector(DOM.btnRoll).addEventListener('click', play);

    // Button Roll Dices
    document.querySelector(DOM.btnHold).addEventListener('click', hold);

    // Button Menu
    document.querySelector(DOM.btnMenu).addEventListener('click', UICtrl.updateMenu);

    // Button Resume game
    document.querySelector(DOM.btnResume).addEventListener('click', UICtrl.updateMenu);
  }

  var newGame = function(){
    var input;
    input = UICtrl.getInput();
    validateInput(input);
    gmCtrl.playAgain();
    UICtrl.initDisplay();
  }

  var play = function(){
    var craps, result, activePlayer, players, rScore;
    if(gmCtrl.stillPlaying()){
      // 1. roll dices
      craps = gmCtrl.rollDices();

      // 2. Update UI with result
      UICtrl.displayDices(craps);

      // 3. Validate the score
      result = gmCtrl.validateRoll(craps);
      activePlayer = gmCtrl.getActivePlayer();
      players = gmCtrl.getPlayers();
      switch (result) {
        case 'ones':
          UICtrl.updateScore(activePlayer, 0);
          UICtrl.updateCurrent(activePlayer, 0);
          activePlayer = gmCtrl.nextPlayer();
          UICtrl.updateDisplay(activePlayer, players);
          break;
        case 'pairs':
          rScore = gmCtrl.getRoundScore();
          UICtrl.updateCurrent(activePlayer, rScore);
          UICtrl.notification();
          break;
        case 'add':
          rScore = gmCtrl.getRoundScore();
          UICtrl.updateCurrent(activePlayer, rScore);
          break;
        default:
          UICtrl.updateCurrent(activePlayer, 0);
          activePlayer = gmCtrl.nextPlayer();
          UICtrl.updateDisplay(activePlayer, players);
      }
    }
  }

  var hold = function(){
    var activePlayer, players, victory;
    if(gmCtrl.stillPlaying() && gmCtrl.canHold()){
      activePlayer = gmCtrl.getActivePlayer();
      players = gmCtrl.getPlayers();
      gmCtrl.setScore();
      UICtrl.updateCurrent(activePlayer, 0);
      UICtrl.updateScore(activePlayer, players[activePlayer].score);
      victory = gmCtrl.checkVictory();
      if (victory){
        UICtrl.win(activePlayer, players);
      } else {
        activePlayer = gmCtrl.nextPlayer();
        UICtrl.updateDisplay(activePlayer, players);
      }
    }
  }

  var validateInput = function(input){
    if(input.finalScore) gmCtrl.setWinScore(input.finalScore);
    if(input.player1 && input.player2){
      gmCtrl.setPlayers(input.player1, input.player2);
      UICtrl.displayPlayerNames(input.player1, input.player2);
    } else {
      gmCtrl.setPlayers('Player 1', 'Player 2');
      UICtrl.displayPlayerNames('Player 1', 'Player 2');
    }
  }

  return {
    init: function(){
      console.log('Game started. Good luck :)');
      UICtrl.hideDices();
      setupEventListeners();
    }
  }
})(gameController,UIController);

controller.init();
