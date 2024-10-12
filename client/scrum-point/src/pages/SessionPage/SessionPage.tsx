import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import '../../styles/Session.css'

const SessionPage = () => {
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  const joinSession = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/join-session/${sessionId}`);
      console.log('Oturuma katılındı:', response.data);
      navigate(`/cards/${sessionId}`);
    } catch (error) {
      console.error('Oturuma katılamadı:', error);
    }
  };

  return (
    <div className="join-session-container">
      <h3>Oturuma Katıl</h3>
      <input 
        type="text" 
        placeholder="Session ID'yi girin" 
        value={sessionId} 
        onChange={(e) => setSessionId(e.target.value)} 
        className="session-input"
      />
      <button onClick={joinSession} className="join-button">Oturuma Katıl</button>
    </div>
  );
};

export default SessionPage;