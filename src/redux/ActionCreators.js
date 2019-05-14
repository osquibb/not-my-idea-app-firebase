import * as ActionTypes from './ActionTypes';

// Action creator function
// args: 1 idea object
// returns action object.  fields: type and data (which holds the 1 idea)
export const addIdea = idea => (
  { type: ActionTypes.ADD_IDEA,
    data: idea
  }
);

// Action creator function
// args: An array of sorted ideas
// returns action object.  fields: type and data (which holds sorted ideas array)
export const addSortedIdeas = ideas => {
  return(
    { type: ActionTypes.ADD_SORTED_IDEAS,
      data: ideas.sort((a,b) => a.rank > b.rank ? -1 : 1)
    }
  );
};

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

// Thunk action creator function (curried) which implemeents a
// PUT request to flag an idea (ie. idea.flagged = true/false)
// args: 1 idea to flag
// thunk: PUT request
// returns: a function that takes dispatch and (optionally)
// getState which returns an action object created by changeIdea
export const flagIdea = (idea) => dispatch => {
  const ideaToFlag = idea;
  ideaToFlag.flagged = !ideaToFlag.flagged;

  return fetch(`/ideas/${idea._id}`, {
    method: 'PUT',
    body: JSON.stringify(ideaToFlag),
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


// // Action creator function
// // args: 1 flag idea id
// // returns action object.  fields: type and data (which holds the 1 flagged idea id)
// export const flagIdea = ideaToFlag => (
//   { type: ActionTypes.FLAG_IDEA,
//     data: flagIdeaId
//   }
// );

// Thunk action creator function (curried) which fetches Ideas from the server
// returns: a function that takes dispatch and (optionally)
// getState which returns an action object (created by either 
// addIdeas or ideasFailed).
export const fetchIdeas = () => dispatch => {
  return fetch('/ideas') // fetch ideas from the server
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
    .then(ideas => dispatch(addSortedIdeas(ideas)))
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
  const newIdea = {
                    text: ideaText,
                    flagged: false
                  };
  newIdea.rank = 0;

  return fetch('/ideas', {
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

// Thunk action creator function (curried) which implemeents a
// PUT request to increment the rank of an idea
// args: 1 idea to increment rank
// thunk: PUT request
// returns: a function that takes dispatch and (optionally)
// getState which returns an action object created by changeIdea
export const incrementRank = (idea) => dispatch => {
  const incrementRankIdea = idea;
  incrementRankIdea.rank++;

  return fetch(`/ideas/${idea._id}`, {
    method: 'PUT',
    body: JSON.stringify(incrementRankIdea),
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

// Action creator function
// args: 1 changed idea
// returns action object.  fields: type and data (which 1 changed idea)
const changeIdea = (idea) => {
  return (
    {
      type: ActionTypes.CHANGE_IDEA,
      data: idea
    }
  );      
};


