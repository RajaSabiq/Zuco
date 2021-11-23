export const initialState = {
  impersonate_url: null,
  isActiveMemberShip: true,
};

//Selector

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MEMBERSHIP':
      return {
        ...state,
        isActiveMemberShip: action.isActiveMemberShip,
        impersonate_url: action.impersonate_url,
      };
    default:
      return state;
  }
};

export default reducer;
