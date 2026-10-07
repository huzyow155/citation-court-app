import type { Claim, PlatformStats, Ruling } from '../types';
import { CONFIG } from '../config';

/**
 * Service functions for interacting with CitationCourt.py on GenLayer.
 * Each function accepts an explicit client instance (read-only or signer).
 */

export async function getStats(
  client: any,
  address: string = CONFIG.citationCourtAddress
): Promise<PlatformStats> {
  const raw = await client.readContract({
    address,
    functionName: 'get_stats',
    args: [],
  });
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export async function listRecentClaimIds(
  client: any,
  address: string = CONFIG.citationCourtAddress,
  limit: number = 20
): Promise<string[]> {
  const raw = await client.readContract({
    address,
    functionName: 'list_recent',
    args: [limit],
  });
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export async function getClaim(
  client: any,
  id: string,
  address: string = CONFIG.citationCourtAddress
): Promise<Claim | null> {
  const raw = await client.readContract({
    address,
    functionName: 'get_claim',
    args: [String(id)],
  });
  if (!raw || raw === '""') return null;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!parsed || !parsed.claim) return null;
  return parsed;
}

export async function getRuling(
  client: any,
  id: string,
  address: string = CONFIG.citationCourtAddress
): Promise<Ruling | null> {
  const raw = await client.readContract({
    address,
    functionName: 'get_ruling',
    args: [String(id)],
  });
  if (!raw || raw === '""') return null;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!parsed || !parsed.verdict) return null;
  return parsed;
}

export async function listClaimsByAuthor(
  client: any,
  author: string,
  address: string = CONFIG.citationCourtAddress,
  limit: number = 20
): Promise<string[]> {
  const raw = await client.readContract({
    address,
    functionName: 'list_by_author',
    args: [author, limit],
  });
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export async function latestByAuthor(
  client: any,
  author: string,
  address: string = CONFIG.citationCourtAddress
): Promise<string | null> {
  const raw = await client.readContract({
    address,
    functionName: 'latest_by_author',
    args: [author],
  });
  if (!raw || raw === '""') return null;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return parsed ? String(parsed) : null;
}

export async function lodgeClaimTx(
  client: any,
  claim: string,
  sourceUrl: string,
  address: string = CONFIG.citationCourtAddress
): Promise<string> {
  return await client.writeContract({
    address,
    functionName: 'lodge_claim',
    args: [claim, sourceUrl],
  });
}

export async function judgeClaimTx(
  client: any,
  claimId: string,
  address: string = CONFIG.citationCourtAddress
): Promise<string> {
  return await client.writeContract({
    address,
    functionName: 'judge_claim',
    args: [String(claimId)],
  });
}

export async function waitForReceipt(
  client: any,
  hash: string,
  retries: number = CONFIG.receiptPolling.retries,
  interval: number = CONFIG.receiptPolling.interval
): Promise<any> {
  return await client.waitForTransactionReceipt({
    hash,
    retries,
    interval,
  });
}
