import React, { Component } from 'react';
import io from 'socket.io-client';
import Field from '../Field';
import '../index.css';
import './App.css';

let data = [
	['z', 'c', 'c'], 
	['e', 'z', 'c'], 
	['e', 'e', 'z']
];

class App extends Component {
	componentDidMount() {
		const socket = io('http://localhost:5000?token=mysecrettoken1');
		console.log('-');
		socket.on('connect', (a, b) => {
			console.log('connected!!!');
		});
		socket.on('new-data', function(data) {
			console.log('data = ', data);
		});
		socket.on('disconnect', function () {
			alert('Сервер отсоединился!');
		});
	}

	render() {
		return (
			<div className="App">
				<Field data={data} />
			</div>
		);
	}
}

export default App;
