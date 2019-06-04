import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchIdeas, addSortedIdeas, postIdea, postLikedIdea,
				 postFlaggedIdea, deleteLikedIdea, deleteFlaggedIdea, fetchLikedIdeas,
				 fetchFlaggedIdeas, loginUser, logoutUser, signUpUser } from '../redux/ActionCreators';

// map store state to props
// each field contains a state
// example: ideas contains isLoading, errorMessage, & ideas
const mapStateToProps = state => {
	return {
		ideas: state.ideas,
		auth: state.auth
	}
}

const mapDispatchToProps = dispatch => ({
	fetchIdeas: () => dispatch(fetchIdeas()),
	fetchLikedIdeas: () => dispatch(fetchLikedIdeas()),
	fetchFlaggedIdeas: () => dispatch(fetchFlaggedIdeas()),
	addSortedIdeas: ideas => dispatch(addSortedIdeas(ideas)),
	postIdea: idea => dispatch(postIdea(idea)),
	postLikedIdea: ideaId => dispatch(postLikedIdea(ideaId)),
	postFlaggedIdea: ideaId => dispatch(postFlaggedIdea(ideaId)),
	deleteLikedIdea: ideaId => dispatch(deleteLikedIdea(ideaId)),
	deleteFlaggedIdea: ideaId => dispatch(deleteFlaggedIdea(ideaId)),
	loginUser: creds => dispatch(loginUser(creds)),
	logoutUser: () => dispatch(logoutUser()),
	signUpUser: creds => dispatch(signUpUser(creds)) 
});

class Main extends Component {

	componentDidMount() {
		this.props.fetchIdeas();
		if(this.props.auth.isAuthenticated) {
			this.props.fetchLikedIdeas();
			this.props.fetchFlaggedIdeas();
		}
	}

	ideasAreSorted(ideas) {
		// returns true if ideas are sorted by rank. false otherwise.
		const sortedIdeas = ideas.slice().sort((a,b) => a.likedRank > b.likedRank ? -1 : 1);
	
		for (let i in ideas) {
			if (ideas[i].likedRank !== sortedIdeas[i].likedRank) {
				return false;
			}
		}
		return true;	
	}

	componentDidUpdate() {
		const ideas = this.props.ideas.ideas;
		if(!this.ideasAreSorted(ideas)) {
			this.props.addSortedIdeas(ideas);
		}
	}

	render() {
		return (
			<Container>
				<Header
					auth={this.props.auth}
					signUpUser={this.props.signUpUser}
					loginUser={this.props.loginUser}
					logoutUser={this.props.logoutUser}
					fetchIdeas={this.props.fetchIdeas}
					fetchLikedIdeas={this.props.fetchLikedIdeas}
					fetchFlaggedIdeas={this.props.fetchFlaggedIdeas}
				/>
				<Switch>
					<Route path="/" 
								 component={() => 
														<Home ideas={this.props.ideas.ideas}
																	likedIdeas={this.props.ideas.likedIdeas}
																	flaggedIdeas={this.props.ideas.flaggedIdeas}
																	auth={this.props.auth}
																	postIdea={this.props.postIdea}
																	postFlaggedIdea={this.props.postFlaggedIdea}
																	postLikedIdea={this.props.postLikedIdea}
																	deleteLikedIdea={this.props.deleteLikedIdea}
																	deleteFlaggedIdea={this.props.deleteFlaggedIdea}
																	ideasLoading={this.props.ideas.isLoading}
																	ideasErrorMessage={this.props.ideas.errorMessage}
														/>}
					/>
					<Redirect to="/" />
				</Switch>
				<Footer />
			</Container>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
