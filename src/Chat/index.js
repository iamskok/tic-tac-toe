import React, { Component } from 'react';
import './styles.css';

export default class Chat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			message: ''
		};

		this.handleClick = this.handleClick.bind(this);
		this.changeUsername = this.changeUsername.bind(this);
		this.changeMessage = this.changeMessage.bind(this);
	}

	ComponentDidMount() {
		const socket = io('http://localhost:5000?token=mysecrettoken1');
		this.socket = socket;
		socket.on('new message', (data) => {
			const submit = document.getElementById('chat-button').addEventListener('click', function() {
				const username = document.getElementById('username').value;
				const message = document.getElementById('message').value;

				const request = new XMLHttpRequest();
				request.addEventListener('load', function() {
					console.log('sent');
					console.log(this.responseText);
				});

				const q = Math.random();
				request.open('GET', 'http://localhost:5000/send?username=${username}&message=${message}&${q}');
				request.send();
			});

			(function() {
				let messages = [];

				function polling() {
					const request = new XMLHttpRequest();
					request.addEventListener('load', function() {
						const data = JSON.parse(this.responseText);
						messages = messages.concat(data);
						data.forEach(msg => {
							const username = msg.username;
							const message = msg.message;

							let html = document.getElementbyId('chat-history').innerHTML;
							const div = document.createElement('div');
							div.innerHTML = `${username}: ${message}`;
							document.getElementById('chat-history').appendChild(div);
						});

						polling();
					});

					let id;
					if (!meesages.length) {
						id = 0;
					} else {
						id = messages[messages.length - 1].id;
					}

					request.open('GET', `http://localhost:5000/chat?id=${id}`);
					request.send();
				}

				polling();
			})();
		});
	}

	handleClick(evt) {
		const username = this.state.username.trim();
		const message = this.state.message.trim();
		if (!username || !message) {
			return alert('Fill all required inputs!');
		}

		this.props.handleSubmit(username, message);
		this.setState({
			username: '',
			message: ''
		});
	}

	changeUsername(evt) {
		this.setState({
			username: evt.target.value
		});
	}

	changeMessage(evt) {
		this.setState({
			message: evt.target.value
		});
	}

	render() {
		return (
			<div className="Chat">
				<input 
					className="Chat-input" 
					type="text" 
					placeholder="Username" 
					value={this.state.username}
					onChange={this.changeUsername}
				/>
				<input 
					className="Chat-input"
					type="text" 
					placeholder="Message" 
					value={this.state.message}
					onChange={this.changeMessage}
				/>

				<button 
					className="Chat-button" 
					id="chat-button" 
					onClick={this.handleClick}>
					Send
				</button>
				
				<div className="Chat-history" id="chat-history">
					{
						this.props.messages.map((item, index) => 
							<div key={index}>
								{ item.username + ': ' + item.message }
							</div>
						)
					}
				</div>
			</div>
		)
	}
}
