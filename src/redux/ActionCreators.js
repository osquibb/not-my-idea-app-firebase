import * as ActionTypes from './ActionTypes';
import { auth, firestore, fireauth, firebasestore } from '../firebase/firebase';

export const fetchIdeas = lastVisible => dispatch => {
  dispatch(ideasLoading());

  if (lastVisible == null) {
    return firestore.collection('ideas')
    .orderBy('likedRank', 'desc')
    .limit(10).get().then(snapshot => {
      let newLastVisible = snapshot.docs[snapshot.docs.length - 1];
      let ideas = [];
      snapshot.forEach(doc => {
          const data = doc.data()
          const _id = doc.id
          ideas.push({_id, ...data });
      });
      return {ideas, newLastVisible};
    })
    .then(ideas => {
      dispatch(addIdeas(ideas.ideas));
      dispatch(updateLastVisible(ideas.newLastVisible));
    })
    .catch(error => dispatch(ideasFailed(error.message)));
  }
  else {
    return firestore.collection('ideas')
    .orderBy('likedRank', 'desc')
    .startAfter(lastVisible)
    .limit(10).get().then(snapshot => {
      let newLastVisible = snapshot.docs[snapshot.docs.length - 1];
      let ideas = [];
      snapshot.forEach(doc => {
          const data = doc.data()
          const _id = doc.id
          ideas.push({_id, ...data });
      });
      return {ideas, newLastVisible};
    })
    .then(ideas => {
      dispatch(addIdeas(ideas.ideas));
      dispatch(updateLastVisible(ideas.newLastVisible));
    })
    .catch(error => dispatch(ideasFailed(error.message)));
  }  
};

export const checkForMoreIdeas = lastVisible => dispatch => {
  if (lastVisible == null) {
    return firestore.collection('ideas')
    .orderBy('likedRank', 'desc')
    .limit(1).get().then(snapshot => snapshot)
    .then(snapshot => dispatch(updateMoreIdeas(snapshot.docs.length > 0)))
    .catch(error => console.log(error));
  }
  else {
    return firestore.collection('ideas')
    .orderBy('likedRank', 'desc')
    .startAfter(lastVisible)
    .limit(1).get().then(snapshot => snapshot)
    .then(snapshot => dispatch(updateMoreIdeas(snapshot.docs.length > 0)))
    .catch(error => console.log(error));
  }  
}

const updateMoreIdeas = nextIdeaId => (
  {
    type: ActionTypes.UPDATE_MORE_IDEAS,
    payload: nextIdeaId
  }
)

const updateLastVisible = lastVisible => (
  {
    type: ActionTypes.UPDATE_LAST_VISIBLE,
    payload: lastVisible
  }
);

export const postIdea = ideaText => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  return firestore.collection('ideas').add({
    text: ideaText,
    author: {
      '_id': auth.currentUser.uid,
      'username' : auth.currentUser.displayName ? auth.currentUser.displayName : 'unknown'
    },
    likedRank: 0,
    flaggedRank: 0,
    createdAt: firebasestore.FieldValue.serverTimestamp()
  })
  .then(docRef => {
      firestore.collection('ideas').doc(docRef.id).get()
          .then(doc => {
              if (doc.exists) {
                  const data = doc.data();
                  const _id = doc.id;
                  let idea = {_id, ...data};
                  dispatch(addIdeas([idea]))
              } else {
                  console.log("No such document!");
              }
          });
  })
  .catch(error => { console.log('Post Idea ', error.message);
      alert('Your Idea could not be posted\nError: '+ error.message); })
};

//.. TESTING

export const deleteIdea = (ideaId) => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let user = auth.currentUser;

  return firestore.collection('ideas').doc(ideaId).get()
    .then(idea => {
      if (idea.exists && user.uid === idea.data().author._id) {
        firestore.collection('ideas').doc(ideaId).delete()
        .then(() => {
          dispatch(removeIdea(ideaId));
          console.log(`Idea ${ideaId} deleted`);
        })
        .catch(error => console.log(error));

        firestore.collection('likedIdeas').where('ideaId', '==', ideaId).get()
        .then(snapshot => {
          snapshot.forEach(likedIdea => likedIdea.ref.delete())
        })
        .catch(error => console.log(error));

        firestore.collection('flaggedIdeas').where('ideaId', '==', ideaId).get()
        .then(snapshot => {
          snapshot.forEach(flaggedIdea => flaggedIdea.ref.delete())
        })
        .catch(error => console.log(error));

        dispatch(removeLikedIdea(ideaId));
        dispatch(removeFlaggedIdea(ideaId));
      }
    })
    .catch(error => console.log(error));
}

