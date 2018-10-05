import React, { Component } from 'react';
import './styles.css';

import Message from '../Message';

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
							<Message
								id={index}
								key={index} 
								username={item.username} 
								body={item.message}
								removeMessage={this.props.removeMessage}
							/>
						)
					}
				</div>
			</div>
		)
	}
}
