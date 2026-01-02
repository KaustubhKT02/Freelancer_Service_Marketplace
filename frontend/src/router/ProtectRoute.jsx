import {Navigate, Outlet} from 'react-router-dom';
import useAuthStore from '../context/authStore.context.js';

const ProtectRoute = () => {
  const {isAuth, loading} = useAuthStore();

  if(loading) {
    return isAuth ? <Outlet /> : <Navigate to='/login' />;
  }
}


export default ProtectRoute;