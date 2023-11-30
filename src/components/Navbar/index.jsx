import { Tooltip, Link, Button } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SavingsIcon from '@mui/icons-material/Savings';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import authSlice from '../../store/slices/auth.slice';

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <nav className="navbar">
      <Tooltip title="Yet Another Budget App, blazingly fast.">
        <div className="logo">
          <SavingsIcon className="logo-icon" fontSize="large" />
          <h1>YABA</h1>
        </div>
      </Tooltip>

      <div className="links">
        <Link component={RouterLink} to="/" color="inherit">
          {t('navbar.Budgets')}
        </Link>
        <Link component={RouterLink} to="/categories" color="inherit">
          {t('navbar.Categories')}
        </Link>
      </div>
      <div>
        {token && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              localStorage.removeItem('token');
              dispatch(authSlice.actions.logout());
            }}>
            {t('navbar.Logout')}
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
