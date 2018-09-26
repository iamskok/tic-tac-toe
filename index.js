const path = require('path');
const http = require('http');

const express = require('express');
const app = express();

const server = http.Server(app);
const io = require('socket.io')(server);

let field = [
	['e', 'e', 'e'],
	['e', 'e', 'e'],
	['e', 'e', 'e']
];

let turn = 'c';

function getWinner(field) {
	for (let i = 0; i < field.length; i++) {
		const s = field[i].join('');
		const c = Array(field[i].length).fill('c').join('');
		const z = Array(field[i].length).fill('z').join('');
		if (s === z) {
			return 'z';
		}
		if (s === c) {
			return 'c';
		}
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

			const winner = getWinner(field);

			answer.winner = winner;
			answer.field = field;
			answer.success = true;
		} else {
			answer.success = false;
		}

		socket.emit('action', answer);
	});
});

server.listen(5000, () => {
	console.log('Server started');
});
