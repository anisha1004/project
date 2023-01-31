import React from 'react';
import './Register.css';
import TextField from '@mui/material/TextField';
import { ReactComponent as LoginImg } from '../../assets/LoginImg.svg';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authservice';
import { validateRegisterInput } from '../../hooks/useAuthValidator';

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

  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const resetInputFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };
  const navigate = useNavigate();

  const handleUserRegister = () => {
    if (validateRegisterInput(firstName, lastName, email, password)) {
      registerUser(firstName, lastName, email, password)
        .then((res) => {
          localStorage.setItem('VCAuthToken', res);
          setError('');
          resetInputFields();
          navigate('/');
        })
        .catch((e) => {
          resetInputFields();
          setError('Invalid Credentials');
          alert('Invalid credentials');
        });
    } else {
      setError('Please fill missing details');
      alert('Please fill missing details');
    }
  };
  return (
    <div className="register-page">
      <div className="register-left">
        <LoginImg />
      </div>
      <div className="register-right">
        <div className="register-right-box-wrapper">
          <div className="register-right-box">
            <div className="register-right-up">
              <div>
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
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
                    value={firstName}
                    id="outlined-basic"
                    label="FirstName"
                    variant="outlined"
                    sx={style}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="lname">
                  <TextField
                    value={lastName}
                    id="outlined-basic"
                    label="LastNme"
                    variant="outlined"
                    sx={style}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="email">
                <TextField
                  value={email}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  sx={style}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="email">
                <TextField
                  value={password}
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  sx={style}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="button-cont">
              <button className="button" onClick={handleUserRegister}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { Register };
