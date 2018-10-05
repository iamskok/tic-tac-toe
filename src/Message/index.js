import React, { Component } from 'react';
import './styles.css';

export default class Message extends Component {
	render() {
		return (
			<div className="Message">
				<span
					className="Message-button"
					onClick={this.props.removeMessage.bind(null, this.props.id)}
				>
					&times;&nbsp;
				</span>
				<span className="Message-username">
					{this.props.username}
				</span>
				&nbsp;:&nbsp;
				<span className="Message-body">
					{this.props.body}
				</span>
			</div>
		);
	}
}
