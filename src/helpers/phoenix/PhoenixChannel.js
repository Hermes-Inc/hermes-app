export default class PhoenixChannel {
  constructor(name, channel) {
    this.name = name;
    this.channel = channel;
  }

  join(okCallback, errorCallback) {
    this.channel.join()
      .receive('ok', okCallback)
      .receive('timeout', errorCallback)
      .receive('ignore', errorCallback);
  }

  push(event, payload, timeout) {
    try {
      this.channel.push(event, payload, timeout);
    } catch (e) {
      throw new Error(`There was an error publishing event ${event} on channel ${this.name}`);
    }
  }

  leave() {
    try {
      this.channel.leave();
    } catch (e) {
      throw new Error(`There was a problem leaving channel ${this.name}`);
    }
  }
}
