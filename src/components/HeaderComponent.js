import React, { Component } from 'react';
import { Navbar, NavbarBrand, ButtonDropdown, DropdownToggle, DropdownMenu, 
        DropdownItem, Form, Input, FormGroup, Button } from 'reactstrap'; 

class customDropDown extends Component {
  // will need to add and wire up logoutUser... (passed in
  // from main component)
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      userName: '',
      password: ''
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  toggleDropDown() {
    this.setState(state => ({
      dropdownOpen: !state.dropdownOpen
    }));
  }
  
  render() {
    return(
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
        <DropdownToggle caret>
          {this.props.auth.isAuthenticated ? this.props.auth.user.username : 'Sign In'}
        </DropdownToggle>
        <DropdownMenu right={true} className="mt-2">
          {this.props.auth.isAuthenticated ?
            <Button outline={true}>
              Log Out
            </Button>
          :
            <React.Fragment>
              <Form className="px-3 py-3">
                <FormGroup>
                  <Input 
                    type="text"
                    value={this.state.userName}
                    placeholder="Username"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    value={this.state.password}
                    placeholder="Password" 
                  />
                </FormGroup>
                <Button 
                  outline={true}
                  onClick={() => 
                    this.props.loginUser({
                                          username: this.state.userName,
                                          password: this.state.password
                                        })}
                >
                  Sign In
                </Button>
              </Form>
              <DropdownItem divider />
              <DropdownItem>Sign up</DropdownItem>
              <DropdownItem>Forgot password?</DropdownItem>
            </React.Fragment>
          } 
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
   
}

export default class Header extends Component {
  
  render() {
    return (
      <div>
        <Navbar color="faded" light>
          <NavbarBrand href="/">Not My Idea</NavbarBrand>
          <customDropDown
            auth={this.props.auth}
            loginUser={this.props.loginUser}
          />
        </Navbar>
      </div>
    );
  }
}