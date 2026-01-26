import { Outlet } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';
import { selectUser } from './features/auth/authSlice';

function App() {
  const user = useSelector(selectUser);

  if (user)
    return (
      <div>
        <h1>Welcome back {user.email}</h1>
        <Outlet />
      </div>
    );
  else
    return (
      <div>
        <h1>No User</h1>
        <Outlet />
      </div>
    );
}

export default App;
