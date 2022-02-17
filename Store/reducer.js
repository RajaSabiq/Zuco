import {
  ADD_MEMBERSHIP,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_ORDER_ID,
} from './actions';

const initialState = {
  cart: [],
  orderId: null,
  goingForPayment: false,
  isMemberShipInCart: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.product],
        isMemberShipInCart: action.product.isMembership,
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(
          (product) => product.product.id !== action.product.id
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        goingForPayment: false,
        isMemberShipInCart: false,
        orderId: null,
      };
    case 'isPayment':
      return { ...state, goingForPayment: action.isPayment };
    case SAVE_ORDER_ID:
      return {
        ...state,
        orderId: action.orderId,
        goingForPayment: action.goingForPayment,
      };
    default:
      return state;
  }
};

export default reducer;
