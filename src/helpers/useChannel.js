import { useState, useContext, useEffect } from 'react';
import { PhoenixSocketContext } from './PhoenixSocketContext';

const useChannel = channelName => {
  const [channel, setChannel] = useState();
  const { socket } = useContext(PhoenixSocketContext);

  useEffect(() => {
    const phoenixChannel = socket.channel(channelName);

    phoenixChannel.join()
      .receive('ignore', () => console.log('Access denied.'))
      .receive('ok', () => {
        console.log('Access granted');
        setChannel(phoenixChannel);
      })
      .receive('timeout', () => console.log('Must be MongoDB.'));

    return () => {
      phoenixChannel.leave();
    };
  }, [channelName, socket]);

  return [channel];
};

export default useChannel;