//.. TESTING

export const fetchLikedIdeas = () => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let user = auth.currentUser;

  return firestore.collection('likedIdeas').where('user', '==', user.uid).get()
    .then(snapshot => {
        let likedIdeaIds = [];
        snapshot.forEach(doc => {
            const data = doc.data()
            likedIdeaIds.push(data.ideaId);
        });
        return likedIdeaIds;
    })
    .then(likedIdeaIds => dispatch(addLikedIdeas(likedIdeaIds)))
    .catch(error => dispatch(ideasFailed(error.message)));
};

export const fetchFlaggedIdeas = () => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let user = auth.currentUser;

  return firestore.collection('flaggedIdeas').where('user', '==', user.uid).get()
    .then(snapshot => {
        let flaggedIdeaIds = [];
        snapshot.forEach(doc => {
            const data = doc.data()
            flaggedIdeaIds.push(data.ideaId);
        });
        return flaggedIdeaIds;
    })
    .then(flaggedIdeaIds => dispatch(addFlaggedIdeas(flaggedIdeaIds)))
    .catch(error => dispatch(ideasFailed(error.message)));
};


export const postLikedIdea = ideaId => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let user = auth.currentUser;

  return firestore.collection('likedIdeas').where('user', '==', user.uid).where('ideaId', '==', ideaId).get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
      firestore.collection('likedIdeas').add({
        user: auth.currentUser.uid,
        ideaId: ideaId
      })
      .then(() => {
        dispatch(incrementLikedRank(ideaId));
        dispatch(addLikedIdeas([ideaId]));
      })
    }
    else {
      console.log('Idea already liked')
    }
  })
};


export const postFlaggedIdea = ideaId => dispatch => {
  
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let user = auth.currentUser;

  return firestore.collection('flaggedIdeas').where('user', '==', user.uid).where('ideaId', '==', ideaId).get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
      firestore.collection('flaggedIdeas').add({
        user: auth.currentUser.uid,
        ideaId: ideaId
      })
      .then(() => {
        dispatch(incrementFlaggedRank(ideaId));
        dispatch(addFlaggedIdeas([ideaId]));
      })
    }
    else {
      console.log('Idea already flagged')
    }
  })
};


export const deleteLikedIdea = ideaId => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let user = auth.currentUser;

  return firestore.collection('likedIdeas').where('user', '==', user.uid).where('ideaId', '==', ideaId).get()
  .then(snapshot => {
      snapshot.forEach(doc => {
          firestore.collection('likedIdeas').doc(doc.id).delete()
          .then(() => {
              dispatch(decrementLikedRank(ideaId));
              dispatch(removeLikedIdea(ideaId));
          })
      });
  })
  .catch(error => dispatch(ideasFailed(error.message)));
};


export const deleteFlaggedIdea = ideaId => dispatch => {
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

let user = auth.currentUser;

return firestore.collection('flaggedIdeas').where('user', '==', user.uid).where('ideaId', '==', ideaId).get()
.then(snapshot => {
    snapshot.forEach(doc => {
        firestore.collection('flaggedIdeas').doc(doc.id).delete()
        .then(() => {
            dispatch(decrementFlaggedRank(ideaId))
            dispatch(removeFlaggedIdea(ideaId));
        })
    });
})
.catch(error => dispatch(ideasFailed(error.message)));
};

const incrementLikedRank = ideaId => dispatch => {
  
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let ideaRef = firestore.collection('ideas').doc(ideaId);

  firestore.runTransaction(transaction => {
    return transaction.get(ideaRef)
    .then(idea => {
      if (!idea.exists) {
          throw new Error("Idea does not exist!");
      }

      let incrementedLikedRank = idea.data().likedRank + 1;
      transaction.update(ideaRef, { likedRank: incrementedLikedRank });
      
      return incrementedLikedRank;
    });
  })
  .then(incrementedLikedRank => {
      dispatch(changeLikedRank(ideaId, incrementedLikedRank));
  }).catch(error => console.error(error));
};

