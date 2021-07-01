let player1Loc = 0,
	player2Loc = 0,
	currentPlayerLoc = 0;

let player1Score = 0,
	player2Score = 0,
	currentPlayerScore = 0;

//0 is single and 1 is multiple mode
const PLAY_MODE_SINGLE = 0;
const PLAY_MODE_MULTIPLE = 1;
let playMode = PLAY_MODE_SINGLE;

let player1Name = '',
	player2Name = 'Computer',
	currentPlayerName = '';

//0 is player1 turn and 1 is player2 turn
const PLAYER1_TURN = 0;
const PLAYER2_TURN = 1;
let turn = PLAYER1_TURN;

const WINNING_SCORE = 100;

let playerColorArr = ['BLACK', 'BROWN', 'GREEN', 'RED'];
let playerColorHexArr = ['#7400B8', '#8F6700', '#008F28', '#FF0606'];

let player1Color = playerColorArr[0];
let player2Color = playerColorArr[1];
let currentPlayerColor = '';

let dice_value = 0;

let ladderMap;
let snakeMap;

const LADDER_START = 5;
const LADDER_END = 80;

const SNAKE_START = 3;
const SNAKE_END = 90;

const EVENT_PLAYER_TURN = 0;
const EVENT_PLAYER_MOVE = 1;
const EVENT_PLAYER_NO_MOVE = 2;
const EVENT_SNAKE = 3;
const EVENT_LADDER = 4;
const EVENT_COMPUTER_TURN = 5;
const EVENT_SORRY_WIN = 6;
const EVENT_WINNER = 7;
const EVENT_DICE_VALUE = 8;

let eventArray = [
	"<p>'s turn to roll Dice!!",
	"Moving player <p>'s dice to <span class='flashing_board'><y></span>",
	"Movement of player <p>'s dice to <y> not possible, wait for next turn",
	"Ouch!! <span class='flashing_board'>Snake</span>, lets see it takes you where",
	'WoooooooW!! found my Ladder of success',
	'Computer going to Roll Dice!!',
	'SORRY!! You are just a step away from win. Wait for your next turn',
	"CONGRATULLATIONS <span class='flashing_board'><p></span> for winning this game",
	"Dice rolled <span class='flashing_board'><dice_value></span>",
];

/**
 * Method to start fresh game. it resets all panels.
 */
const startNewGame = () => {
	snakeMap = new Map();
	ladderMap = new Map();
	turn = PLAYER1_TURN;

	player1Loc = 0;
	player2Loc = 0;
	dice_value = 0;

	createBoard();
	prepareLadderMap();
	prepareSnakeMap();
	plotSnakesAndLadders();
	resetDice();

	setPlayerColors();

	currentPlayerColor = player1Color;
	currentPlayerLoc = player1Loc;
	currentPlayerName = player1Name;
	currentPlayerScore = player1Score;

	generateEvent(EVENT_PLAYER_TURN);
};

/**
 * Method creates board with 100 boxes. invoked in case of fresh game
 */
const createBoard = () => {
	const parent = document.getElementById('steps_div');
	if (parent.hasChildNodes()) {
		parent.innerHTML = '';
	}
	for (let index = 100; index >= 1; index--) {
		const node = document.createElement('div');
		node.innerHTML = index;
		node.setAttribute('class', 'board_class');
		node.setAttribute('id', 'board_' + index);
		parent.appendChild(node);
	}
};

/**
 * Method to select token color for users. also score color is set.
 * method is invoked in case of fresh game
 */
