import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>(); 
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
    <div>
      <h1>Oturuma Katıl</h1>
      <p>Session ID: {sessionId}</p>
      <button onClick={joinSession}>Oturuma Katıl</button>
    </div>
  );
};

export default SessionPage;