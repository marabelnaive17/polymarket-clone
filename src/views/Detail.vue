<template>
  <div class="pm-detail">
    <div class="nav-bar">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="cursor:pointer" />
      <span class="nav-title">Event Detail</span>
      <span></span>
    </div>

    <template v-if="event">
      <div class="pm-event-info">
        <div class="pm-event-emoji">{{ event.image }}</div>
        <div class="pm-event-title">{{ event.title }}</div>
        <div class="pm-event-meta">
          <span class="pm-meta-item"><van-icon name="label-o" /> {{ event.category }}</span>
          <span class="pm-meta-item"><van-icon name="clock-o" /> {{ event.endTime }}</span>
          <span class="pm-meta-item"><van-icon name="chart-trending-o" /> ${{ fmtVol(event.volume) }} Vol.</span>
        </div>
        <div class="pm-chain-tag">
          <span>Polygon · 0x1a2b...c3d4 ↗</span>
        </div>
      </div>

      <div class="pm-outcomes-section">
        <div class="pm-section-title">Select your prediction</div>

        <template v-if="event.outcomes.length === 2">
          <div class="pm-outcome-card pm-binary-card">
            <div class="pm-binary-prices">
              <div class="pm-binary-col yes">
                <span class="pm-binary-label">Yes</span>
                <span class="pm-binary-price">{{ pct(event.outcomes[0].price) }}</span>
              </div>
              <div class="pm-binary-divider"></div>
              <div class="pm-binary-col no">
                <span class="pm-binary-label">No</span>
                <span class="pm-binary-price">{{ pct(event.outcomes[1].price) }}</span>
              </div>
            </div>
            <div class="pm-oc-bar"><div class="pm-oc-bar-fill" :style="{ width: pct(event.outcomes[0].price) }"></div></div>
            <div class="pm-oc-shares">${{ fmtVol(event.volume) }} Vol.</div>
            <div class="pm-oc-actions">
              <button class="pm-btn-yes" @click="showContact">Buy Yes {{ cent(event.outcomes[0].price) }}</button>
              <button class="pm-btn-no" @click="showContact">Buy No {{ cent(event.outcomes[1].price) }}</button>
            </div>
          </div>
        </template>

        <template v-else>
          <div v-for="oc in event.outcomes" :key="oc.id" class="pm-outcome-card">
            <div class="pm-oc-top">
              <span class="pm-oc-label">{{ oc.label }}</span>
              <span class="pm-oc-price">{{ pct(oc.price) }}</span>
            </div>
            <div class="pm-oc-bar"><div class="pm-oc-bar-fill" :style="{ width: pct(oc.price) }"></div></div>
            <div class="pm-oc-actions">
              <button class="pm-btn-yes" @click="showContact">Buy Yes {{ cent(oc.price) }}</button>
              <button class="pm-btn-no" @click="showContact">Buy No {{ cent(1-oc.price) }}</button>
            </div>
          </div>
        </template>
      </div>

      <div class="pm-order-panel">
        <div class="pm-panel-header">
          <span class="pm-panel-title">Buy · Limit Order</span>
        </div>
        <div class="pm-panel-outcome">
          <span class="pm-panel-oc-label">{{ event.outcomes[0].label }}</span>
          <span class="pm-side-badge yes">YES</span>
        </div>
        <div class="pm-price-row">
          <span class="pm-row-label">Limit price</span>
          <div class="pm-price-input">
            <button class="pm-price-btn" @click="showContact">-</button>
            <span class="pm-price-value">{{ cent(event.outcomes[0].price) }}</span>
            <button class="pm-price-btn" @click="showContact">+</button>
          </div>
        </div>
        <div class="pm-shares-row">
          <span class="pm-row-label">Shares</span>
          <input class="pm-shares-input" placeholder="0" @focus="showContact" readonly />
        </div>
        <div class="pm-quick-shares">
          <span v-for="n in [1, 5, 10, 50, 100]" :key="n" class="pm-quick-btn" @click="showContact">+{{ n }}</span>
        </div>
        <div class="pm-summary">
          <div class="pm-summary-row"><span>Total cost</span><span class="pm-summary-val">$0.00</span></div>
          <div class="pm-summary-row"><span>Potential win</span><span class="pm-summary-val pm-green">$0.00</span></div>
        </div>
        <button class="pm-order-btn" @click="showContact">Log in & Place Order</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { showDialog } from 'vant'
import { mockEvents, CONTACT_MSG } from '../data'

const route = useRoute()
const event = computed(() => mockEvents.find(e => e.id === Number(route.params.id)))
const showContact = () => showDialog({ title: 'Get Full Version', message: CONTACT_MSG, confirmButtonText: 'OK', confirmButtonColor: '#0066FF' })
const pct = (p) => Math.round(p * 100) + '%'
const cent = (p) => (p * 100).toFixed(1) + '¢'
const fmtVol = (v) => {
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M'
  if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K'
  return v
}
</script>

