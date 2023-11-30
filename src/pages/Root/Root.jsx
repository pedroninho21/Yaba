import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './style.scss';

function Root() {
  return (
    <div>
      <Navbar />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
export default Root;
