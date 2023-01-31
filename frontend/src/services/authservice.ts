import axios from 'axios';

const baseUrl = 'http://localhost:8080/api/v1';

const registerUser = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'any value';
  return axios
    .post(
      baseUrl + '/auth/register',
      {
        firstName,
        lastName,
        email,
        password,
      },
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      },
    )
    .then((res) => {
      return res.data.token;
    });
};

const loginUser = (email: string, password: string) => {
  axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'any value';
  return axios
    .post(
      baseUrl + '/auth/authenticate',
      {
        email,
        password,
      },
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      },
    )
    .then((res) => {
      return res.data.token;
    });
};

const logoutUser = () => {
  localStorage.removeItem('VCAuthToken');
};

export { registerUser, loginUser, logoutUser };
