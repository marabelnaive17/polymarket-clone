# 🔮 Polymarket Clone — Open Source Prediction Market Platform (Polygon + Vue 3 + Solidity)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](https://vuejs.org/)
[![Polygon](https://img.shields.io/badge/Chain-Polygon-7B3FE4.svg)](https://polygon.technology/)

A fully functional **prediction market platform** inspired by [Polymarket](https://polymarket.com), built with Vue 3 and designed for deployment on Polygon with on-chain USDT escrow and automated settlement.

![Preview](https://img.shields.io/badge/Status-Live_Demo-green)

---

## ✨ Features

### This Open Source Demo
- 🎨 **Beautiful Mobile UI** — Polymarket-style interface with Vant UI components
- 📱 **Responsive Design** — Mobile-first, works on all screen sizes
- 🎯 **Market Browsing** — Event listing, filtering by category, search
- 📊 **Event Detail** — Outcome probabilities, order panel, positions view
- 👤 **Portfolio Page** — Asset overview, wallet display, trade history
- ⚡ **Fast Build** — Vue 3 + Vite, builds in seconds

### Full Version (Contact Us)
- ✅ **On-chain USDT Escrow** — Funds held in smart contract on Polygon, not by platform
- ✅ **Smart Contract Settlement** — Automated payout to winners via BetMarket contract
- ✅ **UUPS Upgradeable Contract** — Upgrade logic without changing address or state
- ✅ **Order Matching Engine** — Real-time limit order matching with price discovery
- ✅ **Admin Dashboard** — Event management, contract monitoring, settlement controls
- ✅ **On-chain Wallet per User** — Each user gets a Polygon wallet with private key export
- ✅ **Gas Fee Sponsorship** — Platform covers all gas fees for users
- ✅ **Multi-language** — English, Chinese, and 10+ languages
- ✅ **Mobile APP** — Android APK via Capacitor
- ✅ **Java Backend** — Spring Boot + MyBatis, battle-tested in production
- ✅ **Oracle Integration** — Event resolution with dispute mechanism
- ✅ **Complete API** — REST API for all operations

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/polymarket-clone.git
cd polymarket-clone

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173 in your browser.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Vue 3)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Markets  │  │  Detail  │  │  Portfolio   │  │
│  │  List     │  │  + Order │  │  + Wallet    │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────┬───────────────────────────┘
                      │ REST API
┌─────────────────────┴───────────────────────────┐
│               Backend (Spring Boot)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Order   │  │  Chain   │  │  Admin       │  │
│  │  Engine  │  │  Service │  │  Controller  │  │
│  └──────────┘  └────┬─────┘  └──────────────┘  │
└──────────────────────┼──────────────────────────┘
                       │ Web3 / RPC
┌──────────────────────┴──────────────────────────┐
│            Polygon Blockchain                    │
│  ┌──────────────────────────────────────────┐   │
│  │  BetMarketV1 (UUPS Proxy)               │   │
│  │  - placeBet()    - settleEvent()         │   │
│  │  - USDT Escrow   - Automated Payout      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/home.png" width="300" alt="Markets - Browse prediction events" />
  &nbsp;&nbsp;&nbsp;
  <img src="screenshots/portfolio.png" width="300" alt="Portfolio - Wallet, positions, P&L" />
</p>

| Markets Page | Portfolio Page |
|:---:|:---:|
| Browse events, buy Yes/No shares | Polygon wallet, holdings, P&L chart |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, Vite, Vant UI, Vue Router |
| Backend | Java, Spring Boot, MyBatis (Full version) |
| Blockchain | Polygon, Solidity, Hardhat, UUPS Proxy |
| Database | MySQL (Full version) |
| Mobile | Capacitor (Android/iOS) |
| Contract | BetMarketV1 — USDT escrow + settlement |

---

## 💰 How It Works

1. **Create Market** — Admin creates prediction event (e.g., "Will BTC reach $150K?")
2. **Place Bets** — Users buy YES or NO shares at their chosen price
3. **Order Matching** — Backend matches opposing orders in real-time
4. **On-chain Record** — Matched bets are recorded on Polygon via smart contract
5. **Settlement** — When event resolves, contract automatically pays winners
6. **Withdraw** — Users withdraw USDT to any Polygon wallet

---

## 🌟 Full Version

The complete production-ready platform includes:

- **Smart Contract** — Audited BetMarketV1 with UUPS upgrade support
- **Java Backend** — Complete REST API with order matching, settlement, admin
- **Admin Panel** — Vue-based dashboard for event/contract/user management
- **Mobile App** — Android APK ready for distribution
- **Deployment Scripts** — Hardhat deploy/upgrade, Docker configs

### 📧 Contact Us

For the full version, deployment support, or custom development:

- **Email**: your-email@example.com
- **Telegram**: @yourhandle

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Star This Repo

If you find this useful, please give it a ⭐ — it helps others discover this project!

---

*Built with ❤️ for the prediction market community*
