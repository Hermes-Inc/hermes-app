const getReadableDateTime = () => {
  const currentDate = new Date();
  return { timestamp: 'Last Sync: ' + currentDate.getDate() + '/'
      + (currentDate.getMonth() + 1)  + '/'
      + currentDate.getFullYear() + ' @ '
      + currentDate.getHours() + ':'
      + currentDate.getMinutes() + ':'
      + (currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds()) };
};

const dateDiffInSeconds = (d1, d2) =>{
  const dif = d1.getTime() - d2.getTime();
  return Math.abs(dif / 1000);
};

export { getReadableDateTime, dateDiffInSeconds};
