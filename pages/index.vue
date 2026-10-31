<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Namaste, {{ firstName }} 👋</h2>
              <p v-if="isSuper">Poore marketplace ka live overview - jo kaam pending hai wo neeche dikh raha hai.</p>
              <p v-else>Aapki dukaan ka aaj ka haal aur jo kaam baaki hai.</p>
            </div>
            <div class="d-flex align-items-center" style="gap:10px">
              <div class="pn-seg">
                <button v-for="p in periods" :key="p.v" :class="{ on: period === p.v }" @click="setPeriod(p.v)">{{ p.t }}</button>
              </div>
              <button class="pn-btn-ghost" @click="load" :disabled="loading">
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- ===== things waiting for you ===== -->
          <div class="pn-tasks">
            <nuxt-link v-for="t in tasks" :key="t.key" :to="t.link" class="pn-task" :class="{ 'is-zero': !t.num }">
              <span class="pn-task__ico"><i :class="t.icon"></i></span>
              <span>
                <div class="pn-task__num">{{ t.num }}</div>
                <div class="pn-task__txt">{{ t.text }}</div>
              </span>
            </nuxt-link>
          </div>

          <!-- ===== KPI row ===== -->
          <div class="row">
            <div class="col-xl-3 col-sm-6">
              <div class="small-box bg-success">
                <div class="inner"><h3>{{ money(stats.total_revenue) }}</h3><p>Sales</p></div>
                <div class="icon"><i class="fas fa-rupee-sign"></i></div>
              </div>
            </div>
            <div class="col-xl-3 col-sm-6">
              <div class="small-box bg-info">
                <div class="inner"><h3>{{ stats.total_orders || 0 }}</h3><p>Orders</p></div>
                <div class="icon"><i class="fas fa-shopping-bag"></i></div>
              </div>
            </div>
            <div class="col-xl-3 col-sm-6">
              <div class="small-box bg-warning">
                <div class="inner"><h3>{{ stats.pending_orders || 0 }}</h3><p>Orders to process</p></div>
                <div class="icon"><i class="fas fa-clock"></i></div>
              </div>
            </div>
            <div class="col-xl-3 col-sm-6">
              <div class="small-box bg-gradient-primary">
                <div class="inner">
                  <h3>{{ money(isSuper ? stats.commission_earned : stats.total_earnings) }}</h3>
                  <p>{{ isSuper ? "Aadab commission" : "Your earnings" }}</p>
                </div>
                <div class="icon"><i class="fas fa-wallet"></i></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 col-sm-6">
              <div class="small-box bg-success">
                <div class="inner"><h3>{{ money(stats.paid_amount) }}</h3><p>{{ isSuper ? "Paid to sellers" : "Received in bank" }}</p></div>
                <div class="icon"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
            <div class="col-md-4 col-sm-6">
              <div class="small-box bg-danger">
                <div class="inner"><h3>{{ money(stats.pending_amount) }}</h3><p>{{ isSuper ? "Payouts pending" : "Yet to be paid" }}</p></div>
                <div class="icon"><i class="fas fa-hourglass-half"></i></div>
              </div>
            </div>
            <div class="col-md-4" v-if="isSuper">
              <div class="small-box bg-info">
                <div class="inner"><h3>{{ stats.active_sellers || 0 }} <small style="font-size:14px;color:#6b7a72">/ {{ stats.total_products || 0 }} products</small></h3><p>Active sellers</p></div>
                <div class="icon"><i class="fas fa-store"></i></div>
              </div>
            </div>
            <div class="col-md-4" v-else>
              <div class="small-box bg-info">
                <div class="inner"><h3>{{ stats.total_products || 0 }}</h3><p>Products listed</p></div>
                <div class="icon"><i class="fas fa-box"></i></div>
              </div>
            </div>
          </div>

          <!-- ===== quick actions ===== -->
          <div class="card">
            <div class="card-body">
              <div class="pn-actions">
                <template v-if="isSuper">
                  <nuxt-link class="btn btn-primary" to="/seller/applications"><i class="fas fa-user-check mr-1"></i> Review sellers</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/seller/products"><i class="fas fa-clipboard-check mr-1"></i> Approve products</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/seller/category-requests"><i class="fas fa-lightbulb mr-1"></i> Category requests</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/seller/payouts"><i class="fas fa-money-bill-wave mr-1"></i> Seller payouts</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/categories"><i class="fas fa-th-large mr-1"></i> Categories</nuxt-link>
                </template>
                <template v-else>
                  <nuxt-link class="btn btn-primary" :to="`${orgBase}/products/create`" v-if="orgBase"><i class="fas fa-plus mr-1"></i> Add product</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" :to="`${orgBase}/products/bulk-upload`" v-if="orgBase"><i class="fas fa-upload mr-1"></i> Bulk upload</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/orders"><i class="fas fa-shopping-bag mr-1"></i> Orders</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/seller/category-requests"><i class="fas fa-lightbulb mr-1"></i> Request category</nuxt-link>
                  <nuxt-link class="btn btn-outline-primary" to="/seller/chat"><i class="fas fa-comments mr-1"></i> Customer chat</nuxt-link>
                </template>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- recent orders -->
            <div class="col-lg-8">
              <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between">
                  <h3 class="card-title">Recent orders</h3>
                  <nuxt-link to="/orders" class="btn btn-sm btn-outline-primary">View all</nuxt-link>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table">
                    <thead>
                      <tr><th>Order</th><th v-if="isSuper">Seller</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="o in recentOrders" :key="o.id">
                        <td><strong>#{{ o.id }}</strong></td>
                        <td v-if="isSuper">{{ o.company ? o.company.name : "-" }}</td>
                        <td>{{ o.user ? o.user.first_name : "-" }}</td>
                        <td>{{ money(o.order_cost) }}</td>
                        <td><span class="badge" :class="statusClass(o)">{{ statusText(o) }}</span></td>
                        <td>{{ fmt(o.created_at) }}</td>
                      </tr>
                      <tr v-if="!recentOrders.length">
                        <td :colspan="isSuper ? 6 : 5"><div class="pn-empty"><i class="fas fa-inbox"></i>Abhi koi order nahi aaya</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- top products -->
            <div class="col-lg-4">
              <div class="card">
                <div class="card-header"><h3 class="card-title">Best sellers</h3></div>
                <div class="card-body p-0">
                  <div v-for="(p, i) in topProducts" :key="i" class="d-flex align-items-center px-3 py-2" style="border-bottom:1px solid #eef2ef">
                    <span class="pn-task__ico" style="width:34px;height:34px;flex-basis:34px;font-size:13px;margin-right:12px">{{ i + 1 }}</span>
                    <div style="min-width:0;flex:1">
                      <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ p.name }}</div>
                      <div class="text-muted" style="font-size:12px">{{ money(p.revenue) }} revenue</div>
                    </div>
                    <span class="badge badge-info">{{ p.total_qty }} sold</span>
                  </div>
                  <div v-if="!topProducts.length" class="pn-empty"><i class="fas fa-box-open"></i>Abhi sales data nahi hai</div>
                </div>
              </div>
            </div>
          </div>

          <!-- returns by product -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3 class="card-title">Kaunsa product kitna return ho raha hai <span class="text-muted" style="font-weight:400">(pichhle 90 din)</span></h3>
            </div>
            <div class="card-body p-0 table-responsive">
              <table class="table">
                <thead>
                  <tr><th>Product</th><th class="text-right">Bika</th><th class="text-right">Return</th><th class="text-right">Return rate</th><th class="text-right">Seller ki galti</th><th>Sabse badi wajah</th><th class="text-right">Refund</th></tr>
                </thead>
                <tbody>
                  <tr v-for="r in returnsByProduct" :key="r.product_id">
                    <td><strong>{{ r.name }}</strong></td>
                    <td class="text-right">{{ r.units_sold }}</td>
                    <td class="text-right">{{ r.returns }}</td>
                    <td class="text-right"><span :style="{ color: r.return_rate >= 15 ? '#b02a2a' : r.return_rate >= 8 ? '#9a6205' : '#12794a', fontWeight: 700 }">{{ r.return_rate === null ? "-" : r.return_rate + "%" }}</span></td>
                    <td class="text-right">{{ r.seller_fault }}</td>
                    <td>{{ r.top_reason }}</td>
                    <td class="text-right">&#8377;{{ Number(r.refunded).toLocaleString("en-IN") }}</td>
                  </tr>
                  <tr v-if="!returnsByProduct.length"><td colspan="7"><div class="pn-empty"><i class="fas fa-smile"></i>Koi return nahi aaya, badhiya!</div></td></tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer text-muted" style="font-size:12.5px" v-if="returnsByProduct.length">Return rate 15% se upar ho to product ki photo / description / size chart check karo. "Seller ki galti" wale returns par return shipping aapse katti hai aur seller score ghat-ta hai.</div>
          </div>

          <!-- earnings -->
          <div class="card">
            <div class="card-header"><h3 class="card-title">Earnings summary</h3></div>
            <div class="card-body p-0 table-responsive">
              <table class="table" v-if="earnings.length">
                <thead>
                  <tr><th>Period</th><th class="text-right">Sales</th><th class="text-right">Commission</th><th class="text-right">Seller earnings</th><th class="text-right">Orders</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(e, i) in earnings" :key="i">
                    <td>{{ e.period }}</td>
                    <td class="text-right">{{ money(e.revenue) }}</td>
                    <td class="text-right">{{ money(e.commission) }}</td>
                    <td class="text-right">{{ money(e.seller_earnings) }}</td>
                    <td class="text-right">{{ e.orders || 0 }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="pn-empty"><i class="fas fa-chart-bar"></i>Is period me koi earning nahi</div>
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
  name: "PanelHome",
  data() {
    return {
      loading: false,
      period: "month",
      periods: [
        { v: "today", t: "Today" },
        { v: "week", t: "Week" },
        { v: "month", t: "Month" },
        { v: "year", t: "Year" },
      ],
      stats: {},
      recentOrders: [],
      topProducts: [],
      returnsByProduct: [],
      earnings: [],
      pending: { applications: 0, approvals: 0, catreq: 0, chat: 0 },
    };
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    isSuper() {
      return !!(this.user && this.user.roles && this.user.roles.some((r) => r.id === 1));
    },
    firstName() {
      return (this.user && (this.user.first_name || this.user.name)) || "";
    },
    orgBase() {
      const o = this.$store.state.settings.organization;
      const id = o && o.value ? o.value : this.user && this.user.companies && this.user.companies.length ? this.user.companies[0].id : "";
      return id ? `/organizations/${id}` : "";
    },
    tasks() {
      if (this.isSuper) {
        return [
          { key: "a", icon: "fas fa-user-plus", num: this.pending.applications, text: "Seller applications to review", link: "/seller/applications" },
          { key: "p", icon: "fas fa-clipboard-check", num: this.pending.approvals, text: "Products waiting approval", link: "/seller/products" },
          { key: "c", icon: "fas fa-lightbulb", num: this.pending.catreq, text: "Category requests", link: "/seller/category-requests" },
          { key: "o", icon: "fas fa-clock", num: this.stats.pending_orders || 0, text: "Orders to process", link: "/orders" },
        ];
      }
      return [
        { key: "o", icon: "fas fa-clock", num: this.stats.pending_orders || 0, text: "Orders to process", link: "/orders" },
        { key: "m", icon: "fas fa-comments", num: this.pending.chat, text: "Unread customer messages", link: "/seller/chat" },
        { key: "c", icon: "fas fa-lightbulb", num: this.pending.catreq, text: "Category requests pending", link: "/seller/category-requests" },
      ];
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    setPeriod(v) {
      this.period = v;
      this.load();
    },
    async load() {
      this.loading = true;
      const params = { period: this.period };
      const safe = (p, fallback) => p.catch(() => ({ data: fallback }));
      try {
        const [s, o, t, e] = await Promise.all([
          safe(this.$axios.get("seller/dashboard/stats", { params }), {}),
          safe(this.$axios.get("seller/dashboard/recent_orders", { params }), { data: [] }),
          safe(this.$axios.get("seller/dashboard/top_products", { params }), { data: [] }),
          safe(this.$axios.get("seller/dashboard/earnings_summary", { params }), { data: [] }),
        ]);
        this.stats = s.data.data || s.data || {};
        this.recentOrders = o.data.data || [];
        this.topProducts = t.data.data || [];
        this.earnings = e.data.data || [];
      } finally {
        this.loading = false;
      }
      this.$axios.get("seller/dashboard/returns_by_product").then((r) => (this.returnsByProduct = r.data.data || [])).catch(() => (this.returnsByProduct = []));
      this.loadPending();
    },
    async loadPending() {
      const get = (url, pick) => this.$axios.get(url).then((r) => pick(r.data)).catch(() => 0);
      const catreq = get("category_requests", (d) => (d.status_counts && d.status_counts.pending) || 0);
      if (this.isSuper) {
        const [a, p, c] = await Promise.all([
          get("seller_applications/counts", (d) => d.pending || 0),
          get("seller_products/status_counts", (d) => d.pending || 0),
          catreq,
        ]);
        this.pending = { applications: a, approvals: p, catreq: c, chat: 0 };
      } else {
        const [m, c] = await Promise.all([get("chat/unread_count", (d) => d.seller || 0), catreq]);
        this.pending = { applications: 0, approvals: 0, catreq: c, chat: m };
      }
    },
    money(n) {
      const v = Number(n || 0);
      return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    },
    fmt(d) {
      return d ? moment(d).format("DD MMM YYYY") : "";
    },
    statusText(o) {
      if (o.order_statuses && o.order_statuses.length && o.order_statuses[0].status) return o.order_statuses[0].status.name;
      return "Placed";
    },
    statusClass(o) {
      const s = this.statusText(o).toLowerCase();
      if (s === "delivered") return "badge-success";
      if (s === "cancelled") return "badge-danger";
      if (s === "shipped" || s === "dispatched") return "badge-info";
      return "badge-warning";
    },
  },
};
</script>
