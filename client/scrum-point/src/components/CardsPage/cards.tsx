import { useState, useEffect } from 'react';
import '../../styles/Cards.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const scrumSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface SavedVote {
  taskName: string;
  size: string;
}

const Cards: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isVotingDisabled, setIsVotingDisabled] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const [savedVotes, setSavedVotes] = useState<SavedVote[]>([]);
  const [inputError, setInputError] = useState(false);

  const { sessionId } = useParams<{ sessionId: string }>();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);
    ws.onopen = () => {
      console.log('WebSocket bağlantısı başarıyla kuruldu.');
    };

    ws.onerror = (error) => {
      console.error("WebSocket Hatası:", error);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'clear') {
        setVotes(data.votes);
        setHighlightedCard(null);
        setSelectedSize(null)
        setIsVotingDisabled(false)
      }

      if (data.type === 'highlight') {
        setHighlightedCard(data.mostVotedCard);
        setVotes(data.votes);

        setIsVotingDisabled(true)

      }

      // if (data.type === 'save-vote') {
      //   setSavedVotes((prevVotes) => [...prevVotes, data.vote ]);
      // }

    };

    return () => ws.close();
  }, [sessionId]);

  useEffect(() => {
    let storedClientId = localStorage.getItem('clientId');
    if (!storedClientId) {
      storedClientId = uuidv4();
      localStorage.setItem('clientId', storedClientId);
    }
    setClientId(storedClientId);
  }, []);

  const handleExcelExport = async () => {
    try {
      const response = await axios.post('http://localhost:3000/export', savedVotes, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'votes.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Excel dosyası oluşturulurken hata oluştu:', error);
    }
  };

  

  const handleShowResults = () => {
    sendWebSocketMessage('show-results')
  };

  const handleClearVotes = async () => {
    sendWebSocketMessage('clear-votes')
  };

  const handleSaveVote = async () => {
    if (!taskName) {
      setInputError(true); 
      return; 
    }
  
    if (taskName && highlightedCard) {
      const newVote: SavedVote = { taskName, size: highlightedCard };
  
      try {
        const response = await axios.post(`http://localhost:3000/save-vote`, {
          sessionId,
          vote: newVote
        });
  
        if (response.status === 200) {
          setSavedVotes((prevVotes) => [...prevVotes, newVote]);
  
          setTaskName('');
          setSelectedSize(null);
          setInputError(false); 
        }
      } catch (error) {
        console.error('Oylama kaydedilirken bir hata oluştu:', error);
      }
    }
  };

  //TODO: must be converted to the websocket request
  // const handleSaveVote = () => {
  //   const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);


  //   if (taskName && highlightedCard) {
  //     const newVote: SavedVote = { taskName, size: highlightedCard };

  //     setSavedVotes((prevVotes) => {
  //       const updatedVotes = [...prevVotes, newVote];

  //       ws.onopen = () => {
  //         ws.send(JSON.stringify({ type: 'save-vote', vote: newVote }));
  //       }
  //       ws.onerror = (error) => {
  //         console.error("WebSocket error: ", error);
  //       };

  //       return updatedVotes;
  //     });

  //     setTaskName('');
  //     setSelectedSize(null);
  //   }
  // };

  const handleSelectSize = async (size: string, clientId: string | null) => {
    if (!clientId) {
      console.error("Client ID not available.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/vote', {
        clientId: clientId,
        size: size,
      });

      const { selectedSize } = response.data;
      setSelectedSize(selectedSize);


    } catch (error) {
      console.error('There was an error while sending the vote', error);
    }
  };


  const sendWebSocketMessage = (messageType: string) => {
    const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: messageType, }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };



  return (
    <div className="Cards">

      <h4>Katilim Linkini Paylas! Katilim Linki: <br />
        http://localhost:5173/{sessionId} </h4>
      <br />
      <input
    type="text"
    placeholder="Task Adı"
    value={taskName}
    onChange={(e) => {
      setTaskName(e.target.value);
      if (e.target.value) setInputError(false); 
    }}
    className={`input-box ${inputError ? 'input-error' : ''}`} 
  />

      <br />
      <div className="card-container">
        {scrumSizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSelectSize(size, clientId)}
            className={`card ${selectedSize === size ? 'selected' : ''} ${highlightedCard === size ? 'highlighted' : ''}`}
            disabled={isVotingDisabled && highlightedCard !== size}
          >
            {size}
            <div>{votes[size] || 0} votes </div>
          </button>

        ))}

      </div>

      <div className="button-container">
        <button onClick={handleShowResults}>Oylari Göster</button>
        <button onClick={handleClearVotes}>Temizle</button>
      </div>

      <button onClick={handleSaveVote} className="save-button">KAYDET</button>
      <div className="saved-votes">
        <h3>Kaydedilen Oylamalar</h3>
        <ul>
          {savedVotes.map((vote, index) => (
            <li key={index}>
              <span className="task-name">{vote.taskName}</span>
              <span className="size">{vote.size}</span>
            </li>
          ))}
        </ul>
        <button onClick={handleExcelExport}>
          Excel'e Aktar
        </button>
      </div>

    </div>
  );
};

export default Cards;