const incrementFlaggedRank = ideaId => dispatch => {
  
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let ideaRef = firestore.collection('ideas').doc(ideaId);

  firestore.runTransaction(transaction => {
    return transaction.get(ideaRef)
    .then(idea => {
      if (!idea.exists) {
          throw new Error("Idea does not exist!");
      }

      let incrementedFlaggedRank = idea.data().flaggedRank + 1;
      transaction.update(ideaRef, { flaggedRank: incrementedFlaggedRank });
      
      return incrementedFlaggedRank;
    });
  })
  .then(incrementedFlaggedRank => {
      dispatch(changeFlaggedRank(ideaId, incrementedFlaggedRank));
  }).catch(error => console.error(error));
};

const decrementLikedRank = ideaId => dispatch => {
  
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let ideaRef = firestore.collection('ideas').doc(ideaId);

  firestore.runTransaction(transaction => {
    return transaction.get(ideaRef)
    .then(idea => {
      if (!idea.exists) {
          throw new Error("Idea does not exist!");
      }

      let decrementedLikedRank = idea.data().likedRank - 1;
      transaction.update(ideaRef, { likedRank: decrementedLikedRank });
      
      return decrementedLikedRank;
    });
  })
  .then(decrementedLikedRank => {
      dispatch(changeLikedRank(ideaId, decrementedLikedRank));
  }).catch(error => console.error(error));
};

const decrementFlaggedRank = ideaId => dispatch => {
  
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  let ideaRef = firestore.collection('ideas').doc(ideaId);

  firestore.runTransaction(transaction => {
    return transaction.get(ideaRef)
    .then(idea => {
      if (!idea.exists) {
          throw new Error("Idea does not exist!");
      }

      let decrementedFlaggedRank = idea.data().flaggedRank - 1;
      transaction.update(ideaRef, { flaggedRank: decrementedFlaggedRank });
      
      return decrementedFlaggedRank;
    });
  })
  .then(decrementedFlaggedRank => {
      dispatch(changeFlaggedRank(ideaId, decrementedFlaggedRank));
  }).catch(error => console.error(error));
};

const addIdeas = ideas => {
  return(
    { type: ActionTypes.ADD_IDEAS,
      payload: ideas
    }
  );
};

//.. TESTING
const removeIdea = ideaId => {
  return(
    { type: ActionTypes.REMOVE_IDEA,
      payload: ideaId
    }
  )
}

//.. TESTING

const ideasLoading = () => (
  { type: ActionTypes.IDEAS_LOADING }
);

const ideasFailed = errorMessage => (
  { type: ActionTypes.IDEAS_FAILED,
    payload: errorMessage
  }
);

const addLikedIdeas = likedIdeaIds => (
  {
    type: ActionTypes.ADD_LIKED_IDEAS,
    payload: likedIdeaIds
  }
);

const removeLikedIdea = likedIdeaId => (
  {
    type: ActionTypes.REMOVE_LIKED_IDEA,
    payload: likedIdeaId
  }
);

const removeFlaggedIdea = flaggedIdeaId => (
  {
    type: ActionTypes.REMOVE_FLAGGED_IDEA,
    payload: flaggedIdeaId
  }
);


const changeLikedRank = (ideaId, newLikedRank) => (
  {
    type: ActionTypes.CHANGE_LIKED_RANK,
    payload: { ideaId, newLikedRank }
  }
);
  

const changeFlaggedRank = (ideaId, newFlaggedRank) => (
  {
    type: ActionTypes.CHANGE_FLAGGED_RANK,
    payload: { ideaId, newFlaggedRank }
  }
);

const addFlaggedIdeas = flaggedIdeaIds => (
  {
    type: ActionTypes.ADD_FLAGGED_IDEAS,
    payload: flaggedIdeaIds
  }
);

const removeLikedAndFlaggedIdeas = () => (
  {
    type: ActionTypes.REMOVE_LIKED_AND_FLAGGED_IDEAS
  }
);

// *** USER LOGIN ACTION CREATORS *** //

