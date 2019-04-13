import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchIdeas, postIdea, deleteIdea, changeRank } from '../redux/ActionCreators';

// map store state to props
// each field contains a state
// example: ideas contains isLoading, errorMessage, & ideas
const mapStateToProps = state => {
	return {
		ideas: state.ideas
	}
}

const mapDispatchToProps = dispatch => ({
	fetchIdeas: () => dispatch(fetchIdeas()),
	postIdea: idea => dispatch(postIdea(idea)),
	deleteIdea: flaggedIdeaId => dispatch(deleteIdea(flaggedIdeaId)),
	changeRank: (idea, up) => dispatch(changeRank(idea, up))
});

class Main extends Component {

	componentDidMount() {
		this.props.fetchIdeas();
	}

	render() {
		return (
			<Container>
				<Header />
				<Switch>
					<Route path="/home" 
								 component={() => 
														<Home ideas={this.props.ideas.ideas}
																	postIdea={this.props.postIdea}
																	deleteIdea={this.props.deleteIdea}
																	changeRank={this.props.changeRank}
																	ideasLoading={this.props.ideas.isLoading}
																	ideasErrorMessage={this.props.ideas.errorMessage}/>}
					/>
					<Redirect to="/home" />
				</Switch>
				<Footer />
			</Container>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
