<template>
  <div id="app-root">
    <section class="hold-transition sidebar-mini layout-fixed" v-if="authenticated">
      <div class="wrapper">
        <!-- backdrop for the mobile drawer -->
        <div class="drawer-overlay" :class="{ show: isSidebarOpen }" @click="closeSidebar"></div>

        <!-- ============================ TOP BAR ============================ -->
        <nav class="main-header navbar navbar-white navbar-light">
          <div class="pn-top">
            <a class="pn-top__burger" href="#" role="button" @click.prevent="toggleSidebar" aria-label="Menu">
              <i class="fas fa-bars"></i>
            </a>
            <span class="pn-top__title">{{ isSuper ? "Admin Console" : "Seller Hub" }}</span>

            <div class="pn-top__spacer"></div>

            <!-- Super Admin can work inside any seller's account -->
            <div v-if="isSuper" class="pn-top__org">
              <select-organization></select-organization>
            </div>

            <a :href="storeUrl" target="_blank" rel="noopener" class="pn-btn-ghost d-none d-md-inline-flex">
              <i class="fas fa-external-link-alt"></i> View store
            </a>

            <span class="pn-chip">
              <span class="pn-chip__avatar">{{ initials }}</span>
              <span class="pn-chip__name">{{ displayName }}</span>
              <span class="pn-chip__role">{{ roleLabel }}</span>
            </span>

            <button class="pn-btn-ghost" @click="logout"><i class="fas fa-sign-out-alt"></i><span class="d-none d-sm-inline">Logout</span></button>
          </div>
        </nav>

        <!-- ============================ SIDEBAR ============================ -->
        <aside class="main-sidebar elevation-4">
          <nuxt-link to="/" class="brand-link pn-brand">
            <span class="pn-brand__mark">M</span>
            <span>
              <div class="pn-brand__name">MARKZ</div>
              <div class="pn-brand__sub">{{ isSuper ? "Admin Console" : "Seller Hub" }}</div>
            </span>
            <a class="d-block d-lg-none ml-auto" href="#" role="button" @click.prevent.stop="toggleSidebar" style="color:#fff !important;font-size:18px">
              <i class="fas fa-times"></i>
            </a>
          </nuxt-link>

          <div class="sidebar">
            <nav class="mt-1 pb-5 mb-5">
              <ul class="nav nav-pills nav-sidebar flex-column" role="menu">
                <template v-for="(group, i) in menu">
                  <li class="nav-header" v-if="group.title" :key="`h-${i}`">{{ group.title }}</li>
                  <li class="nav-item" v-for="(item, j) in group.items" :key="`i-${i}-${j}`">
                    <nuxt-link :to="item.link" :class="['nav-link', isNavActive(item.link) ? 'active' : '']">
                      <i :class="`nav-icon ${item.icon}`"></i>
                      <p>{{ item.name }}</p>
                      <span v-if="item.badge && badges[item.badge]" class="pn-badge">{{ badges[item.badge] }}</span>
                    </nuxt-link>
                  </li>
                </template>
              </ul>
            </nav>
          </div>
          <div class="pn-sidebar-foot">Markz Marketplace &middot; v2.0</div>
        </aside>

        <!-- new-order alert (sellers) -->
        <div v-if="alertToast" class="pn-alert-toast" @click="openShip">
          <i class="fas fa-bell"></i>
          <div>
            <b>{{ alertToast }}</b>
            <small>Dekhne ke liye yahan dabao</small>
          </div>
          <button class="pn-alert-x" @click.stop="alertToast = null" aria-label="Close">&times;</button>
        </div>

        <!-- ============================ PAGE ============================ -->
        <nuxt></nuxt>

        <footer class="main-footer"><b>Markz</b> &middot; Marketplace panel</footer>
        <aside class="control-sidebar control-sidebar-dark"></aside>
      </div>
    </section>
    <section v-else>
      <nuxt></nuxt>
    </section>
    <confirm-modal ref="confirmModal" />
  </div>
</template>

