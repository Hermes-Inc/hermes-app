const broadcastCoordinates = (exampleChannel, region) => {
  if (!exampleChannel || !region) {
    return;
  }
  const {latitude, longitude} = region;
  const currentDate = new Date();
  const datetime = 'Last Sync: ' + currentDate.getDate() + '/'
    + (currentDate.getMonth() + 1)  + '/'
    + currentDate.getFullYear() + ' @ '
    + currentDate.getHours() + ':'
    + currentDate.getMinutes() + ':'
    + (currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds());
  exampleChannel.push('example:broadcast', {latitude, longitude, message: 'Hello Phoenix!', timestamp: datetime});
};

class CoordinatesUpdater {
  setState (exampleChannel, region) {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(broadcastCoordinates, 5000, exampleChannel, region);
  }
}
let coordinatesUpdater = new CoordinatesUpdater();

export default coordinatesUpdater;
