import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import Reaptcha from 'reaptcha';
import { Helmet } from 'react-helmet';
import api from '../../utils/api.utils';
import './style.scss';

const handleError = (error) => {
  if (error.response.status === 500) {
    if (
      error.response.data.error ===
      'duplicate key value violates unique constraint "email_unique"'
    ) {
      return { field: 'email', message: 'errors.email.inuse' };
    }
    return { field: null, message: 'errors.unknown' };
  }
  return { field: null, message: 'errors.unknown' };
};

function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [globalError, setGlobalError] = useState(null);
  const [verifed, setVerified] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const {
    mutate: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (data) =>
      api.post('/auth/register', {
        name: data.name,
        firstName: data.firstName,
        email: data.email,
        password: data.password,
      }),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (registerError) => {
      const { field, message } = handleError(registerError);
      if (field) {
        setError(field, {
          type: 'manual',
          message,
        });
      } else {
        setGlobalError(message);
      }
    },
  });

  const handleFormSubmit = (data) => {
    login({
      name: data.name,
      firstName: data.firstName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <>
      <Helmet>
        <title>YABA - {t('Register').toLowerCase()}</title>
      </Helmet>
      <div className="register-page">
        <div className="form-holder">
          <h1>{t('register.Register')}</h1>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
              <TextField
                type="text"
                placeholder={t('register.FirstName.field')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName', {
                  required: {
                    value: true,
                    message: t('register.FirstName.required'),
                  },
                })}
              />
              <TextField
                type="text"
                placeholder={t('register.Name')}
                error={errors.name}
                {...register('name')}
              />
            </div>
            <TextField
              type="email"
              placeholder={t('register.Email.field')}
              error={!!errors.email}
              helperText={t(errors.email?.message)}
              {...register('email', {
                required: {
                  value: true,
                  message: 'register.Email.required',
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'register.Email.invalid',
                },
              })}
            />
            <TextField
              type="password"
              placeholder={t('register.Password.field')}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', {
                required: {
                  value: true,
                  message: t('register.Password.required').toString(),
                },
                minLength: {
                  value: 8,
                  message: 'register.Password.minLength',
                },
              })}
            />
            <TextField
              type="password"
              placeholder={t('register.PasswordConfirmation.field')}
              error={!!errors.password_confirmation}
              helperText={t(errors.password_confirmation?.message)}
              {...register('password_confirmation', {
                required: {
                  value: true,
                  message: 'register.PasswordConfirmation.required',
                },
                minLength: {
                  value: 8,
                  message: 'register.PasswordConfirmation.minLength',
                },
                validate: (value) =>
                  value === watch('password') ||
                  'register.PasswordConfirmation.different',
              })}
            />

            <Reaptcha
              className="captcha"
              sitekey={import.meta.env.VITE_CAPTCHA_KEY}
              onVerify={() => setVerified(true)}
            />
            <LoadingButton
              loading={isLoading}
              variant="contained"
              type="submit"
              disabled={!verifed}>
              {t('register.RegisterButton')}
            </LoadingButton>
          </form>
          {isError && globalError != null && (
            <div className="error">{t(globalError) || t('errors.unknown')}</div>
          )}
          <Link component={RouterLink} underline="hover" to="/login">
            {t('register.AlreadyHaveAnAccount')}
          </Link>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
