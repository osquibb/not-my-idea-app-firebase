import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect } from 'react-router-dom';



export default class Main extends Component {
	render() {
		return (
			<Container>
				<Header />
				<Switch>
					<Route path="/home" component={Home} />
					<Redirect to="/home" />
				</Switch>
				<Footer />
			</Container>
		);
	}
}