const setPlayerColors = () => {
	const value = uniqueNumber(0, 3);
	player1Color = playerColorArr[value];
	document.getElementById('player1_score').innerHTML = player1Score;
	document.getElementById('player1_score').style.color =
		playerColorHexArr[value];

	let value2 = uniqueNumber(0, 3);

	if (value == value2) {
		playerColorArr.forEach((element, index) => {
			if (value != index) {
				value2 = index;
			}
		});
	}

	player2Color = playerColorArr[value2];
	document.getElementById('player2_score').innerHTML = player2Score;
	document.getElementById('player2_score').style.color =
		playerColorHexArr[value2];

	const pl1 = document.getElementById('token_player1');
	pl1.innerHTML = '';
	pl1.appendChild(createTokenWithColor(player1Color));

	const pl2 = document.getElementById('token_player2');
	pl2.innerHTML = '';
	pl2.appendChild(createTokenWithColor(player2Color));
};

/**
 * method to create token with specified color.
 *
 * @param {String} color color with which div is created
 */
const createTokenWithColor = (color) => {
	const player1Img = document.createElement('img');
	player1Img.setAttribute(
		'src',
		'https://gitforharpreet.github.io/SnakesnLadder/images/' +
			color + '.png'
	);
	player1Img.setAttribute('id', color);
	player1Img.classList.add('token');
	return player1Img;
};

/**
 * Method to handle launch game action from UI. This hides old view
 * and adds game board and score components to UI.
 */
const launchGame = () => {
	const player1 = document.getElementById('input_player1');
	const player2 = document.getElementById('input_player2');

	if (player1.value === '') {
		alert('Plesae enter player name');
		return false;
	}
	if (playMode == PLAY_MODE_MULTIPLE && player2.value === '') {
		alert('Plesae enter player name');
		return false;
	}

	player1Name = player1.value;
	player2Name = player2.value === '' ? 'Computer' : player2.value;
	startNewGame();

	document.getElementById('player1_name').innerText = player1Name;
	document.getElementById('player2_name').innerText = player2Name;

	document.getElementById('player_details_div').style.display = 'none';

	document.getElementById('steps_div').style.display = 'flex';
	document.getElementById('score_div').style.display = 'flex';

	document.getElementById('launch_btn').style.display = 'none';
};

/**
 * Method to generate events for actions done.
 * This is pushed to UI
 *
 * @param  {...any} id list of events to be generated
 */
const generateEvent = (...id) => {
	let y = currentPlayerLoc + dice_value;
	let content = '';

	let event;
	id.forEach((element) => {
		event = eventArray[element];
		event = event
			.replace('<p>', currentPlayerName)
			.replace('<y>', y)
			.replace('<dice_value>', dice_value);
		content = content + '</br>' + event;
	});

	document.getElementById('dice_output').innerHTML = content;
};

/**
 * Method to handle action for start game action from UI
 */
const startGame = () => {
	document.getElementById('player_mode_div').style.display = 'flex';
	document.getElementById('start_btn_div').style.display = 'none';
};

/**
 * Method to handle action for next action from UI.
 * It plots player name selection component on UI
 */
const showNext = () => {
	const single = document.getElementById('mode_single');
	const multiple = document.getElementById('mode_multiple');
	if (single.checked == false && multiple.checked == false) {
		alert('Please select mode to proceed');
		return false;
	}
	playMode = single.checked == true ? PLAY_MODE_SINGLE : PLAY_MODE_MULTIPLE;
	document.getElementById('player_mode_div').style.display = 'none';
	document.getElementById('player_details_div').style.display = 'flex';

	if (playMode == PLAY_MODE_SINGLE) {
		document.getElementById('input_player2').value = 'Computer';
		document.getElementById('input_player2').disabled = true;
	}
};

/**
 * Method to reset dice. it adds child to dice
 */
const resetDice = () => {
	const myNode = document.getElementById('dice');
	myNode.innerHTML = '';
	const playH2 = document.createElement('h2');
	playH2.innerText = 'Play!!';
	playH2.setAttribute('id', 'dice_play_id');
	playH2.classList.add('dice_play');

	myNode.classList.remove('dice_animate');
	myNode.appendChild(playH2);
	console.log('Dice reset completed');
};

/**
 * Method to handle roll dice action from UI.
 * Random value is generated and dots are plotted on UI.
 * It initiates token movement, checking winner, score updates etc...
 *
 */