<style scoped>
.pm-detail { min-height: 100vh; background: #f5f7fa; padding-bottom: 30px; }
.nav-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; padding-top: calc(12px + env(safe-area-inset-top)); background: #fff;
}
.nav-title { font-size: 16px; font-weight: 600; color: #111827; }
.pm-event-info { background: #fff; padding: 20px 16px 16px; }
.pm-event-emoji { font-size: 36px; margin-bottom: 8px; }
.pm-event-title { font-size: 18px; font-weight: 700; color: #1a1a2e; line-height: 1.4; margin-bottom: 8px; }
.pm-event-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
.pm-meta-item { font-size: 12px; color: #999; display: flex; align-items: center; gap: 4px; }
.pm-chain-tag {
  display: inline-block; font-size: 12px; color: #6b7280; background: #f3f4f6;
  padding: 4px 12px; border-radius: 20px; margin-top: 8px; cursor: pointer;
}
.pm-outcomes-section, .pm-order-panel { background: #fff; margin-top: 10px; padding: 16px; }
.pm-section-title { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
.pm-outcome-card { border: 2px solid #f0f0f0; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
.pm-binary-card .pm-binary-prices { display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.pm-binary-col { flex: 1; text-align: center; }
.pm-binary-col .pm-binary-label { display: block; font-size: 13px; color: #999; margin-bottom: 2px; }
.pm-binary-col.yes .pm-binary-price { font-size: 28px; font-weight: 700; color: #2e7d32; }
.pm-binary-col.no .pm-binary-price { font-size: 28px; font-weight: 700; color: #c62828; }
.pm-binary-divider { width: 1px; height: 40px; background: #e0e0e0; margin: 0 12px; flex-shrink: 0; }
.pm-oc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.pm-oc-label { font-size: 15px; font-weight: 600; color: #333; }
.pm-oc-price { font-size: 20px; font-weight: 700; color: #0066FF; }
.pm-oc-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
.pm-oc-bar-fill { height: 100%; background: #0066FF; border-radius: 3px; transition: width 0.3s; }
.pm-oc-shares { font-size: 12px; color: #999; margin-bottom: 10px; }
.pm-oc-actions { display: flex; gap: 8px; }
.pm-btn-yes, .pm-btn-no {
  flex: 1; padding: 10px 0; border-radius: 8px; font-size: 14px; font-weight: 600;
  border: none; cursor: pointer; text-align: center;
}
.pm-btn-yes { background: #e8f5e9; color: #2e7d32; }
.pm-btn-yes:active { background: #c8e6c9; }
.pm-btn-no { background: #ffebee; color: #c62828; }
.pm-btn-no:active { background: #ffcdd2; }
.pm-panel-header { margin-bottom: 16px; }
.pm-panel-title { font-size: 16px; font-weight: 600; color: #333; }
.pm-panel-outcome { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 15px; font-weight: 500; }
.pm-side-badge { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; }
.pm-side-badge.yes { background: #e8f5e9; color: #2e7d32; }
.pm-price-row, .pm-shares-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.pm-row-label { font-size: 15px; font-weight: 500; color: #333; }
.pm-price-input {
  display: flex; align-items: center; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;
}
.pm-price-btn {
  width: 40px; height: 40px; border: none; background: #f5f7fa; font-size: 18px; font-weight: 600;
  color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.pm-price-value { font-size: 18px; font-weight: 700; color: #0066FF; padding: 0 8px; min-width: 70px; text-align: center; }
.pm-shares-input {
  background: #f5f7fa; border-radius: 10px; font-size: 16px; width: 140px; padding: 8px 12px;
  border: 1px solid #e0e0e0; outline: none;
}
.pm-quick-shares { display: flex; gap: 8px; margin-bottom: 16px; justify-content: flex-end; }
.pm-quick-btn {
  padding: 6px 14px; border-radius: 8px; background: #f0f2f5; font-size: 13px;
  color: #333; font-weight: 500; cursor: pointer;
}
.pm-summary { background: #f8f9fb; border-radius: 10px; padding: 12px; margin-bottom: 16px; }
.pm-summary-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; color: #666; }
.pm-summary-val { font-weight: 600; color: #333; }
.pm-green { color: #2e7d32; }
.pm-order-btn {
  width: 100%; padding: 14px; border-radius: 24px; border: none; background: #0066FF; color: #fff;
  font-size: 16px; font-weight: 600; cursor: pointer;
}
.pm-order-btn:active { background: #0052cc; }
</style>
