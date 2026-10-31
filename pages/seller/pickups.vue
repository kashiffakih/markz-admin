<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Pickups</h2>
              <p>Kaunsa seller order ready nahi kar raha, aur kaunsa parcel courier ne abhi tak uthaya nahi. <b>{{ lateHours }} ghante</b> se zyada ruka ho to laal.</p>
            </div>
            <button class="btn btn-default" @click="load(1)"><i class="fas fa-sync-alt mr-1"></i> Refresh</button>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div v-if="message" class="alert" :class="messageOk ? 'alert-success' : 'alert-danger'">{{ message }}</div>

          <div class="row">
            <div class="col-md-4">
              <div class="small-box" :class="{ 'pk-red': counts.awaiting_ready_late > 0 }" @click="setTab('awaiting_ready')" style="cursor:pointer">
                <div class="inner"><h3>{{ counts.awaiting_ready || 0 }}</h3><p>Seller ne ready nahi kiya ({{ counts.awaiting_ready_late || 0 }} late)</p></div>
                <div class="icon"><i class="fas fa-box-open"></i></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="small-box" :class="{ 'pk-red': counts.awaiting_pickup_late > 0 }" @click="setTab('awaiting_pickup')" style="cursor:pointer">
                <div class="inner"><h3>{{ counts.awaiting_pickup || 0 }}</h3><p>Ready hai, pickup baaki ({{ counts.awaiting_pickup_late || 0 }} late)</p></div>
                <div class="icon"><i class="fas fa-truck-loading"></i></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="small-box" @click="setTab('picked_up')" style="cursor:pointer">
                <div class="inner"><h3>{{ counts.picked_up || 0 }}</h3><p>Pickup ho chuka</p></div>
                <div class="icon"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
          </div>

          <div class="pn-seg mb-3" style="max-width:100%;overflow:auto">
            <button v-for="t in tabs" :key="t.v" :class="{ on: tab === t.v }" @click="setTab(t.v)">{{ t.t }}</button>
          </div>

          <div class="card">
            <div class="card-body p-0 table-responsive">
              <table class="table">
                <thead>
                  <tr><th>Order</th><th>Seller</th><th>Parcel</th><th>Kitni der se</th><th>Status</th><th class="text-right">Action</th></tr>
                </thead>
                <tbody>
                  <tr v-for="o in orders" :key="o.order_id" :class="{ 'pk-row-late': o.late }">
                    <td>
                      <b>#{{ o.order_id }}</b>
                      <div class="text-muted" style="font-size:12px">&#8377;{{ Number(o.amount).toLocaleString("en-IN") }} &middot; {{ o.payment_mode }} &middot; {{ o.customer_city || "-" }}</div>
                    </td>
                    <td>
                      <b>{{ o.seller ? o.seller.name : "-" }}</b>
                      <div class="text-muted" style="font-size:12px">{{ o.seller ? [o.seller.city, o.seller.phone].filter(Boolean).join(" | ") : "" }}</div>
                    </td>
                    <td>{{ o.weight_g }} g<div class="text-muted" style="font-size:12px" v-if="o.waybill">AWB {{ o.waybill }}</div></td>
                    <td>
                      <span class="pk-age" :class="{ 'pk-age--late': o.late }">{{ ageText(o.age_hours) }}</span>
                    </td>
                    <td>
                      <span v-if="o.stage === 'awaiting_ready'" class="pm-st st-hold">Seller pack kar raha</span>
                      <span v-else-if="o.stage === 'awaiting_pickup'" class="pm-st st-in_payout">{{ o.pickup_requested_at ? "Pickup booked" : "Pickup manual karwana hai" }}</span>
                      <span v-else class="pm-st st-paid">Pickup ho gaya</span>
                    </td>
                    <td class="text-right" style="white-space:nowrap">
                      <a v-if="o.seller && o.seller.phone" :href="'tel:' + o.seller.phone" class="btn btn-sm btn-outline-primary" title="Seller ko call karo"><i class="fas fa-phone"></i></a>
                      <a v-if="o.seller && o.seller.phone" :href="waLink(o)" target="_blank" rel="noopener" class="btn btn-sm btn-outline-success" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                      <button v-if="o.stage === 'awaiting_pickup'" class="btn btn-sm btn-success" :disabled="busy === o.order_id" @click="pickedUp(o)">Picked up</button>
                      <button v-if="o.stage !== 'awaiting_ready'" class="btn btn-sm btn-default" title="Courier ne weight alag nikala" @click="weight(o)"><i class="fas fa-weight-hanging"></i></button>
                    </td>
                  </tr>
                  <tr v-if="!orders.length && !loading"><td colspan="6"><div class="pn-empty"><i class="fas fa-check-double"></i>Yahan kuch pending nahi</div></td></tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center" v-if="last > 1">
              <button class="btn btn-sm btn-default" :disabled="page <= 1" @click="load(page - 1)">Prev</button>
              <span class="text-muted">Page {{ page }} / {{ last }}</span>
              <button class="btn btn-sm btn-default" :disabled="page >= last" @click="load(page + 1)">Next</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "Pickups",
  data() {
    return {
      tab: "awaiting_pickup",
      tabs: [
        { v: "awaiting_ready", t: "Seller ready nahi" },
        { v: "awaiting_pickup", t: "Pickup baaki" },
        { v: "picked_up", t: "Pickup ho gaya" },
      ],
      orders: [], counts: {}, page: 1, last: 1, lateHours: 24, loading: false, busy: 0, message: "", messageOk: true,
    };
  },
  mounted() {
    this.load(1);
  },
  methods: {
    msg(e, fb) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fb;
    },
    ageText(h) {
      if (h === null || h === undefined) return "-";
      if (h < 1) return "abhi abhi";
      if (h < 48) return Math.floor(h) + " ghante";
      return Math.floor(h / 24) + " din";
    },
    waLink(o) {
      let ph = String((o.seller && o.seller.phone) || "").replace(/\D/g, "");
      if (ph.length === 10) ph = "91" + ph;
      const text = o.stage === "awaiting_ready"
        ? `Namaste, Markz se. Order #${o.order_id} ab tak ready to ship nahi hua. Kripya jaldi pack karke Ready to ship dabaiye.`
        : `Namaste, Markz se. Order #${o.order_id} ka courier pickup baaki hai. Parcel taiyaar rakhiye, pickup aa raha hai.`;
      return `https://wa.me/${ph}?text=${encodeURIComponent(text)}`;
    },
    setTab(t) {
      this.tab = t;
      this.load(1);
    },
    async load(page) {
      this.loading = true;
      try {
        const r = await this.$axios.get("fulfilment/pickups", { params: { tab: this.tab, page, rowsPerPage: 30 } });
        this.orders = r.data.data || [];
        this.counts = r.data.counts || {};
        this.lateHours = r.data.late_hours || 24;
        this.page = r.data.current_page || 1;
        this.last = r.data.last_page || 1;
      } catch (e) {
        this.orders = [];
        this.message = this.msg(e, "Load nahi hua (sirf Super Admin).");
        this.messageOk = false;
      } finally {
        this.loading = false;
      }
    },
    async pickedUp(o) {
      this.busy = o.order_id;
      try {
        await this.$axios.post(`fulfilment/orders/${o.order_id}/picked_up`);
        this.message = `Order #${o.order_id} pickup mark ho gaya.`;
        this.messageOk = true;
        await this.load(this.page);
      } catch (e) {
        this.message = this.msg(e, "Mark nahi ho saka.");
        this.messageOk = false;
      } finally {
        this.busy = 0;
      }
    },
    async weight(o) {
      const v = window.prompt(`Order #${o.order_id}: courier ne parcel ka kitna weight (gram) nikala?`, String(o.weight_g));
      if (!v) return;
      try {
        const r = await this.$axios.post(`fulfilment/orders/${o.order_id}/weight_adjustment`, { actual_weight_g: Number(v) });
        this.message = r.data.message + (r.data.data.extra_fee > 0 ? ` (extra ₹${r.data.data.extra_fee})` : "");
        this.messageOk = true;
        this.load(this.page);
      } catch (e) {
        this.message = this.msg(e, "Weight update nahi hua.");
        this.messageOk = false;
      }
    },
  },
};
</script>

<style scoped>
.pm-st { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.st-paid { background: #e1f5ea; color: #12794a; }
.st-in_payout { background: #fdf1da; color: #9a6205; }
.st-hold { background: #fdecec; color: #b02a2a; }
.pk-red { border-color: #e9a8a8 !important; background: #fff6f6 !important; }
.pk-row-late { background: #fff6f6; }
.pk-age { font-weight: 700; }
.pk-age--late { color: #b02a2a; }
</style>
