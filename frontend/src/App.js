import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001')
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>백엔드에서 받은 메시지:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
