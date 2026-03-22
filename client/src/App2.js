import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';

function App2() {
  return (
    <Routes>     
      <Route path="/" element={<Header />}></Route>
    </Routes>
  );
}
export default App2;