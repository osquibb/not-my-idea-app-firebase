import React, { Component } from 'react';
import { Navbar, NavbarBrand, ButtonDropdown, DropdownToggle, DropdownMenu, 
        DropdownItem, Form, Input, FormGroup, Button } from 'reactstrap'; 

class CustomDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      userName: '',
      password: ''
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  toggleDropDown() {
    this.setState(state => ({
      dropdownOpen: !state.dropdownOpen
    }));
  }

  logIn() {
    this.props.loginUser({
                          username: this.state.userName,
                          password: this.state.password
                        });
    this.setState({dropdownOpen: false});
  }

  logOut() {
    this.props.logoutUser();
    this.setState({dropdownOpen: false});
  }

  handleUserName(e) {
    this.setState({userName: e.target.value})
  }

  handlePassword(e) {
    this.setState({password: e.target.value})
  }
  
  render() {
    return(
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
        <DropdownToggle caret>
          {this.props.auth.isAuthenticated ? this.props.auth.user.username : 'Sign In'}
        </DropdownToggle>
        <DropdownMenu right={true} className="mt-2">
          {this.props.auth.isAuthenticated ?
            <Button 
              outline={true}
              onClick={this.logOut}
            >
              Log Out
            </Button>
          :
            <React.Fragment>
              <Form className="px-3 py-3">
                <FormGroup>
                  <Input 
                    type="text"
                    value={this.state.userName}
                    onChange={this.handleUserName}
                    placeholder="Username"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    value={this.state.password}
                    onChange={this.handlePassword}
                    placeholder="Password" 
                  />
                </FormGroup>
                <Button 
                  outline={true}
                  onClick={this.logIn}
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
          <CustomDropDown
            auth={this.props.auth}
            loginUser={this.props.loginUser}
            logoutUser={this.props.logoutUser}
          />
        </Navbar>
      </div>
    );
  }
}

