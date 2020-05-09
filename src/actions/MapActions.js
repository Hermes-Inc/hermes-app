import SocketController from 'controllers/SocketController';
import { asyncActionCreator } from './utils';
import getReadableDateTime from 'helpers/functions/getReadableDateTime';

const actionTypes = {
  LOCATE: asyncActionCreator('LOCATE'),
  UNMOUNT: 'UNMOUNT',
};

export class MapActions {
  constructor(controller) {
    this.controller = controller;
    this.types = actionTypes;
  }

  locate = (coordinates) => async (dispatch) => {
    try {
      const channel = await this.controller.useChannel('example');
      const {latitude, longitude} = coordinates;
      channel.push('example:broadcast', {latitude, longitude, message: 'Hello Phoenix!', ...getReadableDateTime()});
      dispatch({
        type: this.types.LOCATE.success,
        payload: { coordinates },
      });
    } catch (e) {
      dispatch({
        type: this.types.LOCATE.failure,
        error: error.message,
      });
    }
  };

  unmount = () => async (dispatch) => {
    this.controller.leaveChannel('example');
    dispatch({ type: this.types.UNMOUNT });
  }
}

export default new MapActions(SocketController);
