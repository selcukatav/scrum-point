import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Session.css'

const SessionComponent = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const navigate = useNavigate(); 

  const handleCreateSession = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-session');
      const { sessionId } = response.data;
      setSessionId(sessionId);

      navigate(`/cards/${sessionId}`);
    } catch (error) {
      console.error('Session oluşturulurken bir hata oluştu', error);
    }
  };


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
    <div className="session-container">
      <button onClick={handleCreateSession} className="create-session-button">
        Oturum Oluştur
      </button>
  
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
    </div>
  );
  
};

export default SessionComponent;
