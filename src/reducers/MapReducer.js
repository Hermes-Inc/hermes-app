import MapActions from 'actions/MapActions';

const initialState = {
  coordinates: null,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MapActions.types.LOCATE.request:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default mapReducer;