const rollDice = () => {
	dice_value = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

	const myNode = document.getElementById('dice');

	if (myNode.hasChildNodes) {
		myNode.removeChild(myNode.firstChild);
	}

	console.log('Dice rolled by ', currentPlayerName);
	myNode.classList.add('dice_animate');

	setTimeout(() => {
		for (let index = 1; index <= dice_value; index++) {
			const node = document.createElement('div');
			node.setAttribute('class', 'dice_dot');
			myNode.appendChild(node);
		}
		moveToken(dice_value, EVENT_DICE_VALUE);

		setTimeout(() => {
			checkForSnakeLadder();
			const found = checkWinner();
			if (found == false) {
				switchTurn();
				enableDice();
			}
		}, 3000);
	}, 1500);

	return false;
};

/**
 * Methid to switch user turn
 */
const switchTurn = () => {
	if (turn == PLAYER1_TURN) {
		currentPlayerColor = player2Color;
		currentPlayerLoc = player2Loc;
		currentPlayerName = player2Name;
		currentPlayerScore = player2Score;
		turn = PLAYER2_TURN;
	} else {
		currentPlayerColor = player1Color;
		currentPlayerLoc = player1Loc;
		currentPlayerName = player1Name;
		currentPlayerScore = player1Score;
		turn = PLAYER1_TURN;
	}
	console.log('Turn switched ', turn);
};

/**
 * Method to check if current user is winner.
 * it updates score, asks for game continuation
 * confirmation to user
 */
const checkWinner = () => {
	console.log('Checking winner ', currentPlayerLoc);

	let retVal = false;
	if (currentPlayerLoc == WINNING_SCORE) {
		retVal = true;
		setTimeout(() => {
			generateEvent(EVENT_WINNER);

			if (turn == PLAYER1_TURN) {
				player1Score += 1;
				currentPlayerScore = player1Score;
				document.getElementById(
					'player1_score'
				).innerText = currentPlayerScore;
			} else {
				player2Score += 1;
				currentPlayerScore = player2Score;
				document.getElementById(
					'player2_score'
				).innerText = currentPlayerScore;
			}
			setTimeout(() => {
				alert('Congratullations WINNER!! ', currentPlayerName);
				let option = confirm('Do you want to Play another GAME!!');
				if (option) {
					startNewGame();
				} else {
					window.location = 'index.html';
				}
			}, 1000);
		}, 1000);
	}
	return retVal;
};

/**
 * Method to enable dice after delay of 3 secs.
 */
const enableDice = () => {
	setTimeout(() => {
		generateEvent(EVENT_PLAYER_TURN);
		resetDice();
		computerTurn();
	}, 2000);
};

/**
 * Method handles rolling of dice in case user is computer
 */
const computerTurn = () => {
	if (turn == PLAYER2_TURN && playMode == PLAY_MODE_SINGLE) {
		//bad fix to avoid clicking in case of computer's turn
		document.getElementById('dice').classList.add('dice_animate');
		setTimeout(() => {
			console.log("Time for computer's turn");
			generateEvent(EVENT_COMPUTER_TURN);

			document.getElementById('dice').classList.remove('dice_animate');
			setTimeout(() => {
				document.getElementById('dice').click();
			}, 100);
		}, 2000);
	}
};

/**
 * Method moves token to next location.
 * it also update current location of user
 *
 * @param {Number} move_value Steps token to be moved
 * @param {Number} event Event to generated
 */
const moveToken = (move_value, event) => {
	dice_value = move_value;
	const end = currentPlayerLoc + move_value;
	generateEvent(event, EVENT_PLAYER_MOVE);

	console.log('Going to move token ', end, ', move val ', move_value);

	const flag = move(currentPlayerLoc, end, currentPlayerColor);

	if (turn == PLAYER1_TURN) {
		if (flag == true) {
			player1Loc = end;
			currentPlayerLoc = end;
		}
	} else {
		if (flag == true) {
			player2Loc = end;
			currentPlayerLoc = end;
		}
	}
};

