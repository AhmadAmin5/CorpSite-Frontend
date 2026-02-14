import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useActivateAccountMutation } from '../authApi';
import { Button, Input, Logo, Spinner } from '../../../components';
import useToast from '../../../context/ToastContext';

const ActivateAccountForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();

  const [activateAccount, { isLoading }] = useActivateAccountMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setErrMsg('');

    if (!token) {
      setErrMsg('Invalid or missing invitation token.');
      return;
    }

    try {
      await activateAccount({ token, password: data.password }).unwrap();
      setIsSuccess(true);
      toast?.success('Account activated successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err?.data?.message) {
        setErrMsg(err.data.message);
      } else if (err?.data?.errors?.[0]?.code === 'TOKEN_REJECTED') {
        setErrMsg('This invitation link has expired or is invalid.');
      } else {
        setErrMsg('Activation failed. Please try again.');
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full p-8 bg-(--card) border border-(--border) shadow-lg rounded-xl text-center space-y-6">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-(--foreground)">
            Account Activated!
          </h2>
          <p className="text-(--secondary)">
            Your password has been set. You will be redirected to the login page
            momentarily.
          </p>
        </div>
        <Button
          onClick={() => navigate('/login')}
          className="w-full"
          text="Go to Login"
        />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-md w-full p-8 bg-(--card) border border-(--border) shadow-lg rounded-xl text-center space-y-6">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-(--foreground)">Invalid Link</h2>
        <p className="text-(--secondary)">
          The invitation link is missing a valid token. Please check the link
          sent to your email.
        </p>
        <Button
          onClick={() => navigate('/login')}
          variant="secondary"
          className="w-full"
          text="Back to Login"
        />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-(--card) border border-(--border) shadow-lg rounded-xl">
      <div className="text-center flex flex-col items-center">
        <Logo iconOnly={true} size={60} />
        <h2 className="mt-6 text-3xl font-bold text-(--foreground)">
          Activate Account
        </h2>
        <p className="mt-2 text-sm text-(--secondary)">
          Set up your password to access your workspace.
        </p>
      </div>

      {errMsg && (
        <div className="bg-(--destructive) border border-(--destructive-border) text-(--destructive-foreground) px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errMsg}</span>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center"
          isButtonLoading={isLoading}
          text="Activate Account"
          loadingText="Activating..."
        />
      </form>
    </div>
  );
};

export default ActivateAccountForm;
