import axios from "axios";
import { createWalletClient, parseAbiItem, publicActions, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { gnosis, eduChain, arbitrum } from "viem/chains";
import "dotenv/config";

const BASE_URL = "https://dev.universal-deposit.gnosisdev.com";
const API_KEY = process.env.API_KEY;

const USDC = {
  41923: "0x12a272A581feE5577A5dFa371afEB4b2F3a8C2F8",
  100: "0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0",
  42161: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
});

/// POST /api/v1/register-address
/// Register address for monitoring, current monitoring period per address is 24 hrs, one need to call the same API after 24 hrs
async function registerAddress(
  ownerAddress,
  recipientAddress,
  destinationChainId,
  sourceChainId
) {
  try {
    const response = await axiosInstance.post("/api/v1/register-address", {
      ownerAddress,
      recipientAddress,
      destinationChainId,
      sourceChainId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error registering address:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/// Get /api/v1/address
async function getUniversalAddress(
  ownerAddress,
  recipientAddress,
  destinationChainId,
  sourceChainId
) {
  try {
    const response = await axiosInstance.get("/api/v1/address", {
      params: {
        ownerAddress,
        recipientAddress,
        destinationChainId,
        sourceChainId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting universal address:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/// Get api/v1/orders
/// Get all orders of an UD
async function getOrdersByNonce(
  universalAddress,
  sourceChainId,
  nonce,
  limit = 20
) {
  try {
    const response = await axiosInstance.get("/api/v1/orders", {
      params: {
        universalAddress,
        sourceChainId,
        nonce,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting orders by nonce:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/// On chain view function
/// Return: nonce of UD
async function getNonceByUD(walletClient, udAddress) {
  try {
    const bytecode = await walletClient.getCode({
      address: udAddress,
    });
    if (bytecode) {
      const nonce = await walletClient.readContract({
        address: udAddress,
        abi: [parseAbiItem("function nonce() external returns(uint256)")],
        functionName: "nonce",
      });
      return nonce;
    } else {
      return 0;
    }
  } catch (error) {
    throw error;
  }
}

/// POST api/v1/orders/generate-id
/// Return: {"orderId":"0xb67afcffc37d319544d39acc3800101ec1f83a83378bfad1332e6ae445f0f388"}%
async function generateOrderId(
  universalAddress,
  ownerAddress,
  recipientAddress,
  destinationTokenAddress,
  sourceChainId,
  destinationChainId,
  nonce
) {
  try {
    const response = await axiosInstance.post("/api/v1/orders/generate-id", {
      universalAddress,
      ownerAddress,
      recipientAddress,
      destinationTokenAddress,
      sourceChainId,
      destinationChainId,
      nonce,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error generating order ID:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/// Get /api/v1/orders/{id}
/// Return: OrderSchema
async function getOrderById(orderId) {
  try {
    const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting order by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/// On chain call function
/// Return: bridge tx hash
async function bridgeUSDC(sourceChainId, walletClient, udAddress, value) {
  const { request } = await walletClient.simulateContract({
    address: USDC[sourceChainId],
    abi: [
      parseAbiItem("function transfer(address to, uint256 value) external"),
    ],
    functionName: "transfer",
    args: [udAddress, value],
  });
  const txhash = await walletClient.writeContract(request);

  return txhash;
}

function getWalletClient(privateKey, chainid) {
  if (chainid == 100) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: gnosis,
      transport: http(),
    }).extend(publicActions);
  } else if (chainid == 41923) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: eduChain,
      transport: http(),
    }).extend(publicActions);
  } else if (chainid == 42161) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: arbitrum,
      transport: http(),
    }).extend(publicActions);
  }
}

export {
  registerAddress,
  getUniversalAddress,
  getOrdersByNonce,
  generateOrderId,
  getNonceByUD,
  getOrderById,
  bridgeUSDC,
  getWalletClient,
};

/// Order Schema
//   {
//     "id":"0xb67afcffc37d319544d39acc3800101ec1f83a83378bfad1332e6ae445f0f388",
//     "universalAddress":"0x4184B5Ab13232Bb4485AF16C94b68626DfF9504e",
//     "sourceChainId":42161,
//     "destinationChainId":100,
//     "recipientAddress":"0x5f9e06Fd34A67637315e7dCe6866A4D3783E014E",
//     "sourceTokenAddress":"0xaf88d065e77c8cc2239327c5edb3a432268e5831",
//     "destinationTokenAddress":"0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0",
//     "ownerAddress":"0x5f9e06Fd34A67637315e7dCe6866A4D3783E014E",
//     "nonce":0,
//     "amount":"2000000",
//     "status":"COMPLETED",
//     "transactionHash":"0x8152a9a950b5396bffb23e8779def5ba50f060e05939f0a9da6f727794f8c94c",
//     "bridgeTransactionUrl":"https://layerzeroscan.com/tx/0x8152a9a950b5396bffb23e8779def5ba50f060e05939f0a9da6f727794f8c94c",
//     "message":"Settlement executed in tx 0x8152a9a950b5396bffb23e8779def5ba50f060e05939f0a9da6f727794f8c94c (block 388404589)",
//     "retries":0,
//     "clientId":"4bd3d206-1e53-48ee-beb9-b1c26213d660",
//     "createdAt":"2025-10-11T12:35:52.117Z",
//     "updatedAt":"2025-10-11T12:35:54.271Z"
//  }
