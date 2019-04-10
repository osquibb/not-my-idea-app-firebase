import React, { Component } from 'react';
import { Navbar, NavbarBrand, ButtonDropdown, DropdownToggle, DropdownMenu, 
        DropdownItem, Form, Input, FormGroup, Button } from 'reactstrap';

export default class Header extends Component {
	
	constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
		};
		this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  toggleDropDown() {
    this.setState(state => ({
      dropdownOpen: !state.dropdownOpen
    }));
	}
	
  render() {
    return (
      <div>
        <Navbar color="faded" light>
          <NavbarBrand href="/">Not My Idea</NavbarBrand>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
            <DropdownToggle caret>
              Sign In
            </DropdownToggle>
            <DropdownMenu right={true} className="mt-2">
                <Form className="px-3 py-3">
                  <FormGroup>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Username" />
                  </FormGroup>
                  <FormGroup>
                    <Input type="password" name="password" id="examplePassword" placeholder="Password" />
                  </FormGroup>
                  <Button outline={true}>Sign In</Button>
                </Form>
              <DropdownItem divider />
              <DropdownItem>Sign up</DropdownItem>
              <DropdownItem>Forgot password?</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </Navbar>
      </div>
    );
  }
}