import UserActions from 'actions/UserActions';

const initialState = {
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UserActions.types.LOGIN.request:
      return {
        ...state,
      };
    case UserActions.types.LOGIN.success:
      return {
        ...state,
        user: action.payload.user,
      };
    case UserActions.types.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
