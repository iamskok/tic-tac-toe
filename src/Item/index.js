import React, { Component } from 'react';

import './styles.css';

export default class Item extends Component {
	render() {
		return (
			<div className="Item" onClick={ this.props.handleClick }>
				{
					this.props.value == 'c' ?
					<div className="Item-sign Item-sign--cross">❌</div> :
					this.props.value == 'z' ? 
					<div className="Item-sign Item-sign--zero">⭕️</div> :
					<div className="Item-sign Item-sign--empty"></div>
				}
			</div>
		);
	}
}
