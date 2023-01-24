import React from 'react';
import './Register.css';
import TextField from '@mui/material/TextField';
import { ReactComponent as Image } from '../../assets/Image.svg';

const Register: React.FC<{}> = () => {
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
    <div className="register-page">
      <div className="register-left">
        <Image />
      </div>
      <div className="register-right">
        <div className="register-right-box">
          <div className="register-right-up">
            <div>Already have an account? Sign in</div>
          </div>
          <div className="heading">
            <div className="heading-large">
              <div>Welcome to</div>
              <div>video calling app</div>
            </div>
            <div className="heading-small">
              Let's connect ourselves and make happiness
            </div>
          </div>
          <div className="details">
            <div className="name">
              <div className="fname">
                <TextField
                  id="outlined-basic"
                  label="FirstName"
                  variant="outlined"
                  sx={style}
                />
              </div>
              <div className="lname">
                <TextField
                  id="outlined-basic"
                  label="LastNme"
                  variant="outlined"
                  sx={style}
                />
              </div>
            </div>
            <div className="email">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                sx={style}
              />
            </div>
            <div className="email">
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                sx={style}
              />
            </div>
          </div>
          <div className="button-cont">
            <button className="button">Create Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export { Register };
