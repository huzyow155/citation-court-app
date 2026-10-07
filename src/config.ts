/**
 * Citation Court platform configuration.
 * All chain parameters and contract references are centralized here.
 */

function getEnvVar(key: string, fallback: string): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  const proc = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
  if (proc && proc.env && proc.env[key]) {
    return proc.env[key] as string;
  }
  return fallback;
}

export const CONFIG = {
  networkName: 'GenLayer Studionet',
  chainId: 61999,
  rpcUrl: getEnvVar('VITE_RPC_URL', 'https://studio.genlayer.com/api'),
  explorerBaseUrl: 'https://explorer-studio.genlayer.com',

  // Contracts
  citationCourtAddress: (getEnvVar(
    'VITE_CONTRACT_ADDRESS',
    '0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5'
  ) as `0x${string}`),
  citedBoardAddress: (getEnvVar(
    'VITE_CITED_BOARD_ADDRESS',
    '0x339dA01705d57f0d6AD917f0eC4950f8a8f95CC4'
  ) as `0x${string}`),

  // Verification constants
  sourceSha256: '459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2',
  contractRepoUrl: 'https://github.com/huzyow155/citation-court-genlayer',
  appRepoUrl: 'https://github.com/huzyow155/citation-court-app',

  // Polling settings (6 minute window: 120 * 3000ms)
  receiptPolling: {
    retries: 120,
    interval: 3000,
  },
} as const;

export function getAddressExplorerUrl(address: string): string {
  return `${CONFIG.explorerBaseUrl}/address/${address}`;
}

export function getContractExplorerUrl(): string {
  return getAddressExplorerUrl(CONFIG.citationCourtAddress);
}
