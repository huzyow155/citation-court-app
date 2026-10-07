import type { ReceiptParsedOutcome } from '../types';

export const USER_ERROR_FRIENDLY_MAP: Record<string, string> = {
  'claim must be string': 'Claim must be valid text.',
  'claim length below minimum 20 characters': 'The claim is too short. It must be at least 20 characters.',
  'claim length exceeds maximum 400 characters': 'The claim exceeds the maximum permitted length of 400 characters.',
  'url must be string': 'The source URL must be valid text.',
  'url length exceeds limit': 'The source URL exceeds the maximum length limit of 300 characters.',
  'url contains whitespace': 'The source URL cannot contain spaces or whitespace characters.',
  'url scheme must be https': 'The source URL must use the secure https:// scheme.',
  'url hostname missing': 'The source URL does not include a valid domain name.',
  'url contains userinfo': 'The source URL cannot contain credentials (username or password).',
  'url port must be 443 or omitted': 'The source URL port must be 443 or omitted.',
  'url hostname cannot be localhost': 'Localhost source URLs are not permitted.',
  'url host cannot be private or reserved IP': 'Private or local network IP addresses are not permitted.',
  'unknown claim id': 'The requested claim ID does not exist on-chain.',
  'claim already judged': 'This claim has already received a conclusive verdict and cannot be re-judged.',
  'attempt limit reached': 'The maximum limit of 3 evaluation attempts has been reached for this claim.',
};

export function getFriendlyErrorMessage(rawError: string): string {
  if (!rawError) return 'An unspecified contract error occurred.';
  for (const [key, friendly] of Object.entries(USER_ERROR_FRIENDLY_MAP)) {
    if (rawError.includes(key)) {
      return friendly;
    }
  }
  return rawError;
}

/**
 * Extracts raw error text from a GenLayer transaction receipt.
 * Inspects leader_receipt execution results, genvm_result, and payload fields.
 */
export function extractRawReceiptError(receipt: any): string | undefined {
  if (!receipt) return undefined;

  // 1. Check leader_receipt[0].result.payload
  const leader0 = receipt.consensus_data?.leader_receipt?.[0];
  if (leader0?.result?.payload && typeof leader0.result.payload === 'string') {
    return leader0.result.payload;
  }

  // 2. Check leader_receipt[0].genvm_result.error_description
  if (leader0?.genvm_result?.error_description) {
    return leader0.genvm_result.error_description;
  }

  // 3. Check any leader receipt payload
  if (Array.isArray(receipt.consensus_data?.leader_receipt)) {
    for (const r of receipt.consensus_data.leader_receipt) {
      if (r?.result?.payload && typeof r.result.payload === 'string') {
        return r.result.payload;
      }
    }
  }

  // 4. Check root result payload
  if (receipt.result?.payload && typeof receipt.result.payload === 'string') {
    return receipt.result.payload;
  }

  return undefined;
}

/**
 * Evaluates whether a GenLayer transaction receipt meets the success rule:
 * 1. status_name === "ACCEPTED" || status_name === "FINALIZED"
 * 2. result_name === "MAJORITY_AGREE"
 * 3. consensus_data.leader_receipt[0].execution_result === "SUCCESS"
 */
export function parseReceiptOutcome(receipt: any): ReceiptParsedOutcome {
  if (!receipt) {
    return {
      isSuccess: false,
      statusName: 'UNKNOWN',
      resultName: 'UNKNOWN',
      leaderResult: 'UNKNOWN',
      errorMessage: 'Receipt data unavailable.',
    };
  }

  const rawData = receipt.receipt || receipt;
  const statusName =
    receipt.status_name ||
    rawData.status_name ||
    (rawData.status === 5 ? 'ACCEPTED' : String(rawData.status));
  const resultName =
    receipt.result_name ||
    rawData.result_name ||
    (rawData.result === 6 ? 'MAJORITY_AGREE' : String(rawData.result));

  const leader0 = rawData.consensus_data?.leader_receipt?.[0];
  const leaderResult =
    leader0?.execution_result ||
    receipt.execution_result ||
    rawData.execution_result ||
    'UNKNOWN';

  const isStatusAccepted = statusName === 'ACCEPTED' || statusName === 'FINALIZED';
  const isResultAgreed = resultName === 'MAJORITY_AGREE';
  const isExecutionSuccess = leaderResult === 'SUCCESS';

  if (isStatusAccepted && isResultAgreed && isExecutionSuccess) {
    return {
      isSuccess: true,
      statusName,
      resultName,
      leaderResult,
    };
  }

  const rawError = extractRawReceiptError(receipt);
  let friendlyError = 'Transaction did not succeed.';

  if (rawError) {
    friendlyError = getFriendlyErrorMessage(rawError);
  } else if (!isStatusAccepted) {
    friendlyError = `Transaction status is ${statusName} (expected ACCEPTED or FINALIZED).`;
  } else if (!isResultAgreed) {
    friendlyError = 'The validators did not reach consensus agreement. You can try again.';
  } else if (!isExecutionSuccess) {
    friendlyError = `Execution ended with status ${leaderResult}.`;
  }

  return {
    isSuccess: false,
    statusName,
    resultName,
    leaderResult,
    rawError,
    errorMessage: friendlyError,
  };
}
