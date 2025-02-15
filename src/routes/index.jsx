import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Jobs from '../pages/Jobs';
import Profile from '../pages/Profile';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes; 