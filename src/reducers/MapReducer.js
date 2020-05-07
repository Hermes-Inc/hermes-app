import MapActions from 'actions/MapActions';

const initialState = {
  coordinates: null,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MapActions.types.LOCATE.success:
      return {
        ...state,
        coordinates: action.payload.coordinates,
      };
    case MapActions.types.UNMOUNT:
      return initialState;
    default:
      return state;
  }
};

export default mapReducer;
