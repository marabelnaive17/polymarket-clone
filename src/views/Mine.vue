<template>
  <div class="pm-mine">
    <div class="mine-header">
      <div class="mine-header-left">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#0066FF"/>
          <path d="M10 8h6a6 6 0 010 12h-2v4h-4V8z" fill="#fff"/>
        </svg>
        <span class="logo-text">Prediction Market</span>
      </div>
      <div class="mine-header-right">
        <van-icon name="bell" size="22" color="#374151" @click="showContact" />
        <div class="user-avatar" @click="showContact">
          <svg viewBox="0 0 120 120" width="30" height="30">
            <defs>
              <linearGradient id="mAvG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a78bfa"/><stop offset="50%" style="stop-color:#60a5fa"/><stop offset="100%" style="stop-color:#34d399"/>
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="60" fill="url(#mAvG)"/>
            <circle cx="60" cy="46" r="18" fill="rgba(255,255,255,0.9)"/>
            <ellipse cx="60" cy="92" rx="28" ry="20" fill="rgba(255,255,255,0.9)"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="asset-overview">
      <div class="asset-top-row">
        <div>
          <div class="asset-label">Portfolio value</div>
          <div class="asset-total">$1,250.00 <van-icon name="eye-o" size="16" color="#9ca3af" style="margin-left:4px;" /></div>
          <div class="asset-change">+$32.50 (2.6%) past day</div>
        </div>
        <div class="asset-available-box">
          <div class="asset-label">Available for trading</div>
          <div class="asset-available-val">$500.00</div>
        </div>
      </div>
      <div class="wallet-row" @click="showContact">
        <span class="wallet-label">Polygon</span>
        <span class="wallet-addr">0x1a2b...c3d4</span>
        <span class="wallet-balance">500.00 USDT</span>
        <span class="wallet-link">↗</span>
      </div>
      <div class="asset-btns">
        <button class="btn-deposit" @click="showContact"><van-icon name="down" size="14" /> Deposit</button>
        <button class="btn-withdraw" @click="showContact"><van-icon name="upgrade" size="14" /> Withdraw</button>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-head">
        <div class="chart-label"><span class="dot"></span> Profit / Loss</div>
        <div class="chart-periods">
          <span v-for="p in ['1D','1W','1M','ALL']" :key="p" :class="{ active: p === '1M' }">{{ p }}</span>
        </div>
      </div>
      <div class="chart-value">+$32.50</div>
      <div class="chart-sub">Past month</div>
      <div class="chart-bar"><div class="bar-fill" style="width:65%;"></div></div>
    </div>

    <div class="trade-section">
      <div class="trade-tabs">
        <span v-for="t in ['Positions','Pending','History']" :key="t" :class="['trade-tab', { active: t === 'Positions' }]">{{ t }}</span>
      </div>
      <div class="trade-content">
        <div v-for="bet in mockBets" :key="bet.title" class="bet-card" @click="showContact">
          <div class="bet-info">
            <div class="bet-title">{{ bet.title }}</div>
            <div class="bet-meta">
              <span :class="['bet-side', bet.side === 'YES' ? 'yes' : 'no']">{{ bet.side }}</span>
              <span class="bet-status">Matched</span>
            </div>
          </div>
          <div class="bet-value">
            <div class="bet-amount">${{ bet.amount }}</div>
            <div class="bet-shares">{{ bet.shares }} shares</div>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-menu">
      <div v-for="item in quickItems" :key="item.label" class="quick-item" @click="showContact">
        <van-icon :name="item.icon" size="22" color="#0066FF" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="logout-area">
      <button class="btn-logout" @click="showContact">Log out</button>
    </div>

    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup>
import { showDialog } from 'vant'
import { CONTACT_MSG } from '../data'

const showContact = () => showDialog({ title: 'Get Full Version', message: CONTACT_MSG, confirmButtonText: 'OK', confirmButtonColor: '#0066FF' })

const mockBets = [
  { title: 'Will Bitcoin reach $150K by end of 2026?', side: 'YES', amount: '250.00', shares: '4.0' },
  { title: 'Will AI replace 50% of coding jobs by 2028?', side: 'NO', amount: '100.00', shares: '1.5' },
  { title: 'Next FIFA World Cup 2026 Winner - Brazil', side: 'YES', amount: '50.00', shares: '2.3' }
]

const quickItems = [
  { icon: 'shield-o', label: 'Private Key' },
  { icon: 'balance-o', label: 'Assets' },
  { icon: 'bar-chart-o', label: 'Finance' },
  { icon: 'font-o', label: 'Language' },
  { icon: 'lock', label: 'Password' },
  { icon: 'service-o', label: 'Support' }
]
</script>

