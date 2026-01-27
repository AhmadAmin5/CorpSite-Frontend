import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { Button, Input } from '../components';

const Login = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // TODO Remove this
    defaultValues: import.meta.env.DEV
      ? {
          identifier: 'admin',
          password: 'admin',
        }
      : {},
  });

  const [errMsg, setErrMsg] = useState('');

  const onSubmit = async (data) => {
    setErrMsg('');

    const { identifier, password } = data;

    const isEmail = identifier.includes('@');

    const loginData = {
      password,
      ...(isEmail ? { email: identifier } : { username: identifier }),
    };

    try {
      const response = await login(loginData).unwrap();
      const userData = response.data;

      dispatch(
        setCredentials({
          accessToken: userData.accessToken,
          user: userData.user,
        })
      );
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
    <div className="max-w-md w-full space-y-8 p-8 bg-(--card) border border-(--border) shadow-lg rounded-xl">
      <div className="text-center">
        {/* 3. Text: Uses var(--foreground) so it turns white in dark mode */}
        <h2 className="mt-6 text-3xl font-extrabold text-(--foreground)">
          Log in
        </h2>
      </div>

      {errMsg && (
        <div
          className="bg-(--destructive) border-x-destructive-border text-(--destructive-foreground) border px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{errMsg}</span>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label="Username or Email"
            type="text"
            placeholder="Username or email"
            error={errors.identifier?.message}
            {...register('identifier', {
              required: 'Username or Email is required',
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center bg-primary text-primary-content hover:brightness-90"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </div>
  );
};

export default Login;
