import { privateKeyToAddress } from "viem/accounts";
import {
  registerAddress,
  getUniversalAddress,
  getOrdersByNonce,
  generateOrderId,
  getNonceByUD,
  getOrderById,
  bridgeUSDC,
  getWalletClient,
} from "./utils.js";
import "dotenv/config";

// Test sending USDC from Edu Chain to Gnosis Chain
async function main() {
  // Step 1: register address and get UD Address with the following parameter
  const ownerAddress = privateKeyToAddress(process.env.PRIVATE_KEY); // Input field # 1: Owner address has the permission to withdraw unsupported token that has been transferred to the UD address
  const recipientAddress = privateKeyToAddress(process.env.PRIVATE_KEY); // Input field # 2: Recipient address on destination chain
  const sourceChainId = 41923; // # Dropdown field # 1: Options (41923, 100, 42161)
  const dstChainId = 100; // # Dropdown field # 2: Options (41923, 100, 42161)
  const privateKey = process.env.PRIVATE_KEY; // Make sure this account has enough USDC. Connect through wallet
  const usdcValue = 2_000_000; // # Input field 3

  const { universalAddress } = await registerAddress(
    ownerAddress,
    recipientAddress,
    dstChainId,
    sourceChainId
  );

  console.log("UD address ", universalAddress);

  const sourceChainWalletClient = getWalletClient(privateKey, sourceChainId);

  // Step 2: Query nonce of UD before bridging. Nonce starts from 0, increment 1
  // If it returns 0, meaning that the UD account is not created yet and nonce is 0
  const UDAddressNonce = await getNonceByUD(
    sourceChainWalletClient,
    universalAddress
  );

  // Step 3: Bridge USDC
  const bridgeUSDCTxHash = await bridgeUSDC(
    sourceChainId,
    sourceChainWalletClient,
    universalAddress,
    usdcValue
  );
  console.log("Bridge USDC Tx hash ", bridgeUSDCTxHash);

  // Step 4: Poll for order status until COMPLETED
  const maxAttempts = 30; // Maximum number of attempts (5 minutes with 5s intervals)
  const delayMs = 2000; // 2 seconds between attempts
  let attempt = 0;
  let orderResult = null;

  console.log("Polling for order status...");

  while (attempt < maxAttempts) {
    attempt++;

    try {
      orderResult = await getOrdersByNonce(
        universalAddress,
        sourceChainId,
        UDAddressNonce,
        10
      );

      console.log(`Attempt ${attempt}: Order status - ${orderResult.status}`);

      if (orderResult.status === "COMPLETED") {
        console.log("Order completed successfully!");
        console.log("Transaction URL:", orderResult.bridgeTransactionUrl);
        break;
      }

      // Wait before next attempt
      if (attempt < maxAttempts) {
        console.log(`Waiting ${delayMs / 1000} seconds before next check...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.log(
        `Attempt ${attempt}: Error fetching order - ${error.message}`
      );

      // If it's a 404, the order might not be in the database yet
      if (attempt < maxAttempts) {
        console.log(`Waiting ${delayMs / 1000} seconds before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        throw new Error(`Failed to get order after ${maxAttempts} attempts`);
      }
    }
  }

  if (!orderResult || orderResult.status !== "COMPLETED") {
    throw new Error("Order did not complete within the expected time");
  }

  console.log("Final order result:", orderResult);
}
main();
