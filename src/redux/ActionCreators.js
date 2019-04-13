import * as ActionTypes from './ActionTypes';
import { baseUrl } from './baseUrl';

// Action creator function
// args: 1 idea object
// returns action object.  fields: type and data (which holds the 1 idea)
export const addIdea = idea => (
  { type: ActionTypes.ADD_IDEA,
    data: idea
  }
);

// Action creator function
// args: An array of ideas
// returns action object.  fields: type and data (which holds ideas array)
export const addIdeas = ideas => (
  { type: ActionTypes.ADD_IDEAS,
    data: ideas
  }
);

// Action creator function
// returns an empty action (no data) with type IDEAS_LOADING
export const ideasLoading = () => (
  { type: ActionTypes.IDEAS_LOADING }
);

// Action creator function
// args: An error message
// returns action object.  fields: type and data (which holds the error message)
export const ideasFailed = errorMessage => (
  { type: ActionTypes.IDEAS_FAILED,
    data: errorMessage
  }
);

// Action creator function
// args: 1 flagged idea id
// returns action object.  fields: type and data (which holds the 1 flagged idea id)
export const removeIdea = flaggedIdeaId => (
  { type: ActionTypes.REMOVE_IDEA,
    data: flaggedIdeaId
  }
);

// Thunk action creator function (curried) which fetches Ideas from the server
// returns: a function that takes dispatch and (optionally)
// getState which returns an action object (created by either 
// addIdeas or ideasFailed).
export const fetchIdeas = () => dispatch => {
  return fetch(baseUrl + 'ideas') // fetch ideas from the server
    .then(response => {
      // if server is contacted (Promise Fulfilled) 
      // & response status is 200-299
      if (response.ok) {
        return response;
      }
      // if server is contacted (Promise Fulfilled)
      // & code status is NOT 200-299
      else {
        let error = new Error('Error ' + response.status
                    + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    // if server communication failes.  (Promise Rejected)
    error => {
      let errorMessage = new Error(error.message);
      throw errorMessage;
    })
    .then(response => response.json())
    .then(ideas => dispatch(addIdeas(ideas)))
    // catch either of the thrown errors and then have
    // ideasFailed create an action object
    .catch(error => dispatch(ideasFailed(error.message)));
};

// Thunk action creator function (curried) which posts 1 idea to the server
// args: 1 idea
// returns: a function that takes dispatch and (optionally)
// getState which returns an action object created by 
// addIdea or it calls alert()
export const postIdea = ideaText => dispatch => {
  const newIdea = {text: ideaText};
  newIdea.rank = 0;
  newIdea.date = new Date().toISOString();

  return fetch(baseUrl + 'ideas', {
    method: 'POST',
    body: JSON.stringify(newIdea),  // post the 1 idea to the server
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      // if server is contacted (Promise Fulfilled) 
      // & response status is 200-299
      if (response.ok) {
        return response;
      }
      // if server is contacted (Promise Fulfilled)
      // & code status is NOT 200-299
      else {
        let error = new Error('Error ' + response.status
                    + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    // if server communication failes.  (Promise Rejected)
    error => {
      let errorMessage = new Error(error.message);
      throw errorMessage;
    })
    .then(response => response.json())
    // have addIdea create an action which adds the 1 idea to the state's array
    .then(idea => dispatch(addIdea(idea)))
    // catch either of the thrown errors and then call alert()
    .catch(error => alert('Error: ' + error.message));
};

// Thunk action creator function (curried) which deletes 1 flagged idea from the server
// args: 1 flagged idea id
// returns: a function that takes dispatch and (optionally)
// getState which returns an action object created by removeIdea
export const deleteIdea = flaggedIdeaId => dispatch => {
  return fetch(baseUrl + `ideas/${flaggedIdeaId}`, {
    method: 'DELETE',
    credentials: 'same-origin'
  })
  .then(response => {
    // if server is contacted (Promise Fulfilled) 
    // & response status is 200-299
    if (response.ok) {
      return response;
    }
    // if server is contacted (Promise Fulfilled)
    // & code status is NOT 200-299
    else {
      let error = new Error('Error ' + response.status
                  + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  // if server communication failes.  (Promise Rejected)
  error => {
    let errorMessage = new Error(error.message);
    throw errorMessage;
  })
  .then(() => dispatch(removeIdea(flaggedIdeaId)))
  .catch(error => alert('Error: ' + error.message));
};

// In dev...
export const changeRank = (idea, up) => dispatch => {
  const changeRankIdea = idea;
  up ? changeRankIdea.rank++ : changeRankIdea.rank--;

  return fetch(baseUrl + `ideas/${idea.id}`, {
    method: 'PUT',
    body: JSON.stringify(changeRankIdea),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  .then(response => {
    // if server is contacted (Promise Fulfilled) 
    // & response status is 200-299
    if (response.ok) {
      return response;
    }
    // if server is contacted (Promise Fulfilled)
    // & code status is NOT 200-299
    else {
      let error = new Error('Error ' + response.status
                  + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  // if server communication failes.  (Promise Rejected)
  error => {
    let errorMessage = new Error(error.message);
    throw errorMessage;
  })
  .then(response => response.json())
  // have addIdea create an action which adds the 1 idea to the state's array
  .then(idea => dispatch(changeIdea(idea)))
  // catch either of the thrown errors and then call alert()
  .catch(error => alert('Error: ' + error.message));

};

// In dev...
const changeIdea = (idea) => {
  
  return (
    {
      type: ActionTypes.CHANGE_IDEA,
      data: idea
    }
  );      
};