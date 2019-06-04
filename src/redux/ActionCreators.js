import * as ActionTypes from './ActionTypes';
import { auth, firestore, fireauth, firebasestore } from '../firebase/firebase';


export const addIdea = idea => (
  {
    type: ActionTypes.ADD_IDEA,
    payload: idea
  }
);

export const addSortedIdeas = ideas => {
  return(
    { type: ActionTypes.ADD_SORTED_IDEAS,
      payload: ideas.sort((a,b) => a.likedRank > b.likedRank ? -1 : 1)
    }
  );
};

export const ideasLoading = () => (
  { type: ActionTypes.IDEAS_LOADING }
);

export const ideasFailed = errorMessage => (
  { type: ActionTypes.IDEAS_FAILED,
    payload: errorMessage
  }
);


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

export const postLikedIdea = ideaId => dispatch => {

  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  return firestore.collection('likedIdeas').add({
    user: auth.currentUser.uid,
    ideaId: ideaId
  })
  .then(docRef => {
      firestore.collection('likedIdeas').doc(docRef.id).get()
          .then(doc => {
              if (doc.exists) {
                  dispatch(fetchLikedIdeas());
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          });
  })
  .catch(error => dispatch(ideasFailed(error.message)));
};

export const postFlaggedIdea = ideaId => dispatch => {
  
  if (!auth.currentUser) {
    console.log('No user logged in!');
    return;
  }

  return firestore.collection('flaggedIdeas').add({
    user: auth.currentUser.uid,
    idea: ideaId
  })
  .then(docRef => {
      firestore.collection('flaggedIdeas').doc(docRef.id).get()
          .then(doc => {
              if (doc.exists) {
                  dispatch(fetchFlaggedIdeas());
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          });
  })
  .catch(error => dispatch(ideasFailed(error.message)));
};


const addLikedIdeas = likedIdeaIds => (
  {
    type: ActionTypes.ADD_LIKED_IDEAS,
    payload: likedIdeaIds
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

// export const googleLogin = () => (dispatch) => {
//   const provider = new fireauth.GoogleAuthProvider();

//   auth.signInWithPopup(provider)
//       .then((result) => {
//           var user = result.user;
//           localStorage.setItem('user', JSON.stringify(user));
//           // Dispatch the success action
//           dispatch(fetchFavorites());
//           dispatch(receiveLogin(user));
//       })
//       .catch((error) => {
//           dispatch(loginError(error.message));
//       });
// }
