import * as ActionTypes from './ActionTypes';
import { auth, firestore, fireauth, firebasestore } from '../firebase/firebase';

export const fetchIdeas = () => dispatch => {
  dispatch(ideasLoading());
  
  return firestore.collection('ideas').get()
        .then(snapshot => {
            let ideas = [];
            snapshot.forEach(doc => {
                const data = doc.data()
                const _id = doc.id
                ideas.push({_id, ...data });
            });
            return ideas;
        })
        .then(ideas => dispatch(addSortedIdeas(ideas)))
        .catch(error => dispatch(ideasFailed(error.message)));
};

export const postIdea = ideaText => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  return firestore.collection('ideas').add({
    text: ideaText,
    author: {
      '_id': auth.currentUser.uid,
      'username' : auth.currentUser.displayName ? auth.currentUser.displayName : auth.currentUser.email
    },
    likedRank: 0,
    flaggedRank: 0,
    createdAt: firebasestore.FieldValue.serverTimestamp(),
    updatedAt: firebasestore.FieldValue.serverTimestamp()
  })
  .then(docRef => {
      firestore.collection('ideas').doc(docRef.id).get()
          .then(doc => {
              if (doc.exists) {
                  const data = doc.data();
                  const _id = doc.id;
                  let idea = {_id, ...data};
                  dispatch(addIdea(idea))
              } else {
                  console.log("No such document!");
              }
          });
  })
  .catch(error => { console.log('Post Idea ', error.message);
      alert('Your Idea could not be posted\nError: '+ error.message); })
};

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

// TODO: test
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

// TODO: test
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

// TODO: test
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

// TODO: test
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

// TODO: test
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

// TODO: test
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

// TODO: fix (!!)
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

// TODO: fix (!!)
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

export const addSortedIdeas = ideas => {
  return(
    { type: ActionTypes.ADD_SORTED_IDEAS,
      payload: ideas.sort((a,b) => a.likedRank > b.likedRank ? -1 : 1)
    }
  );
};

const addIdea = idea => (
  {
    type: ActionTypes.ADD_IDEA,
    payload: idea
  }
);

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

// TODO: Implement
const changeLikedRank = (ideaId, newLikedRank) => (
  {
    type: ActionTypes.CHANGE_LIKED_RANK,
    payload: { ideaId, newLikedRank }
  }
);
  
// TODO: Implement
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

  auth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  localStorage.removeItem('user');
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

export const signUpUser = creds => dispatch => {
  dispatch(requestSignUp());

  auth.createUserWithEmailAndPassword(creds.email, creds.password)
  .then(response => dispatch(receiveSignUp(response)))
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
