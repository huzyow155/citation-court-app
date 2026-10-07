export type Verdict = 'SUPPORTS' | 'CONTRADICTS' | 'NOT_ADDRESSED' | 'UNREADABLE' | 'PENDING';

export interface Claim {
  id: string;
  author: string;
  claim: string;
  url: string;
  schema_version?: string;
  seq?: string;
}

export interface Ruling {
  claim_id: string;
  verdict: Verdict;
  attempts: number;
  schema_version?: string;
}

export interface PlatformStats {
  total_claims: number;
  total_judgments: number;
  supports: number;
  contradicts: number;
  not_addressed: number;
  unreadable: number;
}

export interface EvidenceCase {
  claim_id: string;
  case_name: string;
  description: string;
  claim_text: string;
  source_url: string;
  author: string;
  lodge_tx: string;
  judge_tx: string;
  initial_judge_tx?: string;
  rejudge_tx?: string | null;
  verdict: Verdict;
  attempts: number;
  latency_sec: number;
}

export interface EvidenceData {
  verifiedAt: string;
  contractAddress: string;
  consumerAddress: string;
  sourceSha256: string;
  statsSnapshot: PlatformStats;
  cases: EvidenceCase[];
}

export interface ReceiptParsedOutcome {
  isSuccess: boolean;
  statusName: string;
  resultName: string;
  leaderResult: string;
  errorMessage?: string;
  rawError?: string;
}

export interface PendingAction {
  hash: string;
  claimId?: string;
  action: 'lodge' | 'judge';
  startedAt: number;
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}
