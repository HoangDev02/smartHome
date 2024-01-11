
import { useSelector } from 'react-redux';
import Login from '../components/Login/Login';
import Home from './home/Home';

function NavigationBar() {
  const user = useSelector((state) => state.auth.login.currentUser);
  if (!user) {
    return <Login />;
  } else {
    return <Home />;
  }
}
export default NavigationBar