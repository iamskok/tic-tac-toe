import React, { Component } from 'react';
import io from 'socket.io-client';
import Field from '../Field';
import '../index.css';
import './styles.css';

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
