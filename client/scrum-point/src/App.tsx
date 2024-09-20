import { useState } from 'react'

import './App.css'

const scrumSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

const App: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Kart boyutunu seçtiğinde çalışacak fonksiyon
  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
  };

  // Backend'e oyu gönder
  const handleSubmitVote = async () => {
    if (!selectedSize) return alert('Lütfen bir boyut seçin!');
    
    try {
      // Backend endpointine isteği gönder
      const response = await fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: selectedSize }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Oylama sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error('Oylama gönderilemedi:', error);
    }
  };

  return (
    <div className="App">
      <h1>Scrum Kartları Oylama Sistemi</h1>
      <div className="card-container">
        {scrumSizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSelectSize(size)}
            className={`card ${selectedSize === size ? 'selected' : ''}`}
          >
            {size}
          </button>
        ))}
      </div>
      <button onClick={handleSubmitVote} disabled={submitted}>
        {submitted ? 'Oyunuz Gönderildi!' : 'Oy Ver'}
      </button>
    </div>
  );
};

export default App
