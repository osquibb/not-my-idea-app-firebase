import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchIdeas, postIdea, deleteIdea, changeRank, addSortedIdeas } from '../redux/ActionCreators';

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
	changeRank: (idea, up) => dispatch(changeRank(idea, up)),
	addSortedIdeas: ideas => dispatch(addSortedIdeas(ideas))
});

class Main extends Component {

	componentDidMount() {
		this.props.fetchIdeas();
	}

	ideasAreSorted(ideas) {
		// returns true if ideas are sorted by rank.  false otherwise.
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
				<Header />
				<Switch>
					<Route path="/" 
								 component={() => 
														<Home ideas={this.props.ideas.ideas}
																	postIdea={this.props.postIdea}
																	deleteIdea={this.props.deleteIdea}
																	changeRank={this.props.changeRank}
																	ideasLoading={this.props.ideas.isLoading}
																	ideasErrorMessage={this.props.ideas.errorMessage}/>}
					/>
					<Redirect to="/" />
				</Switch>
				<Footer />
			</Container>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
