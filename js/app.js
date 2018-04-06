/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points (default) on GLOBAL score wins the game
- A player looses his ENTIRE score when he rolls two 6. After that, it's the next player's turn.
- Use the input field to set a different winning score.
*/

var scores, roundScore, activePlayer, gamePlaying, winningScore, playerName0, playerName1;

// Button Roll dices
document.querySelector('.btn-roll').addEventListener('click', function(){
	if(gamePlaying){
		// 1. Random number
		var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    //2. Display the result
    document.getElementById('dice-1').style.display = 'block';
    document.getElementById('dice-2').style.display = 'block';
    document.getElementById('dice-1').src = 'img/dice-' + dice1 + '.png';
    document.getElementById('dice-2').src = 'img/dice-' + dice2 + '.png';

    // 3. Update the score if the rolled numbers were 6 on both dices
    if(dice1 === 6 && dice2 === 6){
			document.getElementById('score-'+activePlayer).textContent = scores[activePlayer] = 0;
			nextPlayer();
		// 4. Update the round score if the rolled numbers were NOT a 1
		} else if (dice1 !== 1 && dice2 !== 1) {
      //Add score
      roundScore += dice1 + dice2;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
    	// If you got a 1 in any of the dices is next player turn!
    	nextPlayer();
    }
	}
});

// Button Hold
document.querySelector('.btn-hold').addEventListener('click', function(){
	if(gamePlaying){
		// Add CURRENT score to GLOBAL score
		scores[activePlayer] += roundScore;
		// Updates the UI
		document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];
		// Check if player won the game
		if(scores[activePlayer] >= winningScore){
			document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
			document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
			document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
			hide();
			gamePlaying = false;
		} else {
		 nextPlayer();
		}
	}
});

// Button New Game
document.querySelector('.btn-new').addEventListener('click', init);

// Button Menu
document.querySelector('.btn-menu').addEventListener('click', function(){
	document.querySelector('.main-panel').style.display = 'block';
});

// Button Resume game
document.querySelector('.btn-resume').addEventListener('click', function(){
	document.querySelector('.main-panel').style.display = 'none';
});

// Initialize the game
function init(){
	scores = [0,0];
	roundScore = 0;
	activePlayer = 0;
	gamePlaying = true;
	// previousRoll = 0;
	playerName0 = document.querySelector('#playerName0').value;
	playerName1 = document.querySelector('#playerName1').value;
	var finalScore = document.querySelector('.final-score').value;

  finalScore ? winningScore = finalScore : winningScore = 100;

  playerName0 ? document.getElementById('name-0').textContent = playerName0 : document.getElementById('name-0').textContent = playerName0 = 'Player 1';
  playerName1 ? document.getElementById('name-1').textContent = playerName1 : document.getElementById('name-1').textContent = playerName1 = 'Player 2';

	hide();
	document.getElementById('score-0').textContent = 0;
	document.getElementById('score-1').textContent = 0;
	document.getElementById('current-0').textContent = 0;
	document.getElementById('current-1').textContent = 0;

	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');
	document.querySelector('.main-panel').style.display = 'none';
}

// Change player
function nextPlayer(){
	roundScore = 0;
	document.getElementById('current-' + activePlayer).textContent = roundScore;

	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	if(activePlayer === 0){
		document.querySelector('#turnPlayer').textContent = playerName0 + ' turn';
	} else {
		document.querySelector('#turnPlayer').textContent = playerName1 + ' turn';
	}
	document.querySelector('.turn').style.opacity = '1';
	window.setTimeout(hide,1500);
}

// Hide dices for all the scenarios
function hide(){
	document.getElementById('dice-1').style.display = 'none';
  document.getElementById('dice-2').style.display = 'none';
  document.querySelector('.turn').style.opacity = '0';
}
