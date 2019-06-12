import * as ActionTypes from './ActionTypes';


// IDEAS REDUCER
// args: original state + action (object created by ActionCreator)
// returns: new state (NOT MUTATED ORIGINAL) with changes
// dependent upon action type (hence the swtich statement)
export const Ideas = (state = {
                                isLoading: true,
                                errorMessage: null,
                                lastVisible: null,
                                moreIdeas: false,
                                ideas: [],
                                likedIdeas: [],
                                flaggedIdeas: [] 
                              },
                      action) => {
    switch (action.type) {

      // State's ideas array REPLACED BY action's payload (ideas array)
      // isLoading set to false
      case ActionTypes.ADD_IDEAS:
        return {...state,
                   isLoading: false,
                   errorMessage: null,
                   ideas: action.payload.concat(state.ideas)
        };

      case ActionTypes.UPDATE_LAST_VISIBLE:
          return {...state,
                     lastVisible: action.payload
          };

      case ActionTypes.UPDATE_MORE_IDEAS:
        return {...state,
                    moreIdeas: action.payload
        };

      // isLoading SET TO (or REPLACED BY) true
      // Rest of state fields REPLACED BY initial values.
      case ActionTypes.IDEAS_LOADING:
        return {...state,
                   isLoading: true,
                   errorMessage: null
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

      case ActionTypes.REMOVE_FLAGGED_IDEA:
        return {...state, 
              flaggedIdeas: state.flaggedIdeas.filter(flaggedIdeaId => flaggedIdeaId !== action.payload)
        };

      case ActionTypes.REMOVE_LIKED_IDEA:
        return {...state, 
              likedIdeas: state.likedIdeas.filter(likedIdeaId => likedIdeaId !== action.payload)
        };

      case ActionTypes.CHANGE_LIKED_RANK:
        const newLikedRankideas = [...state.ideas];
        for (let i=0; i < newLikedRankideas.length; i++) {
          if (newLikedRankideas[i]._id === action.payload.ideaId) {
            newLikedRankideas[i].likedRank = action.payload.newLikedRank;
          }
        }

        return {...state, ideas: newLikedRankideas};

      case ActionTypes.CHANGE_FLAGGED_RANK:
        const newFlaggedRankIdeas = [...state.ideas];
        for (let i=0; i < newFlaggedRankIdeas.length; i++) {
          if (newFlaggedRankIdeas[i]._id === action.payload.ideaId) {
            newFlaggedRankIdeas[i].flaggedRank = action.payload.newFlaggedRank;
          }
        }

        return {...state, ideas: newFlaggedRankIdeas};
      

      case ActionTypes.REMOVE_LIKED_AND_FLAGGED_IDEAS:
        return {...state,
                likedIdeas: [],
                flaggedIdeas: []
        };
      
      default:
        return state;
    }
};
