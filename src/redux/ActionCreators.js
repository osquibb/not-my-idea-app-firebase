import * as ActionTypes from './ActionTypes';

/* Action creator function
args: 1 idea object
returns action object.  fields: type and payload (which holds the 1 idea) */
export const addIdea = idea => (
  { type: ActionTypes.ADD_IDEA,
    payload: idea
  }
);

/* Action creator function
args: An array of sorted ideas
returns action object.  fields: type and payload (which holds sorted ideas array) */
export const addSortedIdeas = ideas => {
  return(
    { type: ActionTypes.ADD_SORTED_IDEAS,
      payload: ideas.sort((a,b) => a.rank > b.rank ? -1 : 1)
    }
  );
};

// Action creator function
// returns an empty action (no payload) with type IDEAS_LOADING
export const ideasLoading = () => (
  { type: ActionTypes.IDEAS_LOADING }
);

/* Action creator function
args: An error message
returns action object.  fields: type and payload (which holds the error message) */
export const ideasFailed = errorMessage => (
  { type: ActionTypes.IDEAS_FAILED,
    payload: errorMessage
  }
);

/* Thunk action creator function (curried) which fetches Ideas from the server
returns: a function that takes dispatch and (optionally)
getState which returns an action object (created by either 
addIdeas or ideasFailed). */
export const fetchIdeas = () => dispatch => {
  return fetch('/ideas')
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        let error = new Error('Error ' + response.status
                    + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
      let errorMessage = new Error(error.message);
      throw errorMessage;
    })
    .then(response => response.json())
    .then(ideas => dispatch(addSortedIdeas(ideas)))
    .catch(error => dispatch(ideasFailed(error.message)));
};

/* Thunk action creator function (curried) which posts 1 idea to the server
args: 1 idea
returns: a function that takes dispatch and (optionally)
getState which returns an action object created by 
addIdea or it calls alert() */
export const postIdea = ideaText => dispatch => {
  const newIdea = { text: ideaText };
  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch('/ideas', {
    method: 'POST',
    body: JSON.stringify(newIdea),  // post the 1 idea to the server
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        let error = new Error('Error ' + response.status
                    + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
      let errorMessage = new Error(error.message);
      throw errorMessage;
    })
    .then(response => response.json())
    .then(idea => dispatch(addIdea(idea)))
    .catch(error => alert('Error: ' + error.message));
};

/* Thunk action creator function (curried) which implemeents a
POST request to like an array of ideas
args: an array of ideas to like
thunk: POST request
returns: a function that takes dispatch and (optionally)
getState which returns an action object created by updateIdea */
export const likeIdeas = ideas => dispatch => {
  const ideasToLike = ideas.map(idea => {
    return({"_id": idea._id});
  });
  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch(`/users/likedIdeas`, {
    method: 'POST',
    body: JSON.stringify(ideasToLike),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    credentials: 'same-origin'
  })
  .then(response => {
    if (response.ok) {
      return response;
    }
    else {
      let error = new Error('Error ' + response.status
                  + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  error => {
    let errorMessage = new Error(error.message);
    throw errorMessage;
  })
  .then(response => response.json())
  .then(ideas => dispatch(updateIdeas(ideas, toLike=true)))
  .catch(error => alert('Error: ' + error.message));
};

/* Thunk action creator function (curried) which implemeents a
POST request to flag an array of ideas
args: an array of ideas to flag
thunk: POST request
returns: a function that takes dispatch and (optionally)
getState which returns an action object created by updateIdea */
export const flagIdeas = ideas => dispatch => {
  const ideasToFlag = ideas.map(idea => {
    return({"_id": idea._id});
  });
  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch(`/users/flaggedIdeas`, {
    method: 'POST',
    body: JSON.stringify(ideasToFlag),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    credentials: 'same-origin'
  })
  .then(response => {
    if (response.ok) {
      return response;
    }
    else {
      let error = new Error('Error ' + response.status
                  + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  error => {
    let errorMessage = new Error(error.message);
    throw errorMessage;
  })
  .then(response => response.json())
  .then(ideas => dispatch(updateIdeas(ideas, toFlag=true)))
  .catch(error => alert('Error: ' + error.message));
};

/* Action creator function
args: 1 array of ideas
returns action object.  fields: type and payload (which update ideas) */
const updateIdeas = (ideas, toLike=false, toFlag=false) => {
  if (toLike) {
    for(let i=0; i < ideas.length; i++) {
      ideas[i].liked = true;
    }
    return (
      {
        type: ActionTypes.UPDATE_IDEAS,
        payload: ideas
      }
    );      
  }
  if (toFlag) {
    for(let i=0; i < ideas.length; i++) {
      ideas[i].flagged = true;
    }
    return (
      {
        type: ActionTypes.UPDATE_IDEAS,
        payload: ideas
      }
    );      
  }
  else {
    return (
      {
        type: ActionTypes.UPDATE_IDEAS,
        payload: ideas
      }
    );      
  }
};


