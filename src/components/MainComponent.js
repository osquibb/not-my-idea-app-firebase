import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchIdeas, addSortedIdeas, postIdea, postLikedIdeas,
				 postFlaggedIdeas, loginUser, logoutUser } from '../redux/ActionCreators';

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
	addSortedIdeas: ideas => dispatch(addSortedIdeas(ideas)),
	postIdea: idea => dispatch(postIdea(idea)),
	postLikedIdeas: ideas => dispatch(postLikedIdeas(ideas)),
	postFlaggedIdeas: ideas => dispatch(postFlaggedIdeas(ideas)),
	loginUser: creds => dispatch(loginUser(creds)),
	logoutUser: () => dispatch(logoutUser()),
});

class Main extends Component {

	componentDidMount() {
		this.props.fetchIdeas();
	}

	ideasAreSorted(ideas) {
		// returns true if ideas are sorted by rank. false otherwise.
		const sortedIdeas = ideas.slice().sort((a,b) => a.rank > b.rank ? -1 : 1);
	
		for (let i in ideas) {
			if (ideas[i].rank !== sortedIdeas[i].rank) {
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
					loginUser={this.props.loginUser}
					logoutUser={this.props.logoutUser}
				/>
				<Switch>
					<Route path="/" 
								 component={() => 
														<Home ideas={this.props.ideas.ideas}
																	likedIdeas={this.props.ideas.likedIdeas}
																	flaggedIdeas={this.props.ideas.flaggedIdeas}
																	auth={this.props.auth}
																	postIdea={this.props.postIdea}
																	postFlaggedIdeas={this.props.postFlaggedIdeas}
																	postLikedIdeas={this.props.postLikedIdeas}
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
