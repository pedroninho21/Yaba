import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import authSlice from './store/slices/auth.slice';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BudgetPage from './pages/BudgetPage';
import CategoriesPage from './pages/CategoriesPage';

import Root from './pages/Root/Root';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { token, loaded } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * Manage authentification state on app load, if token is present in localstorage, we set it in redux state
   */
  useEffect(() => {
    const localStorageToken = localStorage.getItem('token');

    if (localStorageToken) {
      const decodedToken = jwtDecode(localStorageToken);
      dispatch(
        authSlice.actions.setUserData({
          token: localStorageToken,
          id: decodedToken.id,
          name: decodedToken.name,
          firstName: decodedToken.firstName,
          email: decodedToken.email,
        })
      );
    }
    dispatch(authSlice.actions.setAuthLoaded());
  }, []);

  /**
   * Manage token in localstorage, if token is updated in redux state, we update it in localstorage
   * */
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  /**
   * Manage the app routing
   */
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: token ? <DashboardPage /> : <Navigate to="/login" />,
        },
        {
          path: '/budget/:id',
          element: token ? <BudgetPage /> : <Navigate to="/login" />,
        },
        {
          path: '/categories',
          element: token ? <CategoriesPage /> : <Navigate to="/login" />,
        },
      ],
    },
    {
      path: '/login',
      element: !token ? <LoginPage /> : <Navigate to="/" />,
    },
    {
      path: '/register',
      element: !token ? <RegisterPage /> : <Navigate to="/" />,
    },
  ]);

  return loaded ? <RouterProvider router={router} /> : <div>Loading...</div>;
}
export default App;
