import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { listClaimsByAuthor, getClaim, getRuling } from '../services/court';
import type { Claim, Ruling } from '../types';
import { MarkedClaim } from '../components/MarkedClaim';

interface UserClaimItem {
  id: string;
  claim: Claim;
  ruling: Ruling | null;
}

export const MyClaims: React.FC = () => {
  const { readOnlyClient, account, connectWallet } = useWallet();
  const [userClaims, setUserClaims] = useState<UserClaimItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserClaims = useCallback(async (authorAddr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const ids = await listClaimsByAuthor(readOnlyClient, authorAddr, undefined, 20);
      const items: UserClaimItem[] = [];
      for (const id of ids) {
        const c = await getClaim(readOnlyClient, id);
        if (!c) continue;
        const r = await getRuling(readOnlyClient, id);
        items.push({ id, claim: c, ruling: r });
      }
      setUserClaims(items);
    } catch (err: any) {
      console.error('Failed to load user claims:', err);
      setError(`Failed to retrieve claims for your address: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [readOnlyClient]);

  useEffect(() => {
    if (account) {
      loadUserClaims(account);
    } else {
      setUserClaims([]);
    }
  }, [account, loadUserClaims]);

  const extractHost = (urlStr: string) => {
    try {
      return new URL(urlStr).hostname;
    } catch {
      return urlStr;
    }
  };

  return (
    <div className="page-container page-my-claims">
      <header className="page-header">
        <h1 className="page-heading">My Lodged Claims</h1>
        {account ? (
          <p className="page-subheading">
            Claims submitted by your connected address <code className="inline-address">{account}</code>.
          </p>
        ) : (
          <p className="page-subheading">
            Connect your browser wallet to view claims you have lodged on Citation Court.
          </p>
        )}
      </header>

      {!account && (
        <div className="state-panel empty-panel">
          <p>No wallet connected.</p>
          <button type="button" className="btn-action-primary" onClick={() => connectWallet()}>
            Connect Wallet
          </button>
        </div>
      )}

      {account && isLoading && (
        <div className="state-panel loading-panel" role="status">
          <p className="loading-text">Fetching your on-chain claims from Studionet...</p>
        </div>
      )}

      {account && error && (
        <div className="state-panel error-panel" role="alert">
          <p className="error-description">{error}</p>
        </div>
      )}

      {account && !isLoading && !error && userClaims.length === 0 && (
        <div className="state-panel empty-panel">
          <p>You have not lodged any claims with this address yet.</p>
          <Link to="/new" className="action-link-primary">
            Lodge your first claim
          </Link>
        </div>
      )}

      {account && !isLoading && !error && userClaims.length > 0 && (
        <div className="claims-ledger-list">
          {userClaims.map(({ id, claim, ruling }) => {
            const verdict = ruling ? ruling.verdict : 'NONE';
            const host = extractHost(claim.url);
            const isUnreadable = verdict === 'UNREADABLE';

            return (
              <article key={id} className="ledger-entry-row">
                <div className="entry-main-column">
                  <span className="entry-index">{id}.</span>
                  <div className="entry-claim-body">
                    <MarkedClaim claimText={claim.claim} verdict={verdict} />
                    {isUnreadable && (
                      <div className="unreadable-redaction-bar">couldn't read the page</div>
                    )}
                  </div>
                </div>

                <aside className="entry-margin-column">
                  <div className="margin-provenance">
                    <span className="margin-host" title={claim.url}>
                      {host}
                    </span>
                    <span className="margin-attempts">
                      {ruling ? `Attempt ${ruling.attempts} of 3` : 'Unjudged'}
                    </span>
                    <span className={`margin-verdict verdict-${verdict.toLowerCase()}`}>
                      {verdict}
                    </span>
                  </div>
                  <Link to={`/claim/${id}`} className="entry-detail-link">
                    View record
                  </Link>
                </aside>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
