import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import React from 'react';
import './VideoPlayer.css';

type Props = {
  user: IAgoraRTCRemoteUser;
  userIndex: number;
};

const VideoPlayer: React.FC<Props> = ({ user, userIndex }) => {
  const ref = React.useRef<any>();

  React.useEffect(() => {
    if (user) {
      user.videoTrack?.play(ref.current);
      user.audioTrack?.play();
    }
  }, [user]);

  return (
    <div
      ref={ref}
      className={userIndex === 0 ? 'local-user-player' : 'remote-user-player'}
    />
  );
};

export { VideoPlayer };
