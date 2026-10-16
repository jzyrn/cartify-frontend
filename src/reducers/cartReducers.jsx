import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO, CLEAR_CART } from '../constants/cartConstants'

// a cart line is identified by product + shade
const sameLine = (a, b) => a.product === b.product && (a.shade || '') === (b.shade || '')

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const item = action.payload
            const exists = state.cartItems.find(i => sameLine(i, item))
            if (exists) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => (sameLine(i, item) ? item : i))
                }
            }
            return { ...state, cartItems: [...state.cartItems, item] }
        }
        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(i => !sameLine(i, action.payload))
            }
        case SAVE_SHIPPING_INFO:
            return { ...state, shippingInfo: action.payload }
        case CLEAR_CART:
            return { ...state, cartItems: [], shippingInfo: {} }
        default:
            return state
        case CLEAR_CART:
       return { ...state, cartItems: [], shippingInfo: {} }
    }       
}