import { useState } from 'react';
import { Link, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Reaptcha from 'reaptcha';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api.utils';
import './styles.scss';

import authSlice from '../../store/slices/auth.slice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [verifed, setVerified] = useState(false);
  const {
    mutate: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: (data) =>
      api.post('/auth/login', { email: data.email, password: data.password }),
    onSuccess: (data) => {
      const decodedToken = jwtDecode(data.data.token);
      dispatch(
        authSlice.actions.setUserData({
          token: data.data.token,
          id: decodedToken.id,
          name: decodedToken.name,
          firstName: decodedToken.firstName,
          email: decodedToken.email,
        })
      );

      navigate('/');
    },
  });

  const { register, handleSubmit } = useForm();

  const handleFormSubmit = (data) => {
    login({ email: data.email, password: data.password });
  };

  return (
    <>
      <Helmet>
        <title>YABA - {t('login.Login')}</title>
      </Helmet>
      <div className="login-page">
        <div className="form-holder">
          <h1>{t('login.Login')}</h1>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
              <TextField
                type="email"
                placeholder={t('login.Email.field')}
                required
                {...register('email')}
              />
              <TextField
                type="password"
                placeholder={t('login.Password.field')}
                required
                {...register('password')}
              />
            </div>

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
              {t('login.LoginButton')}
            </LoadingButton>
          </form>
          {isError && <div className="error">{t('errors.unknown')}</div>}
          <Link component={RouterLink} underline="hover" to="/register">
            {t('login.DontHaveAnAccount')}
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
