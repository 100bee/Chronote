import { Routes, Route } from 'react-router-dom';
import FirstPage from './pages/FirstPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';

function App() {
  return (
    <Routes>      
      <Route path="/" element={<FirstPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />}></Route>
    </Routes>
  );
}

export default App;
