import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'

import {
    authReducer,
    userReducer,
    forgotPasswordReducer,
    userDetailsReducer,
} from './reducers/userReducers'

const reducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    userDetails: userDetailsReducer,
})

const store = createStore(reducer, { auth: {}, user: {} }, applyMiddleware(thunk))
export default store