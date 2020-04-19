import UserController from 'controllers/UserController';
import { asyncActionCreator } from './utils';

const actionTypes = {
  LOGIN: asyncActionCreator('LOGIN'),
  LOGOUT: 'LOGOUT',
};

export class UserActions {
  constructor(controller) {
    this.controller = controller;
    this.types = actionTypes;
  }

  login = (email, password) => async (dispatch) => {
    dispatch({ type: this.types.LOGIN.request });
    try {
      const user = await this.controller.login(email, password);
      dispatch({
        type: this.types.LOGIN.success,
        payload: { user },
      });
    } catch (error) {
      dispatch({
        type: this.types.LOGIN.failure,
        error: error.message,
      });
    }
  };

  logout = () => (dispatch) => {
    this.controller.logout();
    dispatch({ type: this.types.LOGOUT });
  };
}

export default new UserActions(UserController);

