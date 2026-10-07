import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

export const Navbar: React.FC = () => {
  const {
    account,
    chainId,
    isConnecting,
    isCorrectChain,
    discoveredProviders,
    showPicker,
    setShowPicker,
    connectWallet,
    disconnectWallet,
    switchOrAddChain,
  } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-group">
          <Link to="/app" className="brand-title">
            Citation Court
          </Link>
          <span className="status-badge" title="Deployed on GenLayer Studionet">
            Preview on Studionet
          </span>
        </div>

        <nav className="site-nav" aria-label="Main navigation">
          <NavLink
            to="/app"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Recent
          </NavLink>
          <NavLink
            to="/new"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Lodge Claim
          </NavLink>
          <NavLink
            to="/mine"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            My Claims
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Evidence
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About
          </NavLink>
        </nav>

        <div className="wallet-actions">
          {account ? (
            <div className="wallet-connected-pill">
              {!isCorrectChain && (
                <button
                  type="button"
                  className="chain-warning-btn"
                  onClick={() => switchOrAddChain()}
                  title={`Wrong chain (${chainId}). Click to switch to Studionet 61999`}
                >
                  Switch to 61999
                </button>
              )}
              <span className="account-address" title={account}>
                {truncateAddress(account)}
              </span>
              <button
                type="button"
                className="btn-disconnect"
                onClick={disconnectWallet}
                title="Disconnect wallet"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-connect"
              onClick={() => connectWallet()}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>

      {showPicker && (
        <div className="modal-backdrop" onClick={() => setShowPicker(false)}>
          <div className="wallet-picker-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">Select Wallet Provider</h3>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={() => setShowPicker(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <p className="dialog-desc">
              Multiple browser wallets were detected via EIP-6963. Choose which extension to connect:
            </p>
            <div className="providers-list">
              {discoveredProviders.map((dp) => (
                <button
                  key={dp.info.uuid}
                  type="button"
                  className="provider-item-btn"
                  onClick={() => connectWallet(dp.provider)}
                >
                  {dp.info.icon && (
                    <img
                      src={dp.info.icon}
                      alt={dp.info.name}
                      className="provider-icon"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="provider-name">{dp.info.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
