import { useState, useEffect } from 'react';
import '../../styles/Cards.css';
import { useParams } from 'react-router-dom';

const scrumSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Cards: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  const { sessionId } = useParams<{ sessionId: string }>();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'clear') {
        setVotes(data.votes);           
        setHighlightedCard(null);       
    }

    if (data.type === 'highlight') {
        setHighlightedCard(data.mostVotedCard);
    }

    if (data.type === 'votes') {
        setVotes(data.votes);
    }
    };

    return () => ws.close();
  }, [sessionId]);

  const handleSelectSize = (size: string) => {
  
    setSelectedSize(size);
  
    const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "vote", size: size }));
      
    };
  };
  const handleShowResults = () => {
    const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'show-results' }));
    };
  };

  const handleClearVotes = async () => {
    const ws = new WebSocket(`ws://localhost:3000/ws/${sessionId}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'clear-votes' }));
    };

    setSelectedSize(null); 
  };

  return (
    <div className="Cards">
      <h1>Scrum Kartları Oylama Sistemi</h1>
      <h2>Katilim Linkini Paylas! Katilim Linki: </h2>
      <h3>http://localhost:5173/{sessionId}</h3>
      <br />
      <div className="card-container">
        {scrumSizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSelectSize(size)}
            className={`card ${selectedSize === size ? 'selected' : ''} ${highlightedCard === size ? 'highlighted' : ''}`}
          >
            {size}
          </button>
        ))}
      </div>
      <button onClick={handleShowResults}>Oylari Göster</button>
      <button onClick={handleClearVotes} style={{ marginLeft: '10px' }}>
        Temizle
      </button>
      <div className="results">
        <h2>Oylama Sonuçları:</h2>
        {Object.entries(votes).map(([size, count]) => (
          <div key={size}>
            {size}: {count} oy
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
