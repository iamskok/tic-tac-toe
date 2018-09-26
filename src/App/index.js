import React, { Component } from 'react';
import io from 'socket.io-client';
import Field from '../Field';
import '../index.css';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		}

		this.handleItemClick = this.handleItemClick.bind(this);
	}

	handleItemClick(i, j) {
		this.socket.emit('action', [i, j]);
	}

	componentDidMount() {
		const socket = io('http://localhost:5000?token=mysecrettoken1');
		console.log('-');
		this.socket = socket;
		
		socket.on('connect', (a, b) => {
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
					if (data.winner === 'c') {
						setTimeout(() => alert('❌ won!'), 100);
					} else if (data.winner === 'z') {
						setTimeout(() => alert('⭕️ won!'), 100);
					} else {

					}
				}
			}
		});

		socket.on('disconnect', function () {
			alert('Server disconnected');
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
			</div>
		);
	}
}

export default App;
