import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './pages/MainPage/App.tsx';
import SessionPage from './pages/SessionPage/SessionPage.tsx';
import CardsPage from './pages/CardsPage/CardsPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/session" element={<SessionPage />} />
        <Route path="/cards/:sessionId" element={<CardsPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