export const checkForUser = () => dispatch => {
  fireauth().onAuthStateChanged(user => {
    if (user) {
      dispatch(receiveLogin(user));
    } else {
      dispatch(setNewUser());
      console.log('No user logged in');
    }
  });
}

const setNewUser = (isNewUser = true) => {
  return {
    type: ActionTypes.SET_NEW_USER,
    payload: isNewUser
  }
}

export const completeSignUpUser = ({displayName, password}) => dispatch => {
  if (fireauth().isSignInWithEmailLink(window.location.href)) {

    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      dispatch(signUpError('Error: No Email Found'));
    }
    fireauth().signInWithEmailLink(email, window.location.href)
      .then(result => {
        window.localStorage.removeItem('emailForSignIn');

      if (result.additionalUserInfo.isNewUser) {
        let user = result.user;

        user.updatePassword(password)
        .then(() => console.log('Password Set'))
        .catch(error => console.log(error));
  
        user.updateProfile({displayName: displayName})
        .then(() => console.log('Display Name Set'))
        .catch(error => console.log(error));

        window.history.replaceState(null, null, window.location.pathname);
        dispatch(setVerified(false));
      }
      dispatch(receiveSignUp());
      dispatch(setNewUser(false));
    })
    .catch(error => dispatch(signUpError(error.message)));
  }
}

export const checkForVerified = () => dispatch => {
  let params = new URLSearchParams(window.location.search);
    
    if (params.has('verified')) {
      dispatch(setVerified(true));
    } else {
      dispatch(setVerified(false));
    }
}

const setVerified = verified => (
  {
  type: ActionTypes.SET_VERIFIED,
  payload: verified
  }
);


const requestLogin = () => {
  return {
      type: ActionTypes.LOGIN_REQUEST
  }
}

const receiveLogin = (user) => {
  return {
      type: ActionTypes.LOGIN_SUCCESS,
      user
  }
}

const loginError = (message) => {
  return {
      type: ActionTypes.LOGIN_FAILURE,
      message
  }
}

export const loginUser = (creds) => dispatch => {
  dispatch(requestLogin());

  return auth.signInWithEmailAndPassword(creds.email, creds.password)
  .then(() => {
      let user = auth.currentUser;
      localStorage.setItem('user', JSON.stringify(user));
      // Dispatch the success action
      dispatch(fetchLikedIdeas());
      dispatch(fetchFlaggedIdeas());
      dispatch(receiveLogin(user));
  })
  .catch(error => dispatch(loginError(error.message)));
};

const requestLogout = () => {
  return {
    type: ActionTypes.LOGOUT_REQUEST
  }
}

const receiveLogout = () => {
  return {
    type: ActionTypes.LOGOUT_SUCCESS
  }
}

// Logs the user out
export const logoutUser = () => dispatch => {
  dispatch(requestLogout());

  auth.signOut()
  .then(() => console.log("Sign out successful"))
  .catch((error) => console.log(error));

  localStorage.removeItem('user');
  dispatch(setNewUser(false));
  dispatch(removeLikedAndFlaggedIdeas());
  dispatch(receiveLogout());
  
}

const requestSignUp = () => {
  return {
      type: ActionTypes.SIGN_UP_REQUEST,
  }
}

const receiveSignUp = () => {
  return {
      type: ActionTypes.SIGN_UP_SUCCESS,
  }
}

const signUpError = (message) => {
  return {
      type: ActionTypes.SIGN_UP_FAILURE,
      message
  }
}

export const signUpUser = email => dispatch => {
  dispatch(requestSignUp());

  let actionCodeSettings = {
    url: 'http://localhost:3000/?verified',
    handleCodeInApp: true
  };

  fireauth().sendSignInLinkToEmail(email, actionCodeSettings)
  .then(response => {
    dispatch(receiveSignUp(response));
    window.localStorage.setItem('emailForSignIn', email);
  })
  .catch(error => dispatch(signUpError(error.message)));
}

export const googleLogin = () => (dispatch) => {
  const provider = new fireauth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
      .then((result) => {
          let user = result.user;
          localStorage.setItem('user', JSON.stringify(user));
          // Dispatch the success action
          dispatch(fetchLikedIdeas());
          dispatch(fetchFlaggedIdeas());
          dispatch(receiveLogin(user));
      })
      .catch((error) => {
          dispatch(loginError(error.message));
      });
}
