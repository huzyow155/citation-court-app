import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { Home } from './pages/Home';
import { ClaimDetail } from './pages/ClaimDetail';
import { LodgeClaim } from './pages/LodgeClaim';
import { MyClaims } from './pages/MyClaims';
import { Evidence } from './pages/Evidence';
import { About } from './pages/About';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content" id="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-container">
          <p className="footer-copy">
            Citation Court &mdash; Preview on GenLayer Studionet (Chain ID 61999). Mechanical citation grounding verification.
          </p>
        </div>
      </footer>
    </div>
  );
};

const ClaimRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/app/claim/${id || ''}`} replace />;
};

export const App: React.FC = () => {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone Marketing / Protocol Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Functional Citation Court Application at /app */}
          <Route path="/app" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/app/claim/:id" element={<AppLayout><ClaimDetail /></AppLayout>} />
          <Route path="/app/new" element={<AppLayout><LodgeClaim /></AppLayout>} />
          <Route path="/app/mine" element={<AppLayout><MyClaims /></AppLayout>} />
          <Route path="/app/evidence" element={<AppLayout><Evidence /></AppLayout>} />
          <Route path="/app/about" element={<AppLayout><About /></AppLayout>} />

          {/* Legacy application routes canonically redirected to /app/... */}
          <Route path="/claim/:id" element={<ClaimRedirect />} />
          <Route path="/new" element={<Navigate to="/app/new" replace />} />
          <Route path="/mine" element={<Navigate to="/app/mine" replace />} />
          <Route path="/evidence" element={<Navigate to="/app/evidence" replace />} />
          <Route path="/about" element={<Navigate to="/app/about" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
};

export default App;
