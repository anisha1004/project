import React from 'react';
import './VideoRoom.css';
import { ReactComponent as VideoIcon } from '../../assets/VideoIcon.svg';
import { ReactComponent as MicOn } from '../../assets/MicOn.svg';
import { ReactComponent as VideoOn } from '../../assets/VideoOn.svg';
import { ReactComponent as VideoOff } from '../../assets/VideoOff.svg';
import { ReactComponent as MicOff } from '../../assets/MicOff.svg';
import { ReactComponent as Share } from '../../assets/Share.svg';
import { ReactComponent as Chat } from '../../assets/Chat.svg';
import { ReactComponent as Options } from '../../assets/Options.svg';
import { ReactComponent as Send } from '../../assets/Send.svg';

import AgoraRTC, {
  ICameraVideoTrack,
  ILocalTrack,
  IMicrophoneAudioTrack,
  UID,
  IAgoraRTCRemoteUser,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng';

import { VideoPlayer } from '../VideoPlayer';
import { RtmChannel } from 'agora-rtm-sdk';

const APP_ID = 'a34fd3487b254281bf58733e72650158';

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({
  onVideoTrack,
  onUserDisconnected,
  channelName,
}: {
  onVideoTrack: (user: IAgoraRTCRemoteUser) => void;
  onUserDisconnected: (user: IAgoraRTCRemoteUser) => void;
  channelName: string;
}) => {
  const client: IAgoraRTCClient = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });

  let tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | ILocalTrack[];

  const waitForConnectionState = (connectionState: string) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (client.connectionState === connectionState) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const connect = async () => {
    await waitForConnectionState('DISCONNECTED');

    await client.join(APP_ID, channelName, null, null);

    client.on('user-published', (user, mediaType) => {
      client.subscribe(user, mediaType).then(() => {
        if (mediaType === 'video') {
          onVideoTrack(user);
        }
        if (mediaType === 'audio') {
          user?.audioTrack?.play();
        }
      });
    });

    client.on('user-left', (user) => {
      onUserDisconnected(user);
    });

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    await client.publish(tracks);

    return {
      tracks,
    };
  };

  const disconnect = async () => {
    await waitForConnectionState('CONNECTED');
    client.removeAllListeners();
    for (let track of tracks) {
      track.stop();
      track.close();
    }
    await client.unpublish(tracks);
    await client.leave();
  };

  return {
    disconnect,
    connect,
    client,
  };
};

type Props = {
  channelName: string;
  username: string;
  channel: RtmChannel | undefined;
};

type Message = {
  username: string;
  message: string;
};

const VideoRoom: React.FC<Props> = ({ channelName, username, channel }) => {
  const [users, setUsers] = React.useState<IAgoraRTCRemoteUser[]>([]);
  const [audioVideoTracks, setAudioVideoTracks] = React.useState<any>();
  const [micOff, setMicOff] = React.useState<boolean>(false);
  const [videoOff, setVideoOff] = React.useState<boolean>(false);
  const [RTCClient, setRTCClient] = React.useState<IAgoraRTCClient>();

  React.useEffect(() => {
    const onVideoTrack = (user: IAgoraRTCRemoteUser) => {
      setUsers((previousUsers) => [
        ...previousUsers.filter((u) => user.uid !== u.uid),
        user,
      ]);
    };

    const onUserDisconnected = (user: { uid: UID }) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u: IAgoraRTCRemoteUser) => u.uid !== user.uid),
      );
    };

    const { connect, disconnect, client } = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
      channelName,
    });
    if (!RTCClient) {
      setRTCClient(client);
    }
    const setup = async () => {
      const { tracks } = await connect();
      const audioTrack: any = tracks[0];
      const videoTrack: any = tracks[1];
      const newUser: IAgoraRTCRemoteUser = {
        uid: username,
        audioTrack,
        videoTrack,
        hasAudio: true,
        hasVideo: true,
      };
      setAudioVideoTracks(tracks);
      setUsers((previousUsers) => [...previousUsers, newUser]);
    };

    const cleanup = async () => {
      await disconnect();
      setUsers([]);
    };

    agoraCommandQueue = agoraCommandQueue.then(setup);

    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, [channelName, username]);

  const toggleMic = async () => {
    if (audioVideoTracks[0].muted) {
      await audioVideoTracks[0].setMuted(false);
      setMicOff(false);
    } else {
      await audioVideoTracks[0].setMuted(true);
      setMicOff(true);
    }
  };

  const toggleVideo = async () => {
    if (audioVideoTracks[1].muted) {
      await audioVideoTracks[1].setMuted(false);
      setVideoOff(false);
    } else {
      await audioVideoTracks[1].setMuted(true);
      setVideoOff(true);
    }
  };

  const [liveMessages, setLiveMessages] = React.useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState<string>('');

  const updateLiveMessages = (message: Message) => {
    setLiveMessages((prevMessage: Message[]) => [message, ...prevMessage]);
  };

  const sendMessage = () => {
    if (currentMessage !== '') {
      channel
        ?.sendMessage({
          messageType: 'TEXT',
          text: JSON.stringify({
            type: 'chat',
            message: currentMessage,
            username,
          }),
        })
        .then(() => {
          updateLiveMessages({
            message: currentMessage,
            username,
          });
          setCurrentMessage('');
        });
    }
  };

  React.useEffect(() => {
    if (channel) {
      channel?.on('ChannelMessage', (data: any) => {
        const messageData = JSON.parse(data.text);
        updateLiveMessages({
          message: messageData.message,
          username: messageData.username,
        });
      });
    }
  }, [channel]);

  return (
    <div className="videoroom-page">
      <div className="header">
        <div className="videoicon">
          <VideoIcon />
        </div>

        <div className="videoline">
          <div>{RTCClient?.channelName}</div>
          <div>{username}</div>
        </div>
      </div>
      <div className="videoroom-main">
        <div className="call-cont">
          <div className="video-area">
            <div className="local-user-video">
              {users && users[0] && (
                <VideoPlayer user={users[0]} userIndex={0} />
              )}
            </div>
            <div className="remote-user-video">
              {users.map((user, index) => {
                if (index > 0) {
                  return (
                    <VideoPlayer key={user.uid} user={user} userIndex={index} />
                  );
                }
              })}
            </div>
          </div>
          <div className="video-buttons-area">
            <div className="buttons-area">
              {micOff ? (
                <MicOff className="video-button" onClick={() => toggleMic()} />
              ) : (
                <MicOn className="video-button" onClick={() => toggleMic()} />
              )}

              {videoOff ? (
                <VideoOff
                  className="video-button"
                  onClick={() => toggleVideo()}
                />
              ) : (
                <VideoOn
                  className="video-button"
                  onClick={() => toggleVideo()}
                />
              )}

              <Share className="video-button" />
              <Chat className="video-button" />
              <Options className="video-button" />
            </div>
            <div className="endcall">
              <button
                className="endcall-button"
                onClick={() => {
                  window.opener = null;
                  window.open('', '_self');
                  window.close();
                }}
              >
                End Call
              </button>
            </div>
          </div>
        </div>
        <div className="chat-cont">
          <div className="chat-header">In-Call Messages</div>
          <div className="chat-area">
            {liveMessages &&
              liveMessages.map((msg: Message) => (
                <div className="message-box">
                  <div className="message-username">{msg.username}</div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))}
          </div>

          <div className="type-area">
            <input
              type="string"
              placeholder="Type something..."
              className="type-chat"
              onChange={(e) => setCurrentMessage(e.target.value)}
              value={currentMessage}
            />
            <Send onClick={() => sendMessage()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { VideoRoom };
