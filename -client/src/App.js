import './App.css';
import axios from "axios";
import { useEffect } from 'react';
import AuthRoute from './components/AuthRoute'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { getCookie } from './utils/cookies'
import { userLogout, userCheck } from './redux/actions/UserActions'
import Test from './pages/Test';


function App() {
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(userCheck())
    } else {
      if (userState.user) {
        dispatch(userLogout())
      }
    }

    // return () => {
    //   second;
    // };
  }, []);

  return (
    <div>
      {uiState.error && <div style={{ color: 'red' }}>{uiState.error}</div>}
      {uiState.loading && <div>Loading...</div>}
      {!uiState.loading && userState.user ?
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test" component={<AuthRoute />} />
            <Route path="/login" element={<Login />} />
            <Route index path="*" element={<Dashboard />} />
          </Routes>
        </BrowserRouter> :
        <BrowserRouter>
          <Routes>
            <Route index path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>}


    </div>
  );
}

export default App;
