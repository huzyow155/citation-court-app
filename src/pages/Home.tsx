import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { getStats, listRecentClaimIds, getClaim, getRuling } from '../services/court';
import type { Claim, PlatformStats, Ruling } from '../types';
import { MarkedClaim } from '../components/MarkedClaim';
import { CONFIG, getContractExplorerUrl } from '../config';

interface ClaimItemData {
  id: string;
  claim: Claim;
  ruling: Ruling | null;
}

export const Home: React.FC = () => {
  const { readOnlyClient } = useWallet();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [claimsList, setClaimsList] = useState<ClaimItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch platform statistics
        const statsData = await getStats(readOnlyClient);
        if (!isMounted) return;
        setStats(statsData);

        // 2. Fetch recent claim IDs (up to 20)
        const recentIds = await listRecentClaimIds(readOnlyClient, CONFIG.citationCourtAddress, 20);
        if (!isMounted) return;

        // 3. Fetch each claim record and ruling
        const loadedItems: ClaimItemData[] = [];
        for (const id of recentIds) {
          const claim = await getClaim(readOnlyClient, id);
          if (!claim) continue;
          const ruling = await getRuling(readOnlyClient, id);
          loadedItems.push({ id, claim, ruling });
        }

        if (isMounted) {
          setClaimsList(loadedItems);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to load on-chain home data:', err);
          setError(
            err.message?.includes('not found') || err.message?.includes('Contract')
              ? `Contract at ${CONFIG.citationCourtAddress} was not found or the Studionet RPC is unreachable. If Studionet was recently reset, update VITE_CONTRACT_ADDRESS.`
              : `Unable to fetch on-chain claims: ${err.message}`
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, [readOnlyClient]);

  const extractHost = (urlStr: string) => {
    try {
      return new URL(urlStr).hostname;
    } catch {
      return urlStr;
    }
  };

  return (
    <div className="page-container page-home">
      <section className="editorial-meta-bar">
        <h1 className="page-heading">Recent Evaluated Claims</h1>
        {stats && (
          <p className="platform-tally-line">
            Platform tally: {stats.total_claims} single-fact claims registered across{' '}
            {stats.total_judgments} validator evaluations ({stats.supports} supported,{' '}
            {stats.contradicts} contradicted, {stats.not_addressed} not addressed,{' '}
            {stats.unreadable} unreadable).
          </p>
        )}
        <div className="home-action-row">
          <Link to="/new" className="action-link-primary">
            Lodge a new claim for judgment
          </Link>
          <a
            href={getContractExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="action-link-secondary"
          >
            Contract on Explorer
          </a>
        </div>
      </section>

      {isLoading && (
        <div className="state-panel loading-panel" role="status" aria-live="polite">
          <p className="loading-text">Fetching latest on-chain records from Studionet...</p>
        </div>
      )}

      {error && (
        <div className="state-panel error-panel" role="alert">
          <h2 className="error-title">Connection Notice</h2>
          <p className="error-description">{error}</p>
        </div>
      )}

      {!isLoading && !error && claimsList.length === 0 && (
        <div className="state-panel empty-panel">
          <p>No claims found on-chain yet.</p>
          <Link to="/new" className="action-link-primary">
            Lodge a claim
          </Link>
        </div>
      )}

      {!isLoading && !error && claimsList.length > 0 && (
        <div className="claims-ledger-list">
          {claimsList.map(({ id, claim, ruling }) => {
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
                      <div className="unreadable-redaction-bar">
                        couldn't read the page
                      </div>
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
