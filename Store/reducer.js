import { ADD_TO_CART, REMOVE_FROM_CART } from './actions';

const initialState = {
  cart: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { ...state, cart: [...state.cart, action.product] };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(
          (product) => product.product.id !== action.product.id
        ),
      };
    default:
      return state;
  }
};

export default reducer;
