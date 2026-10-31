<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Orders to ship</h2>
              <p>Naye orders yahan aate hain. Pack karke <b>Ready to ship</b> dabao, courier pickup apne aap book ho jayega.</p>
            </div>
            <button class="btn btn-default" @click="load(1)"><i class="fas fa-sync-alt mr-1"></i> Refresh</button>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div v-if="isSuper && !companyId" class="alert alert-info">Upar "Working as" se ek seller chuno, tab uske orders dikhenge. Saare sellers ki pickup list <nuxt-link to="/seller/pickups">Pickups</nuxt-link> me hai.</div>

          <div v-if="message" class="alert" :class="messageOk ? 'alert-success' : 'alert-danger'">{{ message }}</div>

          <div class="pn-seg mb-3" style="max-width:100%;overflow:auto">
            <button :class="{ on: tab === 'to_ship' }" @click="setTab('to_ship')">Ship karna hai <span class="pm-count" v-if="counts.to_ship">{{ counts.to_ship }}</span></button>
            <button :class="{ on: tab === 'ready' }" @click="setTab('ready')">Pickup ka intezaar <span class="pm-count" v-if="counts.ready">{{ counts.ready }}</span></button>
            <button :class="{ on: tab === 'shipped' }" @click="setTab('shipped')">Nikal gaye <span class="pm-count" v-if="counts.shipped">{{ counts.shipped }}</span></button>
          </div>

          <div v-if="loading" class="text-center py-5"><i class="fas fa-spinner fa-spin fa-2x text-muted"></i></div>

          <div v-else>
            <div v-for="o in orders" :key="o.order_id" class="card fl-card" :class="{ 'fl-late': o.late }">
              <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-start" style="gap:10px">
                  <div>
                    <div style="font-size:16px;font-weight:800">Order #{{ o.order_id }}
                      <span v-if="o.late" class="pm-st st-hold ml-2">{{ Math.floor(o.age_hours) }} ghante se pending</span>
                    </div>
                    <div class="text-muted" style="font-size:12.5px">{{ fmt(o.created_at) }} &middot; {{ o.customer_city || "-" }}</div>
                  </div>
                  <div class="text-right">
                    <div style="font-size:18px;font-weight:800">&#8377;{{ Number(o.amount).toLocaleString("en-IN") }}</div>
                    <span class="pm-st" :class="o.payment_mode === 'COD' ? 'st-in_payout' : 'st-paid'">{{ o.payment_mode === "COD" ? "COD - paisa delivery par" : "Paid online" }}</span>
                  </div>
                </div>

                <div class="fl-items mt-3">
                  <div v-for="(it, i) in o.items" :key="i" class="d-flex align-items-center py-1">
                    <img v-if="it.image" :src="mediaUrl + it.image" class="fl-img" alt="" />
                    <span v-else class="fl-img fl-img--empty"><i class="far fa-image"></i></span>
                    <span class="ml-2">{{ it.name }}</span>
                    <span class="ml-auto text-muted">x {{ it.quantity }}</span>
                  </div>
                </div>

                <div class="d-flex flex-wrap align-items-center justify-content-between mt-3" style="gap:10px">
                  <div class="text-muted" style="font-size:13px">
                    <i class="fas fa-weight-hanging mr-1"></i> Parcel ~{{ o.weight_g }} g &middot; shipping fee &#8377;{{ o.seller_ship_fee }}
                    <span v-if="o.waybill"> &middot; AWB <b>{{ o.waybill }}</b></span>
                  </div>
                  <div>
                    <a v-if="o.label_url" :href="o.label_url" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm mr-2"><i class="fas fa-print"></i> Label</a>
                    <button v-if="tab === 'to_ship'" class="btn btn-primary" :disabled="busy === o.order_id" @click="ready(o)">
                      <i class="fas" :class="busy === o.order_id ? 'fa-spinner fa-spin' : 'fa-box'"></i> Ready to ship
                    </button>
                    <span v-else-if="tab === 'ready'" class="pm-st st-in_payout">Courier ka intezaar &middot; {{ Math.floor(o.age_hours) }} ghante</span>
                    <span v-else class="pm-st st-paid">Pickup ho gaya</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!orders.length" class="card"><div class="card-body"><div class="pn-empty"><i class="fas fa-check-double"></i>{{ tab === "to_ship" ? "Abhi koi order ship karne ko nahi, sab clear!" : "Yahan abhi kuch nahi" }}</div></div></div>

            <div class="d-flex justify-content-between align-items-center" v-if="last > 1">
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
import moment from "moment";

export default {
  name: "OrdersToShip",
  data() {
    return { tab: "to_ship", orders: [], counts: {}, page: 1, last: 1, loading: false, busy: 0, message: "", messageOk: true };
  },
  computed: {
    isSuper() {
      const u = this.$auth.user;
      return !!(u && u.roles && u.roles.some((r) => r.id === 1));
    },
    org() {
      return this.$store.getters["settings/organization"];
    },
    companyId() {
      return this.org ? this.org.value : "";
    },
    mediaUrl() {
      const b = this.$axios.defaults.baseURL;
      return b ? b.replace("/api", "/media/") : "/media/";
    },
  },
  mounted() {
    this.load(1);
    // the seller has opened the page = new orders are "seen" (clears the alert)
    this.$axios.post("fulfilment/seen", this.isSuper && this.companyId ? { company_id: this.companyId } : {}).catch(() => {});
  },
  methods: {
    fmt(d) {
      return d ? moment(d).format("DD MMM, hh:mm A") : "";
    },
    msg(e, fb) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fb;
    },
    setTab(t) {
      this.tab = t;
      this.load(1);
    },
    async load(page) {
      if (this.isSuper && !this.companyId) { this.orders = []; return; }
      this.loading = true;
      try {
        const params = { tab: this.tab, page, rowsPerPage: 15 };
        if (this.isSuper) params.company_id = this.companyId;
        const r = await this.$axios.get("fulfilment/orders", { params });
        this.orders = r.data.data || [];
        this.counts = r.data.counts || {};
        this.page = r.data.current_page || 1;
        this.last = r.data.last_page || 1;
      } catch (e) {
        this.orders = [];
        this.message = this.msg(e, "Orders load nahi hue.");
        this.messageOk = false;
      } finally {
        this.loading = false;
      }
    },
    async ready(o) {
      const ok = await this.$root.confirm(`Order #${o.order_id} pack ho gaya? Courier pickup book ho jayega.`);
      if (!ok) return;
      this.busy = o.order_id;
      this.message = "";
      try {
        const r = await this.$axios.post(`fulfilment/orders/${o.order_id}/ready`);
        this.message = r.data.message || "Order ready ho gaya.";
        this.messageOk = true;
        await this.load(this.page);
      } catch (e) {
        this.message = this.msg(e, "Ready nahi ho saka.");
        this.messageOk = false;
      } finally {
        this.busy = 0;
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
.pm-count { display: inline-block; min-width: 20px; padding: 0 6px; margin-left: 6px; border-radius: 999px; background: #c99a2e; color: #fff; font-size: 11px; font-weight: 800; }
.fl-card.fl-late { border-left: 4px solid #d64545 !important; }
.fl-items { border-top: 1px solid #eef2ef; padding-top: 8px; }
.fl-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; background: #f1f4f2; display: inline-flex; align-items: center; justify-content: center; color: #b3bfb8; }
</style>
