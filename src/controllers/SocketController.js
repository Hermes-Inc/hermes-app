import { Socket } from 'helpers/Phoenix';
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
      const phoenixChannel = this.socket.channel(name);
      return new Promise((resolve, reject) => {
        phoenixChannel.join()
          .receive('ignore', () => reject('Access denied.'))
          .receive('ok', () => {
            console.log('Access granted.');
            this.activeChannels.push({name, channel: phoenixChannel});
            resolve(phoenixChannel);
          })
          .receive('timeout', () => reject('Timed out.'));
      });
    } else {
      return this.activeChannels[index].channel;
    }
  }

  leaveChannel(name) {
    const index = this.activeChannels.findIndex(channel => channel.name === name);
    if (index < 0) { return; }
    const phoenixChannel = this.activeChannels[index];
    phoenixChannel.channel.leave();
    this.activeChannels = [
      ...this.activeChannels.slice(0, index),
      ...this.activeChannels.slice(index + 1),
    ];
  }
}

export default new SocketController();
