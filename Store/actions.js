export const ADD_TO_CART = 'ADD_TO_CART';

export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SAVE_ORDER_ID = 'SAVE_ORDER_ID';
export const ADD_MEMBERSHIP = 'ADD_MEMBERSHIP';

export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    product,
  };
};

export const addMemeberShip = (product) => {
  return {
    type: ADD_MEMBERSHIP,
    product,
  };
};

export const removeFromCart = (product) => {
  return {
    type: REMOVE_FROM_CART,
    product,
  };
};

export const saveOrderId = (orderId, goingForPayment) => {
  return {
    type: SAVE_ORDER_ID,
    orderId,
    goingForPayment,
  };
};
