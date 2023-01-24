import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import React from 'react';

type Props = {
  appID: string;
  channelID: string;
  username: string;
};

const useAgoraRTM = ({ appID, channelID, username }: Props) => {
  const [channel, setChannel] = React.useState<RtmChannel>();
  const [client, setClient] = React.useState<RtmClient>();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [triggerLogin, setTriggerLogin] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (channelID) {
      setClient(AgoraRTM.createInstance(appID));
    }
  }, [appID, channelID]);

  const login = async () => {
    if (!isAuthenticated) {
      try {
        await client?.login({ uid: username });
        await client?.addOrUpdateLocalUserAttributes({ name: username });
      } catch (e) {
        console.log('[ERROR]', e);
        setIsAuthenticated(false);
      }
      setIsAuthenticated(true);
    }
  };

  const joinChannel = async () => {
    const newChannel = await client?.createChannel(channelID);
    await newChannel?.join();
    setChannel(newChannel);
  };

  React.useEffect(() => {
    if (client && !channel && !isAuthenticated && triggerLogin) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, channel, isAuthenticated, triggerLogin]);

  React.useEffect(() => {
    if (client && isAuthenticated) {
      joinChannel();
    }
  }, [client, isAuthenticated]);

  return {
    client,
    channel,
    isAuthenticated,
    joinChannel,
    setTriggerLogin,
  };
};

export { useAgoraRTM };
