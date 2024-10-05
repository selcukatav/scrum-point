import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="session-container">
      <button onClick={handleCreateSession}>
        Session Oluştur
      </button>
    </div>
  );
};

export default SessionComponent;
