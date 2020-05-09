// THIS ZOOMS CORRECTLY OVER A SET OF COORDINATES
const getRegionForCoordinates = points => {
  // points should be an array of { latitude: X, longitude: Y } or just an object
  let minX, maxX, minY, maxY;

  if (typeof(points) == 'object') {
    points = [points];
  }

  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = points.length === 1 ? 0.0043 : (maxX - minX);
  const deltaY = points.length === 1 ? 0.0034 : (maxY - minY);

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY,
  };
};

export default getRegionForCoordinates;
