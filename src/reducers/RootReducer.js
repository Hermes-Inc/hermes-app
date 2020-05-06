import { combineReducers } from 'redux';
import error from './ErrorReducer';
import user from './UserReducer';
import status from './StatusReducer';
import map from './MapReducer';

const rootReducer = combineReducers({
  error,
  user,
  status,
  map,
});

export default rootReducer;
