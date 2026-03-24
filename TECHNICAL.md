# Technical Documentation

## Architecture Overview

This is a **prediction market platform** (Polymarket-style) with three layers: **Frontend (Vue 3)**, **Backend (Spring Boot)**, and **Blockchain (Polygon + Solidity)**.

```
┌─────────────────────────────────────────────────────┐
│  Mobile H5 (Vue 3 + Vant + Capacitor → APK)        │
│  Admin Panel (Vue 2 + Element UI)                   │
└──────────────────────┬──────────────────────────────┘
                       │  REST API + WebSocket
┌──────────────────────┴──────────────────────────────┐
│  Java Backend (Spring Boot + MyBatis)               │
│  ┌────────────┐ ┌─────────────┐ ┌────────────────┐ │
│  │ Order      │ │ Chain       │ │ Admin          │ │
│  │ Matching   │ │ Service     │ │ Controller     │ │
│  │ Engine     │ │ (Web3j)     │ │ (Settlement)   │ │
│  └────────────┘ └──────┬──────┘ └────────────────┘ │
└─────────────────────────┼───────────────────────────┘
                          │  JSON-RPC (Polygon)
┌─────────────────────────┴───────────────────────────┐
│  Polygon Blockchain                                  │
│  ┌───────────────────────────────────────────────┐  │
│  │  BetMarketV1 (UUPS Upgradeable Proxy)         │  │
│  │  - placeBet(user, event, outcome, side, ...)  │  │
│  │  - settleEvent(eventId, winOutcome)            │  │
│  │  - USDT ERC-20 escrow & automated payout      │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  USDT (ERC-20) on Polygon                     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Fund Flow

```
User deposits USDT
       │
       ▼
┌──────────────┐     Order matched      ┌──────────────────┐
│ User Wallet  │ ────────────────────▶  │ BetMarketV1      │
│ (on Polygon) │   transferUSDT()       │ Smart Contract   │
└──────────────┘                        │ (Escrow)         │
                                        └────────┬─────────┘
                                                 │
                              Event settled       │ settleEvent()
                                                 │
                                        ┌────────▼─────────┐
                                        │ Winners receive   │
                                        │ USDT automatically│
                                        └──────────────────┘
```

**Key principle**: User funds are held in the smart contract, not in a platform wallet. Settlement is automated and verifiable on-chain.

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Mobile Frontend | Vue 3, Vite, Vant 4, Capacitor | H5 webapp + Android APK |
| Admin Panel | Vue 2, Element UI | Event management, settlement, contract monitoring |
| Backend | Java 8+, Spring Boot, MyBatis | REST API, order matching, chain interaction |
| Blockchain | Solidity 0.8.22, Hardhat, OpenZeppelin | Smart contract development & deployment |
| Chain Interaction | Web3j (Java) | Contract calls, USDT transfers, gas management |
| Database | MySQL 5.7+ | Events, orders, trades, users, wallets |
| Chain | Polygon (Matic) | Low gas fees, fast finality |
| Token | USDT (ERC-20) | Stablecoin for betting |

---

## Smart Contract: BetMarketV1

### Design
- **UUPS Proxy Pattern** — Upgradeable without changing contract address or losing state
- **Owner-only operations** — Only platform can call `placeBet`, `settleEvent`
- **USDT escrow** — Contract holds all bet funds until settlement

### Functions

| Function | Access | Description |
|----------|--------|-------------|
| `placeBet(user, eventId, outcomeId, side, price, shares, cost)` | Owner | Record a matched bet, contract already holds the USDT |
| `settleEvent(eventId, winOutcomeId, winners[], amounts[])` | Owner | Pay out USDT to all winners in one transaction |
| `resetEvent(eventId)` | Owner | Clear event data (testing only) |
| `withdrawAll()` | Owner | Emergency withdrawal |
| `getEventInfo(eventId)` | Public | Query event totals and status |
| `version()` | Public | Return contract version string |

### Events (Solidity)
```solidity
event BetPlaced(address indexed user, uint256 indexed eventId, uint256 outcomeId, uint256 side, uint256 price, uint256 shares, uint256 cost);
event EventSettled(uint256 indexed eventId, uint256 winOutcomeId, uint256 totalPayout);
event EventReset(uint256 indexed eventId);
```

### Upgrade Process
```bash
# Deploy initial version
npx hardhat run scripts/deployBetMarket.js --network polygon

# Upgrade to new version
npx hardhat run scripts/upgradeBetMarket.js --network polygon
```

---

## Order Matching

### Flow
1. User places a **limit order** (YES or NO, at a specific price, for N shares)
2. Backend checks for opposing orders at compatible prices
3. If match found:
   - Both users' USDT transferred from their wallets → contract
   - `placeBet()` called on contract for both sides
   - Trade record created in database
4. If no match: order stays in order book as "pending"

### Price Model
- Prices are between **0.01** and **0.99** (representing probability)
- YES price + NO price = 1.00 (always)
- A YES order at 0.60 matches a NO order at 0.40
- Winner gets $1.00 per share, so profit = $1.00 - price paid

### Example
```
Event: "Will BTC reach $150K?"

Alice buys 10 shares YES @ $0.60  → pays $6.00
Bob   buys 10 shares NO  @ $0.40  → pays $4.00
                                     Total in contract: $10.00

Result: YES wins
  Alice receives 10 × $1.00 = $10.00  (profit: +$4.00)
  Bob   receives nothing               (loss:   -$4.00)
