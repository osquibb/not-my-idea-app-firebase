import React, { Component, Fragment } from 'react';
import { Button, Col, Form, Input, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';
import { Loading } from './LoadingComponent';

function Ideas(props) {

	if (props.isLoading) {
		return(
			<Loading />
		);
	} else if (props.errorMessage) {
		return(
			<div className="text-center">
				{props.errorMessage}
			</div>
		);
	} else {
		return props.ideas.map(idea => 
		<ListGroupItem key={idea._id} className="align-middle">
		<Button color="none" 
						className="far fa-lightbulb fa-2x mr-3"
						onClick={() => props.postLikedIdeas([idea])}
		/>
		{idea.text} (rank: {idea.likedRank})
		<Button color="none"
						style={{"font-size": "1.6rem"}} 
						className="far fa-flag float-right text-warning" 							
						onClick={() => props.postFlagged([idea])}
		/>

					
		</ListGroupItem>);
	}
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
					<Jumbotron className="mt-3 bg-transparent">
						<ListGroup>
							<Ideas 
								ideas={this.props.ideas}
								auth={this.props.auth}
								postLikedIdeas={this.props.postLikedIdeas}
								postFlaggedIdeas={this.props.postFlaggedIdeas}
								isLoading={this.props.ideasLoading}
								errorMessage={this.props.ideasErrorMessage}
							/>
						</ListGroup>
					</Jumbotron>
				</Fragment>
    );
	}
}