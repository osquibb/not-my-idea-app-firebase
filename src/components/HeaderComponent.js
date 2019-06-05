import React, { Component } from 'react';
import { Navbar, NavbarBrand, ButtonDropdown, DropdownToggle, DropdownMenu, 
        DropdownItem, Form, Input, FormGroup, Button, Modal, ModalHeader,
        ModalBody, ModalFooter } from 'reactstrap'; 

class CustomDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      signUpModal: false,
      email: '',
      password: ''
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.toggleSignUpModal = this.toggleSignUpModal.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  async logIn() {
    this.setState({dropdownOpen: false});
    await this.props.loginUser({
                          email: this.state.email,
                          password: this.state.password
                        });
  }

  toggleDropDown() {
    this.setState(prevState => ({dropdownOpen: !prevState.dropdownOpen}));
  }

  toggleSignUpModal() {
    this.setState(prevState => ({signUpModal: !prevState.signUpModal}));
  }

  async signUp() {
    await this.props.signUpUser({
      email: this.state.email,
      password: this.state.password
      });
    this.toggleSignUpModal();
  }

  logOut() {
    this.props.logoutUser();
    this.setState({dropdownOpen: false});
  }

  handleEmail(e) {
    this.setState({email: e.target.value})
  }

  handlePassword(e) {
    this.setState({password: e.target.value})
  }
  
  render() {
    return(
      <React.Fragment>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
          <DropdownToggle caret>
            {this.props.auth.isAuthenticated ? this.props.auth.user.email : 'Sign Up / Sign In'}
          </DropdownToggle>
          <DropdownMenu right={true} className="mt-2">
            {this.props.auth.isAuthenticated ?
              <Form>
                <FormGroup>
                  <Button 
                    className="mx-auto my-auto"
                    outline={true}
                    onClick={this.logOut}
                  >
                    Log Out
                  </Button>
                </FormGroup>
              </Form>
            :
              <React.Fragment>
                <div className="text-center">
                  <img
                    id='google-sign-in'
                    style={{maxWidth: '90%'}}
                    src='/icons/google_btn.png'
                    onMouseEnter={e => e.currentTarget.src = '/icons/google_btn_focus.png'}
                    onMouseLeave={e => e.currentTarget.src = '/icons/google_btn.png'}
                    onClick={() => this.props.googleLogin()}
                  />
                </div>
                <DropdownItem divider />
                <Form className="px-3 py-3">
                  <FormGroup>
                    <Input 
                      type="text"
                      value={this.state.email}
                      onChange={this.handleEmail}
                      placeholder="Email"
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
                <DropdownItem color="secondary" onClick={this.toggleSignUpModal}>New Account</DropdownItem>
              </React.Fragment>
            } 
          </DropdownMenu>
        </ButtonDropdown>
        <Modal isOpen={this.state.signUpModal} toggle={this.toggleSignUpModal}>
        <ModalHeader toggle={this.toggleSignUpModal}>New Account</ModalHeader>
        <ModalBody>
        <Form className="px-3 py-3">
                  <FormGroup>
                    <Input 
                      type="text"
                      value={this.state.email}
                      onChange={this.handleEmail}
                      placeholder="Email"
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
                </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.signUp}>Sign Up</Button>{' '}
          <Button color="secondary" onClick={this.toggleSignUpModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
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
            fetchIdeas={this.props.fetchIdeas}
            fetchLikedIdeas={this.props.fetchLikedIdeas}
            fetchFlaggedIdeas={this.props.fetchFlaggedIdeas}
            signUpUser={this.props.signUpUser}
            loginUser={this.props.loginUser}
            googleLogin={this.props.googleLogin}
            logoutUser={this.props.logoutUser}
            toggleSignUpModal={this.toggleSignUpModal}
          />
        </Navbar>
      </div>
    );
  }
}

