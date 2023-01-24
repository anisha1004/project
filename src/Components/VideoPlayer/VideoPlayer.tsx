import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import React from 'react';

type Props = {
  user: IAgoraRTCRemoteUser;
};

const VideoPlayer: React.FC<Props> = ({ user }) => {
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
      style={{
        height: '200px',
        width: '200px',
      }}
    />
  );
};

export { VideoPlayer };
