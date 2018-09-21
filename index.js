const path = require('path');
const http = require('http');

const express = require('express');
const app = express();

const server = http.Server(app);
const io = require('socket.io')(server);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.use((socket, next) => {
	let token = socket.handshake.query.token;
	console.log('WEBSOCKET MIDDLEWARE!!!', token);
	return next();
});

io.on('connection', function(socket) {
	console.log('WEB SOCKET!!!!!!');
	setTimeout(() => {
		socket.emit('new-data', {a: 1, b: 2, c: 'all', d: true});
	}, 2000);
});

server.listen(5000, () => {
	console.log('server started!');
});
