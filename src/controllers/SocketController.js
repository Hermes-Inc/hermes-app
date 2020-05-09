import { Socket } from 'helpers/phoenix/Phoenix';
import PhoenixChannel from 'helpers/phoenix/PhoenixChannel';
const url = 'http://192.168.1.3:4000/socket';

class SocketController {
  constructor() {
    let socket = new Socket(url, {});
    socket.connect();
    this.socket = socket;
    this.activeChannels = [];
  }

  async useChannel(name) {
    const index = this.activeChannels.findIndex(channel => channel.name === name);
    if (index < 0) {
      const phoenixChannel = new PhoenixChannel(name, this.socket.channel(name));
      return new Promise((resolve, reject) => {
        phoenixChannel.join(
          () => {
            console.log('Access granted.');
            this.activeChannels.push(phoenixChannel);
            resolve(phoenixChannel);
          },
          () => reject(`Error connecting to channel ${phoenixChannel.name}`)
        )
      });
    } else {
      return this.activeChannels[index].channel;
    }
  }

  leaveChannel(name) {
    const index = this.activeChannels.findIndex(channel => channel.name === name);
    if (index < 0) { return; }
    const phoenixChannel = this.activeChannels[index];
    phoenixChannel.leave();
    this.activeChannels = [
      ...this.activeChannels.slice(0, index),
      ...this.activeChannels.slice(index + 1),
    ];
  }
}

export default new SocketController();
