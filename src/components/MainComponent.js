import React, { Component } from 'react';
import IdeaList from './IdeaListComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchIdeas, checkForMoreIdeas, postIdea, postLikedIdea, postFlaggedIdea, deleteLikedIdea, deleteFlaggedIdea, 
				 fetchLikedIdeas, fetchFlaggedIdeas, loginUser, googleLogin, logoutUser, signUpUser } from '../redux/ActionCreators';

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
	fetchIdeas: lastVisible => dispatch(fetchIdeas(lastVisible)),
	checkForMoreIdeas: lastVisible => dispatch(checkForMoreIdeas(lastVisible)),
	fetchLikedIdeas: () => dispatch(fetchLikedIdeas()),
	fetchFlaggedIdeas: () => dispatch(fetchFlaggedIdeas()),
	postIdea: idea => dispatch(postIdea(idea)),
	postLikedIdea: ideaId => dispatch(postLikedIdea(ideaId)),
	postFlaggedIdea: ideaId => dispatch(postFlaggedIdea(ideaId)),
	deleteLikedIdea: ideaId => dispatch(deleteLikedIdea(ideaId)),
	deleteFlaggedIdea: ideaId => dispatch(deleteFlaggedIdea(ideaId)),
	loginUser: creds => dispatch(loginUser(creds)),
	googleLogin: () => dispatch(googleLogin()),
	logoutUser: () => dispatch(logoutUser()),
	signUpUser: creds => dispatch(signUpUser(creds)) 
});

class Main extends Component {

	componentDidMount() {
		if(this.props.auth.isAuthenticated) {
			this.props.fetchLikedIdeas();
			this.props.fetchFlaggedIdeas();
		}
	}

	render() {
		return (
			<Container>
				<Header
					auth={this.props.auth}
					signUpUser={this.props.signUpUser}
					loginUser={this.props.loginUser}
					googleLogin={this.props.googleLogin}
					logoutUser={this.props.logoutUser}
					fetchIdeas={this.props.fetchIdeas}
					fetchLikedIdeas={this.props.fetchLikedIdeas}
					fetchFlaggedIdeas={this.props.fetchFlaggedIdeas}
				/>
				<IdeaList 
					ideas={this.props.ideas.ideas}
					fetchIdeas={this.props.fetchIdeas}
					checkForMoreIdeas={this.props.checkForMoreIdeas}
					lastVisible={this.props.ideas.lastVisible}
					moreIdeas={this.props.ideas.moreIdeas}
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
				/>	
				<Footer />
			</Container>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
