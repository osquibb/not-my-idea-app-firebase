import * as ActionTypes from './ActionTypes';

// IDEAS REDUCER
// args: original state + action (object created by ActionCreator)
// returns: new state (NOT MUTATED ORIGINAL) with changes
// dependent upon action type (hence the swtich statement)
export const Ideas = (state = {
                                isLoading: true,
                                errorMessage: null,
                                ideas: [],
                                likedIdeas: [],
                                flaggedIdeas: [] 
                              },
                      action) => {
    switch (action.type) {

      // State's ideas array REPLACED BY action's payload (sorted ideas array)
      // isLoading set to false
      case ActionTypes.ADD_SORTED_IDEAS:
        return {...state,
                   isLoading: false,
                   errorMessage: null,
                   ideas: action.payload
        };

      // Action's payload (1 idea) ADDED TO state's ideas array
      // Rest of state unchanged
      case ActionTypes.ADD_IDEA:
        return {...state, 
                ideas: state.ideas.concat(action.payload)
        };

      // isLoading SET TO (or REPLACED BY) true
      // Rest of state fields REPLACED BY initial values.
      case ActionTypes.IDEAS_LOADING:
        return {...state,
                   isLoading: true,
                   errorMessage: null,
                   ideas: []
        };

      // errorMessage REPLACED BY action's payload (error message)
      // Rest of state fields REPLACED BY initial values
      case ActionTypes.IDEAS_FAILED:
        return {...state,
                   isLoading: false,
                   errorMessage: action.payload,
                   ideas: []
        };

      case ActionTypes.ADD_FLAGGED_IDEAS:
        return {...state, 
                flaggedIdeas: state.flaggedIdeas.concat(action.payload)
        };

      case ActionTypes.ADD_LIKED_IDEAS:
        return {...state, 
                likedIdeas: state.likedIdeas.concat(action.payload)
        };

      case ActionTypes.REMOVE_LIKED_AND_FLAGGED_IDEAS:
        return {...state,
                likedIdeas: [],
                flaggedIdeas: []
        };
      
      default:
        return state;
    }
};