/**
 * Method checks for snake or ladder at current dice value.
 * In case found moveToken is initiated
 */
const checkForSnakeLadder = () => {
	//lets check for ladders
	console.log('Going to check snake/ladder user ', currentPlayerName);
	const ladder = ladderMap.get(currentPlayerLoc);
	console.log('My ladder is ', ladder);
	if (ladder != undefined) {
		console.log('Found ladder ', ladder);
		moveToken(ladder - currentPlayerLoc, EVENT_LADDER);
	} else {
		const snake = snakeMap.get(currentPlayerLoc);

		if (snake != undefined) {
			console.log('Found snake ', snake);
			moveToken(snake - currentPlayerLoc, EVENT_SNAKE);
		}
	}
};

/**
 *
 * @param {Number} start base location to start movement from
 * @param {Number} end location where token to be moved
 * @param {String} color color of current user
 */
const move = (start, end, color) => {
	if (end > WINNING_SCORE) {
		generateEvent(EVENT_SORRY_WIN);
		return false;
	}

	if (start == 0) {
		document.getElementById(color).remove();
		start = 1;
	}

	let node = document.getElementById(color);
	if (node != null) {
		document.getElementById(color).remove();
	}

	document
		.getElementById('board_' + end)
		.appendChild(createTokenWithColor(color));

	return true;
};

/**
 * Method to generate random number. it includes
 * min and max values
 *
 * @param {Number} min Minimum value for range
 * @param {Number} max Maximum value for range
 */
const uniqueNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Method to check if value exists in snake/ladder map
 * both key and values of map are verified
 *
 * @param {Number} value Value to be checked
 * @returns true in case value found
 */
const keyExists = (value) => {
	let retVal = false;

	for (let [key, entry] of ladderMap.entries()) {
		if (value == key || value == entry) {
			return true;
		}
	}

	for (let [key, entry] of snakeMap.entries()) {
		if (value == key || value == entry) {
			retVal = true;
			break;
		}
	}

	return retVal;
};

/**
 * Method to find unique number between input range.
 *
 * @param {Number} start Range starting value
 * @param {Number} end Range end value
 * @returns unique number
 */
const findUniqueNo = (start, end) => {
	let number = uniqueNumber(start, end);
	let i = 0;

	while (i < 10) {
		if (!keyExists(number)) {
			return number;
		}
		number = uniqueNumber(start, end);
	}
	return number + 1;
};

/**
 * Method to prepare unique ladder map.
 */
const prepareLadderMap = () => {
	let i = 0;

	while (i < 5) {
		const start = findUniqueNo(LADDER_START, LADDER_END);
		const end = findUniqueNo(start + 10, LADDER_END);
		i += 1;
		ladderMap.set(start, end);
		if (ladderMap.size == 5) {
			break;
		}
	}
};

/**
 * Method to prepare unique snake map
 */
const prepareSnakeMap = () => {
	let i = 0;

	while (i < 5) {
		const start = findUniqueNo(SNAKE_START, SNAKE_END);
		const end = findUniqueNo(start + 10, SNAKE_END);
		i += 1;
		snakeMap.set(end, start);
		if (snakeMap.size == 5) {
			break;
		}
	}
};

/**
 * Method to plot snakes n ladder map on UI
 */
const plotSnakesAndLadders = () => {
	for (let key of ladderMap.keys()) {
		const node = document.createElement('div');
		node.innerHTML = '?';
		node.classList.add('flashing_board');
		console.log('snake=', key);

		document.getElementById('board_' + key).appendChild(node);
	}

	for (let key of snakeMap.keys()) {
		const node = document.createElement('div');
		node.innerHTML = '?';
		node.classList.add('flashing_board');
		console.log('ladder=', key);
		document.getElementById('board_' + key).appendChild(node);
	}
};

const onLoad = () => {};
