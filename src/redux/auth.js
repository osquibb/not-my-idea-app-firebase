import * as ActionTypes from './ActionTypes';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export const Auth = (state = {
        isLoading: false,
        isAuthenticated: false,
        isSignedUp: false,
        user: null,
        errMess: null
    }, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: false
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                errMess: '',
                user: action.user
            };
        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: action.message
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                user: null
            };
        case ActionTypes.SIGN_UP_REQUEST:
                return {...state,
                    isLoading: true,
                    isSignedUp: false
                };
            case ActionTypes.SIGN_UP_SUCCESS:
                return {...state,
                    isLoading: false,
                    isSignedUp: true
                };
            case ActionTypes.SIGN_UP_FAILURE:
                return {...state,
                    isLoading: false,
                    isSignedUp: false,
                    errMess: action.message  
                };

        default:
            return state
    }
}