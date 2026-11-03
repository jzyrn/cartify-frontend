import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, REMOVE_ITEMS_CART, SAVE_SHIPPING_INFO, CLEAR_CART } from '../constants/cartConstants'

// Same structure as the professor's file. Differences kept for Cart.jsx:
//  - shade (default '') so one product can sit in the cart in several shades
//  - brand is saved on the cart line
//  - only logged-in users can add to the cart (returns false otherwise)
//  - images?.[0]?.url so a product with no image doesn't crash
export const addItemToCart = (id, quantity, shade = '', clampToAvailableStock = false) => async (dispatch, getState) => {
    if (!getState().auth?.isAuthenticated) {
        return false
    }

    const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
    const product = data.product
    const requestedQuantity = Number(quantity)
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        throw new Error('Choose a quantity of at least 1.')
    }
    const availableStock = Number(product.stock || 0)
    if (requestedQuantity > availableStock && !clampToAvailableStock) {
        throw new Error(`Only ${Number(product.stock || 0)} unit(s) are currently available.`)
    }
    const safeQuantity = clampToAvailableStock ? Math.min(requestedQuantity, availableStock) : requestedQuantity
    if (safeQuantity < 1) throw new Error('This product is currently out of stock.')
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images?.[0]?.url || '',
            stock: product.stock,
            shade,
            quantity: safeQuantity
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    return true
}

// the professor's version takes only the id; the shade is needed to tell cart lines apart
export const removeItemFromCart = (id, shade = '') => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: { product: id, shade }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemsFromCart = (items) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEMS_CART,
        payload: items.map(({ product, shade }) => ({ product, shade: shade || '' })),
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))
}

// used by Payment.jsx after the order is placed.
// The professor's version only changes Redux, so the old cart came back after a refresh;
// this one also clears what was saved in localStorage.
export const clearCart = () => async (dispatch) => {
    dispatch({
        type: CLEAR_CART,
    })
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingInfo')
}
