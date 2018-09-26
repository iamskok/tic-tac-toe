import React, { Component } from 'react';
import Item from '../Item';
import './Field.css';

export default class Field extends Component {
	constructor(props) {
		super(props);
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
									handleClick={() => this.props.handleItemClick(i, j)} 
								/>
							)}
						</div>
					)
				}
			</div>
		);
	}
}
