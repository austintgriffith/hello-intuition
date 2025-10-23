import { defineChain } from "viem";

/**
 * Intuition Chain
 * https://hub.intuition.systems/
 */
export const intuition = defineChain({
  id: 1155,
  name: "Intuition",
  nativeCurrency: {
    decimals: 18,
    name: "TRUST",
    symbol: "TRUST",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.intuition.systems/http"],
      webSocket: ["wss://rpc.intuition.systems/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.intuition.systems" },
  },
  contracts: {
    // Add any specific contracts if needed
  },
});

/**
 * Intuition Testnet Chain
 */
export const intuitionTestnet = defineChain({
  id: 1155, // Note: Same chain ID for testnet in the docs
  name: "Intuition Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "tTRUST",
    symbol: "tTRUST",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.rpc.intuition.systems/http"],
      webSocket: ["wss://testnet.rpc.intuition.systems/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.explorer.intuition.systems" },
  },
  testnet: true,
});
