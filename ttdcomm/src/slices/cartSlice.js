import { createSlice } from '@reduxjs/toolkit';
// create api is used when we need asynchronous tasks
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };
// localStorage only store in strings so we need to parse into objects,

// we will stor our item in localStorage so that we come back it still remains in our cart


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // state - current state, action-> data inside our payload
        addToCart: (state, action) => {
            const item = action.payload;

            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            }
            else {
                // add new item to cartItems pre items should be also added
                state.cartItems = [...state.cartItems, item];
            }
            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            // return update cart -- it will update local storage at the same time
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            updateCart(state);
        },
        // after making payment cart must be cleaned
        clearCart: (state, action) => {
            state.cartItems = [];
            updateCart(state);

        },
    } // functions that have to do something with cart
});



export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart } = cartSlice.actions;// any function we create we need to export it as a function
export default cartSlice.reducer;