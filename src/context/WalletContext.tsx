import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import type { EIP6963ProviderDetail } from '../types';

interface WalletContextType {
  readOnlyClient: any;
  signerClient: any | null;
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isCorrectChain: boolean;
  discoveredProviders: EIP6963ProviderDetail[];
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  connectWallet: (chosenProvider?: any) => Promise<void>;
  disconnectWallet: () => void;
  switchOrAddChain: () => Promise<boolean>;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

const TARGET_CHAIN_ID_HEX = '0xf22f'; // 61999
const TARGET_CHAIN_ID_DEC = 61999;

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read-only client is always available without any wallet connection
  const [readOnlyClient] = useState(() => createClient({ chain: studionet }));
  const [signerClient, setSignerClient] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeProvider, setActiveProvider] = useState<any | null>(null);
  const [discoveredProviders, setDiscoveredProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // EIP-6963 wallet discovery
  useEffect(() => {
    const handleAnnounce = (event: any) => {
      const detail: EIP6963ProviderDetail = event.detail;
      if (!detail?.info?.uuid) return;
      setDiscoveredProviders((prev) => {
        if (prev.some((p) => p.info.uuid === detail.info.uuid)) return prev;
        return [...prev, detail];
      });
    };

    window.addEventListener('eip6963:announceProvider', handleAnnounce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounce);
    };
  }, []);

  const switchOrAddChain = useCallback(async (providerToUse?: any): Promise<boolean> => {
    const provider = providerToUse || activeProvider || (typeof window !== 'undefined' ? (window as any).ethereum : null);
    if (!provider) return false;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TARGET_CHAIN_ID_HEX }],
      });
      return true;
    } catch (switchError: any) {
      // 4902 error indicates chain has not been added to wallet yet
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          console.log('Adding Studionet chain to wallet using SDK values:', {
            chainId: TARGET_CHAIN_ID_HEX,
            chainName: studionet.name,
            rpcUrls: studionet.rpcUrls.default.http,
          });

          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: TARGET_CHAIN_ID_HEX,
                chainName: 'Genlayer Studio Network',
                rpcUrls: ['https://studio.genlayer.com/api'],
                nativeCurrency: {
                  name: 'GEN Token',
                  symbol: 'GEN',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://explorer-studio.genlayer.com'],
              },
            ],
          });
          return true;
        } catch (addError: any) {
          setError(`Failed to add Studionet network: ${addError.message}`);
          return false;
        }
      }
      setError(`Failed to switch chain: ${switchError.message}`);
      return false;
    }
  }, [activeProvider]);

  const connectWallet = useCallback(
    async (chosenProvider?: any) => {
      setError(null);
      setIsConnecting(true);

      try {
        let provider = chosenProvider;

        if (!provider) {
          if (discoveredProviders.length > 1) {
            setShowPicker(true);
            setIsConnecting(false);
            return;
          } else if (discoveredProviders.length === 1) {
            provider = discoveredProviders[0].provider;
          } else if (typeof window !== 'undefined' && (window as any).ethereum) {
            provider = (window as any).ethereum;
          }
        }

        if (!provider) {
          setError('No Ethereum or Web3 wallet extension found. Please install a compatible browser wallet.');
          setIsConnecting(false);
          return;
        }

        setActiveProvider(provider);
        setShowPicker(false);

        // 1. Request accounts
        const accounts: string[] = await provider.request({
          method: 'eth_requestAccounts',
        });

        if (!accounts || accounts.length === 0) {
          setError('No account selected in wallet.');
          setIsConnecting(false);
          return;
        }

        const selectedAccount = accounts[0];
        setAccount(selectedAccount);

        // 2. Check and switch chain
        const currentChainHex: string = await provider.request({
          method: 'eth_chainId',
        });
        const currentChainDec = parseInt(currentChainHex, 16);
        setChainId(currentChainDec);

        if (currentChainDec !== TARGET_CHAIN_ID_DEC) {
          const switched = await switchOrAddChain(provider);
          if (!switched) {
            setError(`Please switch your wallet to GenLayer Studionet (Chain ID ${TARGET_CHAIN_ID_DEC}).`);
          }
        }

        // 3. Create signer client with provider
        const signer = createClient({
          chain: studionet,
          account: selectedAccount as `0x${string}`,
          provider,
        });
        setSignerClient(signer);

        // Set up event listeners on provider
        if (provider.on) {
          const handleAccountsChanged = (accs: string[]) => {
            if (accs.length === 0) {
              setAccount(null);
              setSignerClient(null);
            } else {
              setAccount(accs[0]);
              setSignerClient(
                createClient({
                  chain: studionet,
                  account: accs[0] as `0x${string}`,
                  provider,
                })
              );
            }
          };

          const handleChainChanged = (newChainHex: string) => {
            const dec = parseInt(newChainHex, 16);
            setChainId(dec);
          };

          provider.on('accountsChanged', handleAccountsChanged);
          provider.on('chainChanged', handleChainChanged);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect wallet');
      } finally {
        setIsConnecting(false);
      }
    },
    [discoveredProviders, switchOrAddChain]
  );

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSignerClient(null);
    setActiveProvider(null);
    setChainId(null);
  }, []);

  const isCorrectChain = chainId === TARGET_CHAIN_ID_DEC;

  return (
    <WalletContext.Provider
      value={{
        readOnlyClient,
        signerClient,
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
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