<style scoped>
.pm-mine {
  min-height: 100vh; padding-bottom: 80px;
  background: linear-gradient(180deg, #eef4ff 0%, #f7f8fa 160px); color: #111827;
}
.mine-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; padding-top: calc(10px + env(safe-area-inset-top));
}
.mine-header-left { display: flex; align-items: center; gap: 8px; }
.logo-text { font-size: 18px; font-weight: 700; color: #111827; }
.mine-header-right { display: flex; align-items: center; gap: 14px; }
.user-avatar { width: 30px; height: 30px; cursor: pointer; }
.asset-overview {
  margin: 0 16px 12px; padding: 16px; background: #fff; border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.asset-top-row { display: flex; justify-content: space-between; align-items: flex-start; }
.asset-label { font-size: 12px; color: #9ca3af; display: flex; align-items: center; }
.asset-total { font-size: 28px; font-weight: 700; color: #111827; margin-top: 4px; display: flex; align-items: center; }
.asset-change { font-size: 12px; color: #15803d; margin-top: 2px; }
.asset-available-box { text-align: right; }
.asset-available-val { font-size: 20px; font-weight: 700; color: #0066FF; margin-top: 4px; }
.wallet-row {
  display: flex; align-items: center; gap: 6px; margin-top: 10px; margin-bottom: 2px;
  padding: 6px 10px; background: #f0f5ff; border-radius: 8px; cursor: pointer;
}
.wallet-label { font-size: 11px; font-weight: 600; color: #7c3aed; background: #ede9fe; padding: 1px 6px; border-radius: 4px; }
.wallet-addr { font-size: 12px; color: #4b5563; font-family: 'SF Mono', 'Consolas', monospace; }
.wallet-balance { font-size: 12px; color: #059669; font-weight: 600; }
.wallet-link { font-size: 12px; color: #0066FF; text-decoration: none; margin-left: auto; }
.asset-btns {
  display: flex; gap: 10px; margin-top: 14px;
}
.asset-btns button {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
}
.btn-deposit { background: #0066FF; color: #fff; }
.btn-withdraw { background: #f3f4f6; color: #374151; }
.chart-card {
  margin: 0 16px 12px; padding: 16px; background: #fff; border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.chart-head { display: flex; justify-content: space-between; align-items: center; }
.chart-label { font-size: 13px; color: #374151; display: flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #111827; }
.chart-periods { display: flex; gap: 4px; }
.chart-periods span { padding: 3px 10px; font-size: 12px; color: #6b7280; border-radius: 10px; cursor: pointer; }
.chart-periods span.active { background: #eef4ff; color: #0066FF; font-weight: 600; }
.chart-value { font-size: 22px; font-weight: 700; color: #15803d; margin-top: 6px; }
.chart-sub { font-size: 12px; color: #9ca3af; margin-bottom: 10px; }
.chart-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #c7d2fe, #a5b4fc); border-radius: 3px; }
.trade-section {
  margin: 0 16px 12px; background: #fff; border-radius: 14px; padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.trade-tabs { display: flex; gap: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; margin-bottom: 12px; }
.trade-tab {
  font-size: 14px; color: #9ca3af; font-weight: 500; cursor: pointer; position: relative;
}
.trade-tab.active { color: #111827; font-weight: 700; }
.trade-tab.active::after {
  content: ''; position: absolute; bottom: -10px; left: 0; right: 0; height: 2px;
  background: #0066FF; border-radius: 1px;
}
.trade-content { min-height: 80px; }
.bet-card {
  display: flex; justify-content: space-between; align-items: center; padding: 12px 0;
  border-bottom: 1px solid #f3f4f6; cursor: pointer;
}
.bet-card:last-child { border-bottom: none; }
.bet-title { font-size: 14px; font-weight: 600; color: #111827; line-height: 1.3; }
.bet-meta { margin-top: 4px; display: flex; align-items: center; gap: 8px; }
.bet-side { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
.bet-side.yes { background: #dcfce7; color: #15803d; }
.bet-side.no { background: #fee2e2; color: #dc2626; }
.bet-status { font-size: 12px; color: #6b7280; }
.bet-value { text-align: right; }
.bet-amount { font-size: 14px; font-weight: 600; color: #111827; }
.bet-shares { font-size: 12px; color: #9ca3af; }
.quick-menu {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
  margin: 0 16px 12px; padding: 16px; background: #fff; border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.quick-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0;
  cursor: pointer; border-radius: 8px;
}
.quick-item:active { background: #f3f4f6; }
.quick-item span { font-size: 12px; color: #6b7280; }
.logout-area { padding: 0 16px 20px; }
.btn-logout {
  width: 100%; padding: 12px; border: 1px solid #fecaca; border-radius: 10px;
  background: #fff; color: #dc2626; font-size: 14px; font-weight: 600; cursor: pointer;
}
.btn-logout:active { background: #fef2f2; }
.bottom-spacer { height: 20px; }
</style>
