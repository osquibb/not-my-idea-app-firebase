import React, { Component, Fragment } from 'react';
import { Button, Col, Form, Input, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';

function Ideas(props) {
	return props.ideas.map(idea => 
	<ListGroupItem key={idea.id}>
	<Button color="none" className="fa fa-arrow-down fa-2x mr-2 text-muted"
		 onClick={() => props.changeRank(idea, false)}></Button>
	<Button color="none" className="fa fa-arrow-up fa-2x mr-3 text-muted"
		 onClick={() => props.changeRank(idea, true)}></Button>
	{idea.text} (rank: {idea.rank})
	<Button color="none" className="fa fa-ban fa-2x float-right text-muted"
		 onClick={() => props.deleteIdea(idea.id)}></Button>
	</ListGroupItem>);
}

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = { inputText: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({inputText: event.target.value});
	}

	handleSubmit(event) {
		this.props.postIdea(this.state.inputText);
		event.preventDefault();
	}

	render() {

		return(
				<Fragment>
						<Form className="row mt-3" onSubmit={this.handleSubmit}>
							<Col xs="10 mb-2">
							<Input type="text" 
										 value={this.state.inputText} 
										 onChange={this.handleChange} 
										 placeholder="your idea..." />
							</Col>
							<Col xs="2 mt-auto text-right">
							<Button type="submit"
											id="addIdea" 
											className="mb-2 text-muted"
											outline={true}
											block={true} >
								<i className="fa fa-plus"/>
							</Button>
							</Col>
						</Form>
					<Jumbotron className="mt-2">
						<ListGroup>
							<Ideas ideas={this.props.ideas}
										 deleteIdea={this.props.deleteIdea}
										 changeRank={this.props.changeRank} />
						</ListGroup>
					</Jumbotron>
				</Fragment>
    );
	}
}