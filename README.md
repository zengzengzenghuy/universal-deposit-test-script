# Quick script for testing

```
npm i
cp .env.example .env
npm run dev
```

### Configuration

```
API_KEY= # API key to request for Unviersal Deposit API
PRIVATE_KEY= # private key for account to transfer USDC to UD address
```

### Sample log

```
UD address  0xf47f74E54194D402805289283E1E788938f78d41
Bridge USDC Tx hash  0x0c9e4c92ef6342edc8538b7d465f0b1c5331ee6a73bd055597bfc5c7d9766d22
Polling for order status...
Error getting orders by nonce: { error: 'Order not found' }
Attempt 1: Error fetching order - Request failed with status code 404
Waiting 2 seconds before retrying...
Error getting orders by nonce: { error: 'Order not found' }
Attempt 2: Error fetching order - Request failed with status code 404
Waiting 2 seconds before retrying...
Error getting orders by nonce: { error: 'Order not found' }
Attempt 3: Error fetching order - Request failed with status code 404
Waiting 2 seconds before retrying...
Error getting orders by nonce: { error: 'Order not found' }
Attempt 4: Error fetching order - Request failed with status code 404
Waiting 2 seconds before retrying...
Error getting orders by nonce: { error: 'Order not found' }
Attempt 5: Error fetching order - Request failed with status code 404
Waiting 2 seconds before retrying...
Attempt 6: Order status - CREATED
Waiting 2 seconds before next check...
Attempt 7: Order status - CREATED
Waiting 2 seconds before next check...
Attempt 8: Order status - CREATED
Waiting 2 seconds before next check...
Attempt 9: Order status - CREATED
Waiting 2 seconds before next check...
Attempt 10: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 11: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 12: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 13: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 14: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 15: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 16: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 17: Order status - DEPLOYED
Waiting 2 seconds before next check...
Attempt 18: Order status - COMPLETED
Order completed successfully!
Transaction URL: https://layerzeroscan.com/tx/0x169979ed0957bebf273a1ceb78168c3738827d929f07410a11b1f12e14257d62
Final order result: {
  id: '0x19c898446594a5b3562f99b0559991d5c334eb212ad854d45393c6cd45b8a3ff',
  universalAddress: '0xf47f74E54194D402805289283E1E788938f78d41',
  sourceChainId: 100,
  destinationChainId: 41923,
  recipientAddress: '0x95B7a3c834B092AC72fa09EFA903f56A8FE7cA59',
  sourceTokenAddress: '0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0',
  destinationTokenAddress: '0x12a272A581feE5577A5dFa371afEB4b2F3a8C2F8',
  ownerAddress: '0x95B7a3c834B092AC72fa09EFA903f56A8FE7cA59',
  nonce: 0,
  amount: '2000000',
  status: 'COMPLETED',
  transactionHash: '0x169979ed0957bebf273a1ceb78168c3738827d929f07410a11b1f12e14257d62',
  bridgeTransactionUrl: 'https://layerzeroscan.com/tx/0x169979ed0957bebf273a1ceb78168c3738827d929f07410a11b1f12e14257d62',
  message: 'Settlement executed in tx 0x169979ed0957bebf273a1ceb78168c3738827d929f07410a11b1f12e14257d62 (block 42571738)',
  retries: 0,
  clientId: '4bd3d206-1e53-48ee-beb9-b1c26213d660',
  createdAt: '2025-10-11T16:11:44.389Z',
  updatedAt: '2025-10-11T16:12:09.306Z'
}
```
