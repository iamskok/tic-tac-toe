const path = require('path');
const http = require('http');

const express = require('express');
const app = express();

const server = http.Server(app);
const io = require('socket.io')(server);

let field, turn, turnNum;

// for 3 * 3 field
const SIZE = 3;
const crossString = Array(SIZE).fill('c').join('');
const zeroString = Array(SIZE).fill('z').join('');

function init() {
	turn = 'c';
	turnNum = 1;
	// generate 2D array with e's
	field = Array(SIZE).fill(0).map(item => Array(SIZE).fill('e'));
}

init();

function getWinner(field) {
	// horizontal match
	for (let i = 0; i < SIZE; i++) {
		const str = field[i].join('');
		
		if (str === zeroString) {
			return 'z';
		}
		if (str === crossString) {
			return 'c';
		}
	}
	// veritcal match
	for (let i = 0; i < SIZE; i++) {
		let str = '';
		for (let j = 0; j < SIZE; j++) {
			str += field[j][i];
		}
		if (str === zeroString) {
			return 'z';
		}
		if (str === crossString) {
			return 'c';
		}
	}
	// diagonal match
	let str1 = '';
	let str2 = '';
	for (let i = 0; i < SIZE; i++) {
		str1 += field[i][i];
		str2 += field[SIZE - i - 1][i];
	}
	if (str1 === zeroString || str2 === zeroString) {
		return 'z';
	}
	if (str1 === crossString || str2 === crossString) {
		return 'c';
	}

	if (!field.join().includes('e')) {
		return 'd';
	}
	
	return null;
}

app.use('/static', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.use((socket, next) => {
	let token = socket.handshake.query.token;
	console.log('Websocket middleware!!!', token);
	return next();
});

io.on('connection', function(socket) {
	console.log('Web socket');
	socket.emit('load', field);
	
	socket.on('get-field', function(data) {
		socket.emit('get-field', field);
	});

	socket.on('action', function(data) {
		const i = data[0];
		const j = data[1];
		const answer = {};

		if (field[i][j] === 'e') {
			field[i][j] = turn;
			
			if (turn === 'c') {
				turn = 'z'
			} else {
				turn = 'c'
			}

			let winner = null;
			// Check winner only after 6 turns
			if (turnNum >= (SIZE * 2 - 1)) {
				winner = getWinner(field);
			}
			
			console.log('winner', winner);

			answer.winner = winner;
			answer.field = field;
			answer.success = true;
			turnNum++;

			// if someone won start a new game
			if (['c','z','d'].includes(winner)) {
				init();
			}
		} else {
			answer.success = false;
		}

		io.emit('action', answer);
	});
});

server.listen(5000, () => {
	console.log('Server started');
});
