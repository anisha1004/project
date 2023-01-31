import React from 'react';
import './Home.css';
import TextField from '@mui/material/TextField';
import { ReactComponent as HomeImg } from '../../assets/amico.svg';
import { useAgoraRTM } from '../../hooks/useAgoraRTM';
import { VideoRoom } from '../VideoRoom';

const APP_ID = 'a34fd3487b254281bf58733e72650158';

const Home: React.FC<{}> = () => {
  const [channelName, setChannelName] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [userJoined, setUserJoined] = React.useState<boolean>(false);

  const { channel, setTriggerLogin } = useAgoraRTM({
    appID: APP_ID,
    channelID: channelName,
    username,
  });

  const createRoom = () => {
    setTriggerLogin(true);
    setUserJoined(true);
  };
  const style = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        border: '2px solid #fb8500',
        borderRadius: '5px',
      },
    },
    '& label.Mui-focused': {
      color: '#fb8500',
    },
  };
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      {userJoined ? (
        <VideoRoom
          channelName={channelName}
          username={username}
          channel={channel}
        />
      ) : (
        <div className="home-page">
          <div className="left">
            <HomeImg />
          </div>
          <div className="right">
            <div className="right-box">
              <div className="home-heading">Video call details</div>
              <div className="video-name">
                <div className="name">Conference Name</div>
                <TextField
                  id="outlined-basic"
                  label="Conference Name"
                  variant="outlined"
                  sx={style}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              <div className="video-name">
                <div className="name">User Name</div>
                <TextField
                  id="outlined-basic"
                  label="User Name"
                  variant="outlined"
                  sx={style}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="button-cont-home">
                <button className="button-home" onClick={() => createRoom()}>
                  Join call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Home };
