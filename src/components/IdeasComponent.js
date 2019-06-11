import React, { Component, Fragment } from 'react';
// import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Row, Col, Form, Input, FormGroup, FormFeedback,
				 ListGroup, ListGroupItem, ListGroupItemText } from 'reactstrap';
import { Loading } from './LoadingComponent';

function RenderIdeas(props) {

	return(props.ideas.map(idea => 
		<ListGroupItem key={idea._id}>
			<Row className="align-items-center">
				<Col xs="2" className="text-center">
					<Row className="align-items-center">
						<Col>
							<div color="none" 
											className={props.likedIdeas.indexOf(idea._id) !== -1
																? "fas fa-lightbulb fa-2x"	
																: "far fa-lightbulb fa-2x"}
											onClick={() =>{
												if (props.likedIdeas.indexOf(idea._id) === -1) {
													props.postLikedIdea(idea._id);
												}
												else {
													props.deleteLikedIdea(idea._id);
												}
											}}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							{idea.likedRank}
						</Col>
					</Row>	
				</Col>
				<Col xs="8">
					<ListGroupItemText style={{wordWrap: 'break-word'}}>
						{idea.text}
					</ListGroupItemText>
					<ListGroupItemText style={{"fontSize": ".75rem"}}>
						Submitted by <strong>{idea.author.username}</strong> on <strong>{new Date(idea.createdAt.seconds * 1000).toDateString()}</strong>
					</ListGroupItemText>
				</Col>

				<Col xs="2" className="text-center">
					<Button color="none"
									style={{"fontSize": "1.6rem"}} 
									className={props.flaggedIdeas.indexOf(idea._id) !== -1
														? "fas fa-flag float-right text-warning"
														: "far fa-flag float-right text-warning"}					
									onClick={() =>{
										if (props.flaggedIdeas.indexOf(idea._id) === -1) {
											props.postFlaggedIdea(idea._id);
										}
										else {
											props.deleteFlaggedIdea(idea._id);
										}
									}}
					/>
				</Col>
			</Row>			
		</ListGroupItem>)
	);
}

export default class Ideas extends Component {

	constructor(props) {
		super(props);
		this.state = { inputText: '',
									 inputValid: true 
									};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.loadMoreIdeas = this.loadMoreIdeas.bind(this);
	}

	componentDidMount() {
		if (this.props.lastVisible == null) {
			this.loadMoreIdeas();
		}
	}

	handleChange(event) {
		this.setState({inputText: event.target.value});
		if (event.target.value.length > 140) {
			this.setState({inputValid: false});
		} else {
			this.setState({inputValid: true});
		}
	}

	handleSubmit(event) {
		if (this.state.inputText.length === 0) {
			alert('Your idea is empty!');
		} else {
			this.props.postIdea(this.state.inputText);
		}
		event.preventDefault();
	}

	async loadMoreIdeas() {
		await this.props.fetchIdeas(this.props.lastVisible);
		await this.props.checkForMoreIdeas(this.props.lastVisible);
	}

	render() {

		return(
				<Fragment>
					<Form className="row mt-3" onSubmit={this.handleSubmit}>	
						<Col xs="10 mb-2">
							<FormGroup>	
								<Input 
									type="text"
									invalid={!this.state.inputValid}
									value={this.state.inputText} 
									onChange={this.handleChange} 
									placeholder="your idea..." 
								/>
								<FormFeedback>Too Long! Ideas must contain no more than 140 characters.</FormFeedback>
							</FormGroup>	
						</Col>
						<Col xs="2">
							<FormGroup>	
								<Button type="submit"
												id="addIdea" 
												className="text-muted"
												outline={true}
												block={true} >
									<i className="fa fa-plus"/>
								</Button>
							</FormGroup>
						</Col>	
					</Form>	
					<InfiniteScroll
						hasMore={this.props.moreIdeas}
						next={this.loadMoreIdeas}
						loader={<Loading />}
					>
						<ListGroup>
							<RenderIdeas 
								auth={this.props.auth}
								ideas={this.props.ideas}
								likedIdeas={this.props.likedIdeas}
								flaggedIdeas={this.props.flaggedIdeas}
								postLikedIdea={this.props.postLikedIdea}
								postFlaggedIdea={this.props.postFlaggedIdea}
								deleteLikedIdea={this.props.deleteLikedIdea}
								deleteFlaggedIdea={this.props.deleteFlaggedIdea}
								isLoading={this.props.ideasLoading}
								errorMessage={this.props.ideasErrorMessage}
							/>
					</ListGroup>
				</InfiniteScroll>
			</Fragment>
    );
	}
}