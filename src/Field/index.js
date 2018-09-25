import React, { Component } from 'react';
import Item from '../Item';
import './Field.css';

export default class Field extends Component {
	constructor(props) {
		super(props);
		this.handleItemClick = this.handleItemClick.bind(this);	
	}

	handleItemClick(i, j) {
		const data = this.props.data;

		if (data[i][j] === 'e') {
			data[i][j] = 'c';
		}

		this.forceUpdate();
	}
	
	render() {
		const data = this.props.data;
		
		return (
			<div className="Field">
				{
					data.map((row, i) =>
						<div className="Field-row" key={i}>
							{row.map((item, j) => 
								<Item 
									value={item} 
									key={j} 
									handleClick={() => this.handleItemClick(i, j)} 
								/>
							)}
						</div>
					)
				}
			</div>
		)
	}
}
