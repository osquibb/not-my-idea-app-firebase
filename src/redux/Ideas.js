import * as ActionTypes from './ActionTypes';

// IDEAS REDUCER
// args: original state + action (object created by ActionCreator)
// returns: new state (NOT MUTATED ORIGINAL) with changes
// dependent upon action type (hence the swtich statement)
export const Ideas = (state = {
        isLoading: true,
        errorMessage: null,
        ideas: []
  }, action) => {
    switch (action.type) {

      // State's ideas array REPLACED BY action's data (sorted ideas array)
      // isLoading set to false
      case ActionTypes.ADD_SORTED_IDEAS:
        return {...state,
                   isLoading: false,
                   errorMessage: null,
                   ideas: action.data
        };

      // Action's data (1 idea) ADDED TO state's ideas array
      // Rest of state unchanged
      case ActionTypes.ADD_IDEA:
        const idea = action.data;
        return {...state, ideas: state.ideas.concat(idea)};

      // isLoading SET TO (or REPLACED BY) true
      // Rest of state fields REPLACED BY initial values.
      case ActionTypes.IDEAS_LOADING:
        return {...state,
                   isLoading: true,
                   errorMessage: null,
                   ideas: []
        };

      // errorMessage REPLACED BY action's data (error message)
      // Rest of state fields REPLACED BY initial values
      case ActionTypes.IDEAS_FAILED:
        return {...state,
                   isLoading: false,
                   errorMessage: action.data,
                   ideas: []
        };

      // 1 idea REPLACED by flagged idea
      // Rest of state unchanged
      case ActionTypes.FLAG_IDEA:
        const ideaToFlag = state.ideas.filter(idea => idea._id === action.data._id)[0];
        const ideaToFlagIdx = state.ideas.indexOf(ideaToFlag);
        
        if(ideaToFlagIdx !== -1) {
          const newIdeas = state.ideas;
          newIdeas[ideaToFlagIdx] = action.data;
          return {...state, ideas: newIdeas};
        } else { 
            return state;
        }

      // 1 idea REPLACED BY changed idea
      // Rest of state unchanged
      case ActionTypes.CHANGE_IDEA:
        const ideaToChange = state.ideas.filter(idea => idea._id === action.data._id)[0];
        const ideaToChangeIdx = state.ideas.indexOf(ideaToChange);

        if(ideaToChangeIdx !== -1) {
          const newIdeas = state.ideas;
          newIdeas[ideaToChangeIdx] = action.data;
          return {...state, ideas: newIdeas};
        } else { 
            return state;
        }
        
      default:
        return state;
    }
};
