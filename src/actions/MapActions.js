import SocketController from 'controllers/SocketController';
import { asyncActionCreator } from './utils';
import getReadableDateTime from 'helpers/functions/getReadableDateTime';

const actionTypes = {
  LOCATE: asyncActionCreator('LOCATE'),
};

export class MapActions {
  constructor(controller) {
    this.controller = controller;
    this.types = actionTypes;
  }

  locate = (coordinates) => async (dispatch) => {
    console.log(coordinates);
    const channel = await this.controller.useChannel('example');
    const {latitude, longitude} = coordinates;
    // TODO: wrap this a bit more, use a custom channel class to improve error handling
    channel.push('example:broadcast', {latitude, longitude, message: 'Hello Phoenix!', ...getReadableDateTime()});
  };
}

export default new MapActions(SocketController);
