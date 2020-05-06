const getReadableDateTime = () => {
  const currentDate = new Date();
  return { timestamp: 'Last Sync: ' + currentDate.getDate() + '/'
      + (currentDate.getMonth() + 1)  + '/'
      + currentDate.getFullYear() + ' @ '
      + currentDate.getHours() + ':'
      + currentDate.getMinutes() + ':'
      + (currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds()) };
};

export default getReadableDateTime;