```

---

## Database Schema (Core Tables)

```sql
-- Prediction events
t_pm_event (
  id, category_id, title, title_en, description, image_url,
  status,          -- 'open' | 'closed' | 'settled' | 'cancelled'
  end_time, volume, is_hot, is_featured,
  contract_address, chain_market_id, tx_hash,
  resolution,      -- winning outcome ID
  settled_at, create_time
)

-- Event outcomes (Yes/No or multiple choice)
t_pm_outcome (
  id, event_id, label, label_en,
  price,         -- current probability (0.01 ~ 0.99)
  total_shares, token_id, result  -- 'WIN' | 'LOSE'
)

-- User orders
t_pm_order (
  id, user_id, event_id, outcome_id,
  side,          -- 'YES' | 'NO'
  limit_price, total_shares, filled_shares,
  amount,        -- total USDT cost
  status,        -- 'pending' | 'partial' | 'matched' | 'settled' | 'cancelled'
  chain_tx_hash, profit, create_time
)

-- Matched trades
t_pm_trade (
  id, event_id, outcome_id,
  yes_order_id, no_order_id,
  yes_user_id, no_user_id,
  price, shares, amount,
  chain_tx_hash, create_time
)

-- On-chain operation log
t_pm_chain_log (
  id, operation, event_id, user_id,
  tx_hash, status, gas_used,
  error_msg, create_time
)
```

---

## API Endpoints (Key)

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/bussiness/pm/categories` | List event categories |
| GET | `/bussiness/pm/events` | List events (filter by category, status, keyword) |
| GET | `/bussiness/pm/event/{id}` | Event detail with outcomes |
| GET | `/bussiness/pm/chain/config` | Chain configuration (contract address, explorer) |

### User (Auth Required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/bussiness/pm/order` | Place a limit order |
| DELETE | `/bussiness/pm/order/{id}` | Cancel pending order |
| GET | `/bussiness/pm/mybets` | My active positions |
| GET | `/bussiness/pm/myhistory` | My settled history |
| GET | `/bussiness/pm/wallet` | Get my Polygon wallet address |
| GET | `/bussiness/pm/chain/balance` | My on-chain USDT balance |
| POST | `/bussiness/pm/export-key` | Export wallet private key |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| POST | `/bussiness/pm/event` | Create event |
| PUT | `/bussiness/pm/event` | Update event |
| POST | `/bussiness/pm/event/settle` | Settle event (pick winner) |
| POST | `/bussiness/pm/event/confirm-settle` | Confirm & execute on-chain settlement |
| POST | `/bussiness/pm/event/cancel` | Cancel event & refund all |
| GET | `/bussiness/pm/contract/info` | Contract status (balance, version) |
| POST | `/bussiness/pm/resetForTest` | One-click reset event (testing) |

---

## Chain Service

The `PolymarketChainService` handles all blockchain interactions:

- **Wallet Management** — Auto-create Polygon wallet for each user, store encrypted private key
- **USDT Transfer** — Transfer USDT from user wallet to contract (platform signs on behalf of user)
- **Contract Calls** — `placeBet`, `settleEvent`, `resetEvent` via Web3j
- **Gas Sponsorship** — Platform funds gas for all user transactions (EIP-1559)
- **Nonce Management** — Atomic nonce counter to prevent collision under concurrency
- **Balance Query** — On-chain USDT balance for users and contract

### Gas Flow
```
Platform POL wallet (holds MATIC/POL for gas)
       │
       │  Funds gas for every user transaction
       ▼
User's Polygon wallet ──── USDT transfer ───▶ BetMarketV1 contract
```

---

## Deployment

### Prerequisites
- Java 8+ & Maven
- Node.js 16+ & npm
- MySQL 5.7+
- Polygon RPC endpoint (Alchemy/Infura)
- Platform wallet with POL (for gas) and USDT (for initial liquidity)

### Steps
```bash
# 1. Deploy smart contract
cd contracts
npm install
npx hardhat run scripts/deployBetMarket.js --network polygon

# 2. Configure backend
# Set contract address, RPC URL, platform wallet in application.yml

# 3. Build & run backend
cd Javabase
mvn package -DskipTests
java -jar ruoyi-admin/target/ruoyi-admin.jar   # Admin API :8080
java -jar ruoyi-api/target/ruoyi-api.jar        # User API  :8221

# 4. Build frontend
cd h5base
npm install && npm run build

# 5. Build Android APK (optional)
npx cap sync android
cd android && gradlew.bat assembleDebug

# 6. Build admin panel
cd admin
npm install && npm run build
```

---

## Security Considerations

- User private keys are encrypted at rest in database
- Platform private key should be in environment variable, not in code
- Contract is owner-only for critical operations
- UUPS proxy allows patching vulnerabilities without redeployment
- Rate limiting on order placement API
- All chain operations logged to `t_pm_chain_log`

---

## Future Roadmap

- [ ] Batch settlement for events with many winners (gas optimization)
- [ ] AMM liquidity pool for instant trading without order matching
- [ ] ERC-1155 conditional tokens (Gnosis CTF compatibility)
- [ ] Account abstraction (ERC-4337) for gasless UX
- [ ] Oracle integration (UMA / Chainlink) for decentralized resolution
- [ ] Multi-chain support (Base, Arbitrum)

---

*For the complete source code, deployment support, or custom development, please contact us.*
