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
      checkEmail: false,
      email: '',
      displayName: '',
      password: ''
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleDisplayName = this.handleDisplayName.bind(this);
    this.toggleSignUpModal = this.toggleSignUpModal.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.signUpWithEmail = this.signUpWithEmail.bind(this);
    this.completeSignUp = this.completeSignUp.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    this.props.checkForUser();
    this.props.checkForVerified();
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

  signUpWithEmail() {
    this.props.signUpUser(this.state.email);
    this.setState({checkEmail: true});
  }

  completeSignUp() {
    this.props.completeSignUpUser(
      {
        displayName: this.state.displayName,
        password: this.state.password
      }
    );
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

  handleDisplayName(e) {
    this.setState({displayName: e.target.value})
  }
  
  render() {
    return(
      <React.Fragment>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
          <DropdownToggle caret>
            {this.props.auth.isAuthenticated ? this.props.auth.user.displayName : 'Sign Up / Sign In'}
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
                    alt='Sign in with Google'
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
          <FormGroup className={this.state.checkEmail ? "d-none" : null}>
            <Input 
              type="email"
              value={this.state.email}
              onChange={this.handleEmail}
              placeholder="Email"
            />
          </FormGroup>
        </Form>
        <p className={this.state.checkEmail ? "text-center" : "d-none"}>
          Check your email inbox to verify your account.
        </p>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={this.state.checkEmail ? this.toggleSignUpModal : this.signUpWithEmail}>
              {this.state.checkEmail ? 'OK' : 'Verify Email'}
          </Button>
          {' '}
          <Button
            hidden={this.state.checkEmail} 
            color="secondary" 
            onClick={this.toggleSignUpModal}>
              Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.props.auth.newUser && this.props.auth.verified} toggle={this.toggleNewUserModal}>
        <ModalHeader toggle={this.toggleNewUserModal}>Create Username and Password</ModalHeader>
        <ModalBody>
          <Form className="px-3 py-3">
            <FormGroup>
              <Input 
                type="text"
                value={this.state.displayName}
                onChange={this.handleDisplayName}
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
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary" 
            onClick={this.completeSignUp}>
              Complete Sign Up
          </Button>
          {' '}
          <Button
            color="secondary"
            onClick={this.toggleNewUserModal}>
              Cancel
          </Button>
          
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
            completeSignUpUser={this.props.completeSignUpUser}
            loginUser={this.props.loginUser}
            googleLogin={this.props.googleLogin}
            logoutUser={this.props.logoutUser}
            checkForUser={this.props.checkForUser}
            checkForVerified={this.props.checkForVerified}
            toggleSignUpModal={this.toggleSignUpModal}
          />
        </Navbar>
      </div>
    );
  }
}

