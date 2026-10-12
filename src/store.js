import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'

import { productsReducer, productDetailsReducer } from './reducers/productReducers'
import {
    authReducer,
    userReducer,
    forgotPasswordReducer,
    userDetailsReducer,
} from './reducers/userReducers'
import { cartReducer } from './reducers/cartReducers'

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {},
    },
    auth: {},
    user: {},
}

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    userDetails: userDetailsReducer,
    cart: cartReducer,
})

const store = createStore(reducer, initialState, applyMiddleware(thunk))
export default store