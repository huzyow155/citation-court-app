import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ClaimDetail } from './pages/ClaimDetail';
import { LodgeClaim } from './pages/LodgeClaim';
import { MyClaims } from './pages/MyClaims';
import { Evidence } from './pages/Evidence';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content" id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/claim/:id" element={<ClaimDetail />} />
              <Route path="/new" element={<LodgeClaim />} />
              <Route path="/mine" element={<MyClaims />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <div className="footer-container">
              <p className="footer-copy">
                Citation Court &mdash; Preview on GenLayer Studionet (Chain ID 61999). Mechanical citation grounding verification.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
};

export default App;
