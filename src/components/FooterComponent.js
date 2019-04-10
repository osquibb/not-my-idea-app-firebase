import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

export default class Footer extends Component {
	render() {
		return(
			<Row>
				<Col className="text-center">
				&copy; o+k
				</Col>
      </Row>
    );
	}
}