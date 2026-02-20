import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import useTheme from './hooks/useTheme.js';
import { NetworkAlert, TopLoader } from './components';
import { useMeQuery } from './features/auth/authApi';
import { selectAccessToken, setCredentials } from './features/auth/authSlice';

const App = () => {
  useTheme();
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);

  const { data: meData, isSuccess } = useMeQuery(undefined, { 
    skip: !token
  });


  useEffect(() => {
    if (isSuccess && meData?.data) {
      dispatch(setCredentials({ user: meData.data }));
    }
  }, [isSuccess, meData, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground) transition-colors duration-200">
      <TopLoader />
      <NetworkAlert />
      <Outlet />
    </div>
  );
};

export default App;