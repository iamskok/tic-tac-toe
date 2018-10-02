import React, { Component } from 'react';
import io from 'socket.io-client';
import Field from '../Field';
import Chat from '../Chat';
import '../index.css';
import './styles.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			messages: []
		}

		this.handleItemClick = this.handleItemClick.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	handleItemClick(i, j) {
		this.socket.emit('action', [i, j]);
	}

	sendMessage(username, message) {
		this.socketChat.emit('new_message', {
			username,
			message
		});
	}

	componentDidMount() {
		const socket = io('http://localhost:5000?token=mysecrettoken1');
		this.socket = socket;
		
		socket.on('connect', () => {
			console.log('Server connected');
		});
		
		socket.on('load', (data) => {
			this.setState({
				data: [...data]
			});
			
			console.log('data = ', data);
		});

		socket.on('action', (data) => {
			const success = data.success;

			if (success) {
				const field = data.field;

				this.setState({
					data: field
				});

				if (data.winner) {
					setTimeout(() => {
						if (data.winner === 'c') {
							alert('❌❌❌ WON');
						} else if (data.winner === 'z') {
							alert('⭕️⭕️⭕️ WON');
						} else if (data.winner === 'd') {
							alert('❌/ ⭕️ DRAW');
						}
						
						socket.emit('get-field');
					}, 100);
				}
			}
		});

		socket.on('get-field', data => {
			this.setState({data});
		});

		socket.on('disconnect', function() {
			console.log('Server disconnected');
		});

		const socketChat = io('http://localhost:5000/chat?token=mysecrettoken1');
		this.socketChat = socketChat;
		socketChat.on('connect', () => {
			console.log('Socket chat connected');
		});
		socketChat.on('new_message', (obj) => {
			console.log('obj', obj);
			this.setState({
				messages: [...this.state.messages, obj]
			});
		});
	}

	render() {
		return (
			<div className="App">
				{
					this.state.data === null ?
					<div>Loading...</div> :
					<Field 
						data={this.state.data} 
						handleItemClick={this.handleItemClick}
					/>
				}
				
				<Chat 
					handleSubmit={this.sendMessage}
					messages={this.state.messages}
				/>
			</div>
		);
	}
}
