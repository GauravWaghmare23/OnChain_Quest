/**
 * Error handling utilities for Web3 contract interactions
 * Provides classification, retry logic, and user-friendly error messages
 */

export enum ContractErrorType {
  WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
  WRONG_NETWORK = "WRONG_NETWORK",
  USER_REJECTED = "USER_REJECTED",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  GAS_ESTIMATION_FAILED = "GAS_ESTIMATION_FAILED",
  TRANSACTION_REVERTED = "TRANSACTION_REVERTED",
  RPC_ERROR = "RPC_ERROR",
  TIMEOUT = "TIMEOUT",
  INVALID_INPUT = "INVALID_INPUT",
  UNKNOWN = "UNKNOWN",
}

export interface ContractError {
  type: ContractErrorType;
  message: string;
  originalError?: Error;
  retryable: boolean;
}

/**
 * Classify error type from raw error
 */
export function classifyError(error: unknown): ContractError {
  const errorMsg = error instanceof Error ? error.message : String(error);
  const lowerMsg = errorMsg.toLowerCase();

  // Wallet not connected
  if (lowerMsg.includes("not connect") || lowerMsg.includes("no account")) {
    return {
      type: ContractErrorType.WALLET_NOT_CONNECTED,
      message: "Please connect your wallet to continue",
      originalError: error instanceof Error ? error : undefined,
      retryable: false,
    };
  }

  // Wrong network
  if (lowerMsg.includes("wrong network") || lowerMsg.includes("chain")) {
    return {
      type: ContractErrorType.WRONG_NETWORK,
      message: "Please switch to Shardeum Sphinx testnet",
      originalError: error instanceof Error ? error : undefined,
      retryable: false,
    };
  }

  // User rejected
  if (lowerMsg.includes("user rejected") || lowerMsg.includes("denied")) {
    return {
      type: ContractErrorType.USER_REJECTED,
      message: "Transaction was rejected. Please try again.",
      originalError: error instanceof Error ? error : undefined,
      retryable: true,
    };
  }

  // Insufficient funds
  if (
    lowerMsg.includes("insufficient funds") ||
    lowerMsg.includes("insufficient balance") ||
    lowerMsg.includes("underpriced")
  ) {
    return {
      type: ContractErrorType.INSUFFICIENT_FUNDS,
      message: "Insufficient SHM balance. Please check your wallet.",
      originalError: error instanceof Error ? error : undefined,
      retryable: false,
    };
  }

  // Gas estimation failure
  if (lowerMsg.includes("gas") && lowerMsg.includes("estimation")) {
    return {
      type: ContractErrorType.GAS_ESTIMATION_FAILED,
      message:
        "Gas estimation failed. The transaction may fail. Please try again.",
      originalError: error instanceof Error ? error : undefined,
      retryable: true,
    };
  }

  // Transaction reverted
  if (
    lowerMsg.includes("reverted") ||
    lowerMsg.includes("execution") ||
    lowerMsg.includes("failed")
  ) {
    return {
      type: ContractErrorType.TRANSACTION_REVERTED,
      message: "Transaction failed. Please check contract parameters.",
      originalError: error instanceof Error ? error : undefined,
      retryable: false,
    };
  }

  // RPC errors
  if (
    lowerMsg.includes("econnrefused") ||
    lowerMsg.includes("enotfound") ||
    lowerMsg.includes("timeout") ||
    lowerMsg.includes("network")
  ) {
    return {
      type: ContractErrorType.RPC_ERROR,
      message:
        "Network error. Please check your connection and try again.",
      originalError: error instanceof Error ? error : undefined,
      retryable: true,
    };
  }

  // Timeout
  if (lowerMsg.includes("timeout") || lowerMsg.includes("timed out")) {
    return {
      type: ContractErrorType.TIMEOUT,
      message:
        "Request timed out. The network may be busy. Please try again.",
      originalError: error instanceof Error ? error : undefined,
      retryable: true,
    };
  }

  // Invalid input
  if (
    lowerMsg.includes("invalid") ||
    lowerMsg.includes("format") ||
    lowerMsg.includes("address")
  ) {
    return {
      type: ContractErrorType.INVALID_INPUT,
      message: "Invalid input. Please check your parameters.",
      originalError: error instanceof Error ? error : undefined,
      retryable: false,
    };
  }

  // Unknown error
  return {
    type: ContractErrorType.UNKNOWN,
    message: errorMsg || "An unknown error occurred",
    originalError: error instanceof Error ? error : undefined,
    retryable: true,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: ContractError): string {
  const messages: Record<ContractErrorType, string> = {
    [ContractErrorType.WALLET_NOT_CONNECTED]:
      "🔌 Wallet not connected. Please connect your wallet first.",
    [ContractErrorType.WRONG_NETWORK]:
      "🌐 Wrong network. Please switch to Shardeum Sphinx testnet (Chain ID: 8082).",
    [ContractErrorType.USER_REJECTED]:
      "✋ You rejected the transaction. Please try again.",
    [ContractErrorType.INSUFFICIENT_FUNDS]:
      "💰 Insufficient SHM balance. Please add more funds to your wallet.",
    [ContractErrorType.GAS_ESTIMATION_FAILED]:
      "⚙️ Could not estimate gas. Please try again.",
    [ContractErrorType.TRANSACTION_REVERTED]:
      "❌ Transaction failed. Contract execution was reverted.",
    [ContractErrorType.RPC_ERROR]:
      "🌐 Network connection error. Please check your internet and try again.",
    [ContractErrorType.TIMEOUT]:
      "⏱️ Request timed out. The network may be busy. Please try again.",
    [ContractErrorType.INVALID_INPUT]:
      "⚠️ Invalid input. Please check all parameters.",
    [ContractErrorType.UNKNOWN]:
      "❌ An unexpected error occurred. Please try again.",
  };

  return messages[error.type];
}

/**
 * Check if error is retryable
 */
export function isRetryable(error: ContractError): boolean {
  return error.retryable;
}

/**
 * Log error for debugging
 */
export function logContractError(
  operation: string,
  error: ContractError
): void {
  console.error(`[${operation}] ${error.type}:`, {
    message: error.message,
    originalError: error.originalError,
    retryable: error.retryable,
  });
}

/**
 * Debug error details
 */
export function debugError(error: ContractError): string {
  return `
Error Type: ${error.type}
Message: ${error.message}
Retryable: ${error.retryable}
Original: ${error.originalError?.message || "N/A"}
  `.trim();
}
