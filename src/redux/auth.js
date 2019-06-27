import * as ActionTypes from './ActionTypes';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export const Auth = (state = {
        isLoading: false,
        isAuthenticated: false,
        isSignedUp: false,
        newUser: false,
        verified: false,
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
                isSignedUp: true,
                newUser: false,
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
                user: null,
                newUser: false
            };
        case ActionTypes.SIGN_UP_REQUEST:
                return {...state,
                    isLoading: true
                };
            case ActionTypes.SIGN_UP_SUCCESS:
                return {...state,
                    isLoading: false,
                    isSignedUp: true,
                    newUser: false
                };
            case ActionTypes.SIGN_UP_FAILURE:
                return {...state,
                    isLoading: false,
                    isSignedUp: false,
                    errMess: action.message  
                };
            case ActionTypes.SET_VERIFIED:
                return {...state,
                    verified: action.payload
                };
            case ActionTypes.SET_NEW_USER:
                return {...state,
                    newUser: action.payload
                };

        default:
            return state
    }
}