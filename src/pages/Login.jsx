// code/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { Button, Input } from '../components';

const Login = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errMsg, setErrMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errMsg) setErrMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract values from state
    const { username, password } = formData;

    // logic to distinguish email from username
    const isEmail = username.includes('@');

    // Construct the payload based on the check
    const loginData = {
      password,
      ...(isEmail ? { email: username } : { username })
    };

    try {
      const response = await login(loginData).unwrap();
      const userData = response.data;

      dispatch(setCredentials({
        accessToken: userData.accessToken,
        user: userData.user
      }));

    } catch (err) {
      console.error('Login failed', err);
      if (!err?.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Invalid Credentials');
      } else if (err.status === 401) {
        setErrMsg('Wrong Password');
      } else if (err.status === 404) {
        setErrMsg('User not found');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Log in
          </h2>
        </div>

        {errMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errMsg}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Username or Email"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Username or email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;