<script>
import SelectOrganization from "@/components/select-organization.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: "Root",
  components: { SelectOrganization, ConfirmModal },
  data() {
    return {
      isSidebarOpen: false,
      storeUrl: "https://aadab.online",
      badges: { applications: 0, approvals: 0, catreq: 0, toship: 0, pickups: 0 },
      alertToast: null,
      lastNew: 0,
      pollTimer: null,
    };
  },
  watch: {
    $route() {
      this.closeSidebar();
    },
    authenticated(v) {
      if (v) this.loadBadges();
    },
  },
  computed: {
    authenticated() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    isSuper() {
      return !!(this.user && this.user.roles && this.user.roles.some((r) => r.id === 1));
    },
    permissions() {
      if (!this.user || !this.user.roles || !this.user.roles.length) return [];
      const ids = [];
      this.user.roles.forEach((r) => (r.permissions || []).forEach((p) => ids.push(p.id)));
      return ids;
    },
    displayName() {
      if (!this.user) return "";
      return this.user.first_name || this.user.name || this.user.email || "";
    },
    initials() {
      const n = (this.displayName || "A").trim();
      return n.slice(0, 1).toUpperCase();
    },
    roleLabel() {
      if (this.isSuper) return "Super Admin";
      return "Seller";
    },
    organizationId() {
      const organization = this.$store.state.settings.organization;
      if (organization && organization.value) return organization.value;
      if (this.user && this.user.companies && this.user.companies.length > 0) return this.user.companies[0].id;
      return "";
    },
    orgBase() {
      return this.organizationId ? `/organizations/${this.organizationId}` : "";
    },

    /* The whole menu. `show` decides visibility, so adding an item is one line. */
    menu() {
      const has = (n) => this.permissions.indexOf(n) !== -1;
      const base = this.orgBase;
      const groups = [];

      if (this.isSuper) {
        groups.push({ items: [{ name: "Dashboard", icon: "fas fa-chart-pie", link: "/", show: true }] });
        groups.push({
          title: "Sellers",
          items: [
            { name: "Seller Applications", icon: "fas fa-user-plus", link: "/seller/applications", badge: "applications", show: true },
            { name: "All Sellers", icon: "fas fa-store", link: "/organizations", show: has(5) || true },
            { name: "Commission", icon: "fas fa-percentage", link: "/seller/commission", show: true },
            { name: "Seller Payouts", icon: "fas fa-money-bill-wave", link: "/seller/payouts", show: true },
            { name: "Payments Ledger", icon: "fas fa-wallet", link: "/seller/payments", show: true },
          ],
        });
        groups.push({
          title: "Catalog",
          items: [
            { name: "Product Approvals", icon: "fas fa-clipboard-check", link: "/seller/products", badge: "approvals", show: true },
            { name: "Categories", icon: "fas fa-th-large", link: "/categories", show: true },
            { name: "Category Requests", icon: "fas fa-lightbulb", link: "/seller/category-requests", badge: "catreq", show: true },
            { name: "Tags", icon: "fas fa-tags", link: "/tags", show: true },
            { name: "Units", icon: "fas fa-balance-scale", link: "/units", show: true },
          ],
        });
        groups.push({
          title: "Orders",
          items: [
            { name: "Pickups", icon: "fas fa-truck-loading", link: "/seller/pickups", badge: "pickups", show: true },
            { name: "All Orders", icon: "fas fa-shopping-bag", link: "/orders", show: true },
            { name: "Returns & Refunds", icon: "fas fa-undo-alt", link: "/seller/returns", show: true },
          ],
        });
        groups.push({
          title: "Resellers",
          items: [{ name: "Resellers & Withdrawals", icon: "fas fa-user-tag", link: "/seller/resellers", show: true }],
        });
        groups.push({
          title: "Customers",
          items: [
            { name: "Customers", icon: "fas fa-users", link: "/customers", show: true },
            { name: "Chat", icon: "fas fa-comments", link: "/seller/chat", show: true },
            { name: "Notifications", icon: "fas fa-bell", link: "/notifications", show: true },
          ],
        });
        groups.push({
          title: "Growth",
          items: [
            { name: "Home Banners", icon: "fas fa-image", link: "/seller/banners", show: true },
            { name: "Referrals & Offers", icon: "fas fa-gift", link: "/settings", show: true },
            { name: "Coupons", icon: "fas fa-ticket-alt", link: `${base}/coupons`, show: !!base },
          ],
        });
        groups.push({
          title: "Selected seller" ,
          items: [
            { name: "Analytics", icon: "fas fa-chart-line", link: "/analytics", show: !!base },
            { name: "Seller's Products", icon: "fas fa-box", link: `${base}/products`, show: !!base },
            { name: "Add Product", icon: "fas fa-plus-circle", link: "/seller/add-product", show: !!base },
            { name: "Bulk Upload", icon: "fas fa-upload", link: `${base}/products/bulk-upload`, show: !!base },
            { name: "Sales Report", icon: "fas fa-file-invoice-dollar", link: `${base}/reports/sales-report`, show: !!base },
            { name: "Order Report", icon: "fas fa-file-alt", link: `${base}/reports/order-report`, show: !!base },
            { name: "Low Stock", icon: "fas fa-exclamation-triangle", link: `${base}/reports/low-stock`, show: !!base },
          ],
        });
        groups.push({
          title: "Platform",
          items: [
            { name: "Order Statuses", icon: "fas fa-stream", link: "/statuses", show: true },
            { name: "Sign-up Leads", icon: "fas fa-address-book", link: "/seller/leads", show: true },
            { name: "Delivery & Returns Policy", icon: "fas fa-balance-scale-right", link: "/seller/policy", show: true },
            { name: "Roles & Permissions", icon: "fas fa-shield-alt", link: "/permissions", show: true },
            { name: "My Profile", icon: "fas fa-user-circle", link: "/profile", show: true },
          ],
        });
      } else {
        groups.push({ items: [{ name: "Dashboard", icon: "fas fa-home", link: "/", show: true }] });
        groups.push({
          title: "Orders",
          items: [
            { name: "Orders to ship", icon: "fas fa-box-open", link: "/seller/fulfilment", badge: "toship", show: has(3) },
            { name: "Orders", icon: "fas fa-shopping-bag", link: "/orders", show: has(3) },
            { name: "Customer Chat", icon: "fas fa-comments", link: "/seller/chat", show: has(3) },
          ],
        });
        groups.push({
          title: "Catalog",
          items: [
            { name: "My Products", icon: "fas fa-box", link: `${base}/products`, show: !!base && has(3) },
            { name: "Add Product", icon: "fas fa-plus-circle", link: "/seller/add-product", show: !!base && has(3) },
            { name: "Bulk Upload", icon: "fas fa-upload", link: `${base}/products/bulk-upload`, show: !!base && has(3) },
            { name: "Request New Category", icon: "fas fa-lightbulb", link: "/seller/category-requests", show: has(3) },
            { name: "Low Stock Alerts", icon: "fas fa-exclamation-triangle", link: `${base}/reports/low-stock`, show: !!base && has(3) },
          ],
        });
        groups.push({
          title: "Growth",
          items: [
            { name: "Coupons", icon: "fas fa-ticket-alt", link: `${base}/coupons`, show: !!base && has(3) },
            { name: "Product Performance", icon: "fas fa-chart-line", link: `${base}/reports/product-performance`, show: !!base && has(3) },
          ],
        });
        groups.push({
          title: "Reports",
          items: [
            { name: "Sales Report", icon: "fas fa-file-invoice-dollar", link: `${base}/reports/sales-report`, show: !!base && has(3) },
            { name: "Order Report", icon: "fas fa-file-alt", link: `${base}/reports/order-report`, show: !!base && has(3) },
            { name: "Payment Methods", icon: "fas fa-credit-card", link: `${base}/reports/payment-methods`, show: !!base && has(3) },
            { name: "Top Customers", icon: "fas fa-users", link: `${base}/reports/top-customers`, show: !!base && has(3) },
          ],
        });
        groups.push({
          title: "Account",
          items: [
            { name: "Payments", icon: "fas fa-wallet", link: "/seller/payments", show: has(3) },
            { name: "My Profile", icon: "fas fa-user-circle", link: "/profile", show: true },
          ],
        });
      }

      // drop hidden items, then drop groups that ended up empty
      return groups
        .map((g) => ({ title: g.title, items: g.items.filter((it) => it.show) }))
        .filter((g) => g.items.length);
    },
  },

  mounted() {
    if (this.authenticated) {
      this.loadBadges();
      this.pollAlerts();
      this.pollTimer = setInterval(() => this.pollAlerts(), 40000);
    }

    // global confirm / alert helpers used by many legacy pages
    this.$root.confirm = (message, title = "Confirm") => {
      if (this.$refs.confirmModal) return this.$refs.confirmModal.show({ message, title });
      console.error("ConfirmModal ref not found");
      return Promise.resolve(false);
    };
    this.$root.alert = (message, title = "Alert") => {
      if (this.$refs.confirmModal) return this.$refs.confirmModal.show({ message, title, showCancelButton: false });
      console.error("ConfirmModal ref not found");
      return Promise.resolve(false);
    };
  },
  beforeDestroy() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  },
  methods: {
    /* sellers: new-order alert + "to ship" counter. Super Admin: late pickups counter. Runs every 40 s. */
    async pollAlerts() {
      if (!this.authenticated) return;
      try {
        if (this.isSuper) {
          const r = await this.$axios.get("fulfilment/pickups", { params: { rowsPerPage: 1 } });
          const c = (r.data && r.data.counts) || {};
          this.badges.pickups = (c.awaiting_ready_late || 0) + (c.awaiting_pickup_late || 0);
          return;
        }
        const r = await this.$axios.get("fulfilment/alerts");
        const d = (r.data && r.data.data) || {};
        this.badges.toship = d.to_ship || 0;
        const n = d.new_orders || 0;
        if (n > this.lastNew) {
          this.alertToast = n === 1 ? "Naya order aaya hai!" : n + " naye orders aaye hain!";
          this.beep();
        }
        if (n === 0) this.alertToast = this.$route.path.indexOf("/seller/fulfilment") === 0 ? null : this.alertToast;
        this.lastNew = n;
      } catch (e) {
        /* silent: alerts are a convenience */
      }
    },
    beep() {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.value = 0.08;
        o.start();
        setTimeout(() => { o.stop(); ctx.close(); }, 250);
      } catch (e) {}
    },
    openShip() {
      this.alertToast = null;
      this.$router.push("/seller/fulfilment");
    },
    isNavActive(link) {
      if (!link || link === "#") return false;
      const p = this.$route.path;
      if (link === "/") return p === "/";
      return p === link || p.startsWith(link + "/");
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.updateBodyClass();
    },
    closeSidebar() {
      this.isSidebarOpen = false;
      this.updateBodyClass();
    },
    updateBodyClass() {
      const $ = window.jQuery || window.$ || null;
      if (!$) return;
      if (window.innerWidth < 992) {
        this.isSidebarOpen ? $("body").addClass("sidebar-open") : $("body").removeClass("sidebar-open");
      } else {
        this.isSidebarOpen ? $("body").addClass("sidebar-collapse") : $("body").removeClass("sidebar-collapse");
      }
    },
    /* red counters next to "things waiting for you" (Super Admin only) */
    async loadBadges() {
      if (!this.isSuper) return;
      const get = (url, pick) => this.$axios.get(url).then((r) => pick(r.data)).catch(() => 0);
      const [a, p, c] = await Promise.all([
        get("seller_applications/counts", (d) => d.pending || 0),
        get("seller_products/status_counts", (d) => d.pending || 0),
        get("category_requests", (d) => (d.status_counts && d.status_counts.pending) || 0),
      ]);
      this.badges = { applications: a, approvals: p, catreq: c };
    },
    logout() {
      this.$auth.logout();
    },
  },
};
</script>

<style>
.ck-editor__editable { min-height: 500px; }
</style>
