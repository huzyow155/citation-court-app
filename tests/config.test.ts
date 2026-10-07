import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  getAddressExplorerUrl,
  getContractExplorerUrl,
  isValidAddress,
  isValidHash,
  formatShortHash,
} from '../src/config';

describe('CONFIG and helpers', () => {
  it('has verified studionet defaults', () => {
    expect(CONFIG.chainId).toBe(61999);
    expect(CONFIG.networkName).toBe('GenLayer Studionet');
    expect(CONFIG.rpcUrl).toBe('https://studio.genlayer.com/api');
    expect(CONFIG.citationCourtAddress).toBe('0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5');
    expect(CONFIG.sourceSha256).toBe('459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2');
  });

  it('generates correct explorer URLs', () => {
    const url = getAddressExplorerUrl('0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5');
    expect(url).toBe('https://explorer-studio.genlayer.com/address/0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5');
    expect(getContractExplorerUrl()).toBe(url);
  });

  it('validates EVM addresses accurately', () => {
    expect(isValidAddress('0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5')).toBe(true);
    expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    expect(isValidAddress('0x123')).toBe(false);
    expect(isValidAddress('not-an-address')).toBe(false);
    expect(isValidAddress('58aDf2Fd47dD939623BFd66929ec26117fb8CFa5')).toBe(false);
  });

  it('validates 32-byte hashes accurately', () => {
    const valid = '0xa3875af779a334ce6d925ccf90ed78b4d53bb93591d51291f623c41523616cd0';
    expect(isValidHash(valid)).toBe(true);
    expect(isValidHash('0x123')).toBe(false);
    expect(isValidHash(valid.slice(2))).toBe(false);
  });

  it('formats short hashes correctly', () => {
    const hash = '0xa3875af779a334ce6d925ccf90ed78b4d53bb93591d51291f623c41523616cd0';
    expect(formatShortHash(hash, 6, 4)).toBe('0xa387...6cd0');
    expect(formatShortHash('short', 6, 4)).toBe('short');
  });
});
