import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
        token: credentialResponse.credential,
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Signed in successfully with Google!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google sign-in failed!');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>
          {state === 'Sign Up' && (
            <div className="w-full ">
              <p>Full Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
          )}
          <div className="w-full ">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>
          <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
            {state === 'Sign Up' ? 'Create account' : 'Login'}
          </button>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error('Google sign-in failed!')}
            theme="outline"
            size="large"
          />
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create a new account?{' '}
              <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </GoogleOAuthProvider>
  );
};

export default Login;
