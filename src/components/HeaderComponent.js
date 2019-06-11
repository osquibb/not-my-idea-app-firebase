import React, { Component } from 'react';
import { fireauth } from '../firebase/firebase';
import { Navbar, NavbarBrand, ButtonDropdown, DropdownToggle, DropdownMenu, 
        DropdownItem, Form, Input, FormGroup, Button, Modal, ModalHeader,
        ModalBody, ModalFooter } from 'reactstrap'; 

class CustomDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      signUpModal: false,
      verifiedSignUpModal: false,
      email: '',
      password: '',
      user: null
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.toggleSignUpModal = this.toggleSignUpModal.bind(this);
    this.toggleVerifiedSignUpModal = this.toggleVerifiedSignUpModal.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.signUpWithEmail = this.signUpWithEmail.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    fireauth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user})
      } else {
        this.setState({user: null})
      }
    });

    let params = new URLSearchParams(window.location.search);
    
    if (params.has('verified')) {
      this.setState({verifiedSignUpModal: true});
    } else {
      this.setState({verifiedSignUpModal: false});
    }
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

  toggleVerifiedSignUpModal() {
    this.setState(prevState => ({verifiedSignUpModal: !prevState.verifiedSignUpModal}));
  }

  toggleSignUpModal() {
    this.setState(prevState => ({signUpModal: !prevState.signUpModal}));
  }

  signUpWithEmail() {
    this.props.signUpUser(this.state.email);
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
            {this.state.user !== null ? this.state.user.email  : 'Sign Up / Sign In'}
          </DropdownToggle>
          <DropdownMenu right={true} className="mt-2">
            {this.state.user !== null ?
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
                  <FormGroup>
                    <Input 
                      type="email"
                      value={this.state.email}
                      onChange={this.handleEmail}
                      placeholder="Email"
                    />
                  </FormGroup>
                </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.signUpWithEmail}>Sign Up</Button>{' '}
          <Button color="secondary" onClick={this.toggleSignUpModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* TEST */}

      <Modal isOpen={this.state.verifiedSignUpModal} toggle={this.toggleVerifiedSignUpModal}>
        <ModalHeader toggle={this.toggleVerifiedSignUpModal}>Set Password</ModalHeader>
        <ModalBody>
        <Form className="px-3 py-3">
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
          <Button color="primary" onClick={this.toggleVerifiedSignUpModal}>Complete Sign Up</Button>{' '}
          <Button color="secondary" onClick={this.toggleVerifiedSignUpModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* TEST */}

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

