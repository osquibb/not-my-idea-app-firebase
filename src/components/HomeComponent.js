import React, { Component } from 'react';
import { Jumbotron, ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap';

const IDEAS = [ {id: 1, text: 'a great idea!'},
								{id: 2, text: 'a great idea!'},
								{id: 3, text: 'a great idea!'},
								{id: 4, text: 'a great idea!'},
								{id: 5, text: 'a great idea!'},
								{id: 6, text: 'a great idea!'},
								{id: 7, text: 'a great idea!'},
								{id: 8, text: 'a great idea!'},
								{id: 9, text: 'a great idea!'},
								{id: 10, text: 'a great idea!'},
								{id: 11, text: 'a great idea!'},
								{id: 12, text: 'a great idea!'},
								{id: 13, text: 'a great idea!'},
								{id: 14, text: 'a great idea!'},
								{id: 15, text: 'a great idea!'}
						];

function Ideas(props) {
	return props.ideas.map(idea => 
	<ListGroupItem key={idea.id}>
	<a className="fa fa-thumbs-down fa-2x mr-4 text-danger"></a>
	<a className="fa fa-thumbs-up fa-2x mr-4 text-success"></a>
	{idea.text}
	<a className="fa fa-ban fa-2x float-right text-warning"></a>
	</ListGroupItem>);
}

export default class Home extends Component {
	render() {
		return(
				<Jumbotron className="mt-3">
					<ListGroup>
						<Ideas ideas={IDEAS} />
					</ListGroup>
				</Jumbotron>
    );
	}
}