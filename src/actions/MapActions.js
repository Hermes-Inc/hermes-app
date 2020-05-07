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
    const channel = await this.controller.useChannel('example');
    const {latitude, longitude} = coordinates;
    // TODO: wrap this a bit more, use a custom channel class to improve error handling
    channel.push('example:broadcast', {latitude, longitude, message: 'Hello Phoenix!', ...getReadableDateTime()});
    dispatch({
      type: this.types.LOCATE.success,
      payload: { coordinates },
    });
  };

  unmount = () => async (dispatch) => {
    this.controller.leaveChannel('example');
    dispatch({ type: this.types.UNMOUNT });
  }
}

export default new MapActions(SocketController);
