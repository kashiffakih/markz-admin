<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Payments</h2>
              <p>Aapki kamai, roke gaye paise aur bank me aaye payouts - sab ek jagah.</p>
            </div>
            <div v-if="isSuper" style="min-width:240px">
              <select class="form-control custom-select" v-model="companyId" @change="reloadAll">
                <option value="">All sellers</option>
                <option v-for="s in sellers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- bank warning -->
          <div v-if="!isSuper && summary.bank && !summary.bank.complete" class="alert alert-warning d-flex align-items-center justify-content-between flex-wrap">
            <span><i class="fas fa-exclamation-triangle mr-2"></i><b>Bank details pending hain.</b> Bank account ke bina payout nahi bhej sakte.</span>
            <button class="btn btn-sm btn-warning" @click="tab = 'bank'">Bank details bharo</button>
          </div>

          <!-- tabs -->
          <div class="pn-seg mb-3" style="max-width:100%;overflow:auto">
            <button v-for="t in tabs" :key="t.v" :class="{ on: tab === t.v }" @click="setTab(t.v)">{{ t.t }}</button>
          </div>

          <!-- ============ OVERVIEW ============ -->
          <div v-if="tab === 'overview'">
            <div class="row">
              <div class="col-xl-4 col-md-6">
                <div class="small-box bg-info">
                  <div class="inner"><h3>{{ money(summary.ready_amount) }}</h3><p>Next payout me jayega ({{ summary.ready_orders || 0 }} orders)</p></div>
                  <div class="icon"><i class="fas fa-hourglass-half"></i></div>
                </div>
              </div>
              <div class="col-xl-4 col-md-6">
                <div class="small-box bg-warning">
                  <div class="inner"><h3>{{ money(summary.in_payout_amount) }}</h3><p>Payout ban gaya, bhejna baaki</p></div>
                  <div class="icon"><i class="fas fa-paper-plane"></i></div>
                </div>
              </div>
              <div class="col-xl-4 col-md-6">
                <div class="small-box bg-success">
                  <div class="inner"><h3>{{ money(summary.paid_amount) }}</h3><p>Bank me aa chuka</p></div>
                  <div class="icon"><i class="fas fa-check-circle"></i></div>
                </div>
              </div>
              <div class="col-xl-4 col-md-6">
                <div class="small-box bg-danger">
                  <div class="inner"><h3>{{ money(summary.hold_amount) }}</h3><p>Return ki wajah se roka gaya ({{ summary.hold_orders || 0 }})</p></div>
                  <div class="icon"><i class="fas fa-undo-alt"></i></div>
                </div>
              </div>
              <div class="col-xl-4 col-md-6">
                <div class="small-box bg-gradient-primary">
                  <div class="inner"><h3>{{ money(summary.awaiting_amount) }}</h3><p>Delivery / payment ka intezaar ({{ summary.awaiting_orders || 0 }})</p></div>
                  <div class="icon"><i class="fas fa-truck"></i></div>
                </div>
              </div>
              <div class="col-xl-4 col-md-6">
                <div class="small-box bg-warning">
                  <div class="inner"><h3>{{ money(summary.commission_paid) }}</h3><p>Ab tak commission kata</p></div>
                  <div class="icon"><i class="fas fa-percentage"></i></div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="card">
                  <div class="card-header"><h3 class="card-title">Last payout</h3></div>
                  <div class="card-body">
                    <div v-if="summary.last_payout">
                      <div style="font-size:28px;font-weight:800">{{ money(summary.last_payout.amount) }}</div>
                      <div class="text-muted">{{ summary.last_payout.payout_number }} &middot; {{ fmt(summary.last_payout.paid_at) }}</div>
                      <div class="mt-2" v-if="summary.last_payout.transaction_id">UTR / Txn: <b>{{ summary.last_payout.transaction_id }}</b></div>
                    </div>
                    <div v-else class="pn-empty" style="padding:18px"><i class="fas fa-money-check-alt"></i>Abhi koi payout nahi hua</div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="card">
                  <div class="card-header"><h3 class="card-title">Payout kaise kaam karta hai</h3></div>
                  <div class="card-body" style="font-size:13.5px;line-height:1.7">
                    <div><span class="pn-pill pn-pill--pending">1</span> Order deliver ho jaye (ya online paid ho) to paisa <b>safe</b> maana jata hai.</div>
                    <div><span class="pn-pill pn-pill--pending">2</span> Customer return maange to us order ka paisa <b>hold</b> par rehta hai.</div>
                    <div><span class="pn-pill pn-pill--pending">3</span> Admin safe orders ka <b>payout</b> banata hai: order amount &minus; commission &minus; platform fee.</div>
                    <div><span class="pn-pill pn-pill--approved">4</span> Payout aapke bank me bhej diya jata hai, UTR number yahan dikhta hai.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============ LEDGER ============ -->
          <div v-if="tab === 'ledger'" class="card">
            <div class="card-header d-flex flex-wrap align-items-center" style="gap:10px">
              <div class="pn-seg" style="max-width:100%;overflow:auto">
                <button v-for="s in statuses" :key="s.v" :class="{ on: lStatus === s.v }" @click="setLStatus(s.v)">{{ s.t }}</button>
              </div>
              <div class="ml-auto d-flex" style="gap:8px">
                <input type="date" class="form-control" style="width:150px" v-model="lFrom" @change="loadLedger(1)" />
                <input type="date" class="form-control" style="width:150px" v-model="lTo" @change="loadLedger(1)" />
              </div>
            </div>
            <div class="card-body p-0 table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Order</th><th>Date</th><th>Customer</th><th>Mode</th>
                    <th class="text-right">Order amt</th><th class="text-right">Commission</th><th class="text-right">Platform fee</th><th class="text-right">You get</th>
                    <th>Status</th><th>Payout</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in ledger" :key="r.order_id">
                    <td><strong>#{{ r.order_id }}</strong></td>
                    <td>{{ fmt(r.date) }}</td>
                    <td>{{ r.customer }}</td>
                    <td>{{ r.payment_mode || "-" }}</td>
                    <td class="text-right">{{ money(r.order_amount) }}</td>
                    <td class="text-right">- {{ money(r.commission) }}</td>
                    <td class="text-right">- {{ money(r.platform_fee) }}</td>
                    <td class="text-right"><b>{{ money(r.net) }}</b></td>
                    <td><span class="pm-st" :class="'st-' + r.status">{{ stText(r.status) }}</span></td>
                    <td>{{ r.payout_number || "-" }}</td>
                  </tr>
                  <tr v-if="!ledger.length && !loading"><td colspan="10"><div class="pn-empty"><i class="fas fa-receipt"></i>Is filter me koi order nahi</div></td></tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center" v-if="lLast > 1">
              <button class="btn btn-sm btn-default" :disabled="lPage <= 1" @click="loadLedger(lPage - 1)">Prev</button>
              <span class="text-muted">Page {{ lPage }} / {{ lLast }} &middot; {{ lTotal }} orders</span>
              <button class="btn btn-sm btn-default" :disabled="lPage >= lLast" @click="loadLedger(lPage + 1)">Next</button>
            </div>
          </div>

          <!-- ============ PAYOUTS ============ -->
          <div v-if="tab === 'payouts'">
            <div class="card">
              <div class="card-body p-0 table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Payout</th><th v-if="isSuper">Seller</th><th>Period</th>
                      <th class="text-right">Order amt</th><th class="text-right">Commission</th><th class="text-right">Fee</th><th class="text-right">Net paid</th>
                      <th>Status</th><th>Paid on</th><th>UTR</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in payouts" :key="p.id">
                      <td><strong>{{ p.payout_number }}</strong></td>
                      <td v-if="isSuper">{{ p.company ? p.company.name : "-" }}</td>
                      <td>{{ fmt(p.period_from) }} &ndash; {{ fmt(p.period_to) }}</td>
                      <td class="text-right">{{ money(p.total_order_amount) }}</td>
                      <td class="text-right">{{ money(p.total_commission) }}</td>
                      <td class="text-right">{{ money(p.total_platform_fee) }}</td>
                      <td class="text-right"><b>{{ money(p.net_payable) }}</b></td>
                      <td><span class="pm-st" :class="p.status === 'completed' ? 'st-paid' : 'st-in_payout'">{{ p.status === "completed" ? "Paid" : "Processing" }}</span></td>
                      <td>{{ p.paid_at ? fmt(p.paid_at) : "-" }}</td>
                      <td>{{ p.transaction_id || "-" }}</td>
                      <td><button class="btn btn-sm btn-outline-primary" @click="openPayout(p)">Orders</button></td>
                    </tr>
                    <tr v-if="!payouts.length && !loading"><td :colspan="isSuper ? 11 : 10"><div class="pn-empty"><i class="fas fa-money-check-alt"></i>Abhi koi payout nahi bana</div></td></tr>
                  </tbody>
                </table>
              </div>
              <div class="card-footer d-flex justify-content-between align-items-center" v-if="pLast > 1">
                <button class="btn btn-sm btn-default" :disabled="pPage <= 1" @click="loadPayouts(pPage - 1)">Prev</button>
                <span class="text-muted">Page {{ pPage }} / {{ pLast }}</span>
                <button class="btn btn-sm btn-default" :disabled="pPage >= pLast" @click="loadPayouts(pPage + 1)">Next</button>
              </div>
            </div>

            <div class="card pn-review" v-if="openedPayout">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h3 class="card-title">{{ openedPayout.payout_number }} &middot; orders</h3>
                <button class="btn btn-sm btn-default" @click="openedPayout = null">Close</button>
              </div>
              <div class="card-body p-0 table-responsive">
                <table class="table">
                  <thead><tr><th>Order</th><th class="text-right">Order amt</th><th class="text-right">Commission</th><th class="text-right">Fee</th><th class="text-right">Net</th></tr></thead>
                  <tbody>
                    <tr v-for="it in openedPayout.seller_payout_items" :key="it.id">
                      <td>#{{ it.order_id }}</td>
                      <td class="text-right">{{ money(it.order_amount) }}</td>
                      <td class="text-right">- {{ money(it.commission_amount) }}</td>
                      <td class="text-right">- {{ money(it.platform_fee) }}</td>
                      <td class="text-right"><b>{{ money(it.net_amount) }}</b></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ============ BANK ============ -->
          <div v-if="tab === 'bank'" class="card">
            <div class="card-header"><h3 class="card-title">Bank account &amp; KYC</h3></div>
            <div class="card-body">
              <div v-if="isSuper && !companyId" class="alert alert-info">Upar se ek seller chuno, tab uski bank details dikhengi.</div>
              <template v-else>
                <div v-if="bankError" class="alert alert-danger">{{ bankError }}</div>
                <div v-if="bankOk" class="alert alert-success">{{ bankOk }}</div>
                <div v-if="summary.bank && summary.bank.complete" class="alert alert-info">
                  Abhi saved account: <b>{{ summary.bank.acc_name }}</b> &middot; {{ summary.bank.acc_no_masked }} &middot; {{ summary.bank.ifsc_code }}.
                  Badalna ho to neeche poora account number dobara daalna hoga (suraksha ke liye).
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3"><label>Account holder name *</label><input class="form-control" v-model.trim="bank.acc_name" /></div>
                  <div class="col-md-6 mb-3"><label>Account number *</label><input class="form-control" v-model.trim="bank.acc_no" inputmode="numeric" maxlength="20" /></div>
                  <div class="col-md-4 mb-3"><label>IFSC code *</label><input class="form-control" v-model.trim="bank.ifsc_code" maxlength="11" style="text-transform:uppercase" /></div>
                  <div class="col-md-4 mb-3"><label>Bank name</label><input class="form-control" v-model.trim="bank.bank" /></div>
                  <div class="col-md-4 mb-3"><label>Branch</label><input class="form-control" v-model.trim="bank.branch" /></div>
                  <div class="col-md-4 mb-3">
                    <label>Account type</label>
                    <select class="form-control custom-select" v-model="bank.acc_type"><option value="">Select</option><option value="savings">Savings</option><option value="current">Current</option></select>
                  </div>
                  <div class="col-md-4 mb-3"><label>GST number <span class="text-muted">(optional)</span></label><input class="form-control" v-model.trim="bank.gst_number" maxlength="15" style="text-transform:uppercase" /></div>
                  <div class="col-md-4 mb-3"><label>PAN number <span class="text-muted">(optional)</span></label><input class="form-control" v-model.trim="bank.pan_number" maxlength="10" style="text-transform:uppercase" /></div>
                </div>
                <button class="btn btn-primary" :disabled="savingBank" @click="saveBank"><i class="fas" :class="savingBank ? 'fa-spinner fa-spin' : 'fa-check'"></i> Save bank details</button>
              </template>
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
  name: "SellerPayments",
  data() {
    return {
      tab: "overview",
      tabs: [
        { v: "overview", t: "Overview" },
        { v: "ledger", t: "Orders ledger" },
        { v: "payouts", t: "Payouts" },
        { v: "bank", t: "Bank & KYC" },
      ],
      companyId: "",
      sellers: [],
      loading: false,
      summary: {},
      ledger: [], lPage: 1, lLast: 1, lTotal: 0, lStatus: "", lFrom: "", lTo: "",
      statuses: [
        { v: "", t: "All" }, { v: "ready", t: "Ready" }, { v: "in_payout", t: "Processing" },
        { v: "paid", t: "Paid" }, { v: "hold", t: "On hold" }, { v: "awaiting", t: "Awaiting" }, { v: "refunded", t: "Refunded" },
      ],
      payouts: [], pPage: 1, pLast: 1, openedPayout: null,
      bank: { acc_name: "", acc_no: "", ifsc_code: "", bank: "", branch: "", acc_type: "", gst_number: "", pan_number: "" },
      savingBank: false, bankError: "", bankOk: "",
    };
  },
  computed: {
    isSuper() {
      const u = this.$auth.user;
      return !!(u && u.roles && u.roles.some((r) => r.id === 1));
    },
  },
  mounted() {
    if (this.isSuper) {
      this.$axios.get("companies", { params: { rowsPerPage: 200 } }).then((r) => (this.sellers = r.data.data || [])).catch(() => {});
    }
    this.reloadAll();
  },
  methods: {
    money(n) {
      return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    },
    fmt(d) {
      return d ? moment(d).format("DD MMM YYYY") : "";
    },
    stText(s) {
      return { ready: "Ready", in_payout: "Processing", paid: "Paid", hold: "On hold", awaiting: "Awaiting", refunded: "Refunded" }[s] || s;
    },
    params(extra) {
      return Object.assign({}, this.companyId ? { company_id: this.companyId } : {}, extra || {});
    },
    msg(e, fb) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fb;
    },
    async reloadAll() {
      this.openedPayout = null;
      await this.loadSummary();
      this.loadLedger(1);
      this.loadPayouts(1);
      this.prefillBank();
    },
    setTab(v) {
      this.tab = v;
    },
    async loadSummary() {
      try {
        const r = await this.$axios.get("seller_payments/summary", { params: this.params() });
        this.summary = r.data.data || {};
      } catch (e) {
        this.summary = {};
      }
    },
    setLStatus(v) {
      this.lStatus = v;
      this.loadLedger(1);
    },
    async loadLedger(page) {
      this.loading = true;
      try {
        const r = await this.$axios.get("seller_payments/ledger", {
          params: this.params({ status: this.lStatus, from: this.lFrom, to: this.lTo, page, rowsPerPage: 20 }),
        });
        this.ledger = r.data.data || [];
        this.lPage = r.data.current_page || 1;
        this.lLast = r.data.last_page || 1;
        this.lTotal = r.data.total || 0;
      } catch (e) {
        this.ledger = [];
      } finally {
        this.loading = false;
      }
    },
    async loadPayouts(page) {
      try {
        const r = await this.$axios.get("seller_payments/payouts", { params: this.params({ page, rowsPerPage: 15 }) });
        this.payouts = r.data.data || [];
        this.pPage = r.data.current_page || 1;
        this.pLast = r.data.last_page || 1;
      } catch (e) {
        this.payouts = [];
      }
    },
    async openPayout(p) {
      try {
        const r = await this.$axios.get(`seller_payments/payouts/${p.id}`, { params: this.params({ company_id: p.company_id }) });
        this.openedPayout = r.data.data;
        if (process.client) this.$nextTick(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
      } catch (e) {
        this.$root.alert(this.msg(e, "Payout khul nahi saka."));
      }
    },
    prefillBank() {
      const b = this.summary && this.summary.bank;
      this.bank = {
        acc_name: (b && b.acc_name) || "", acc_no: "", ifsc_code: (b && b.ifsc_code) || "", bank: (b && b.bank) || "",
        branch: (b && b.branch) || "", acc_type: (b && b.acc_type) || "", gst_number: (b && b.gst_number) || "", pan_number: (b && b.pan_number) || "",
      };
    },
    async saveBank() {
      this.bankError = "";
      this.bankOk = "";
      this.savingBank = true;
      try {
        const body = Object.assign({}, this.bank, this.companyId ? { company_id: this.companyId } : {});
        Object.keys(body).forEach((k) => {
          if (body[k] === "" && ["bank", "branch", "acc_type", "gst_number", "pan_number"].indexOf(k) === -1) return;
        });
        await this.$axios.put("seller_payments/bank", body);
        this.bankOk = "Bank details save ho gayi.";
        await this.loadSummary();
        this.prefillBank();
      } catch (e) {
        this.bankError = this.msg(e, "Save nahi ho saka.");
      } finally {
        this.savingBank = false;
      }
    },
  },
};
</script>

<style scoped>
.pm-st { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.st-ready { background: #e8f0fd; color: #2f6fdb; }
.st-in_payout { background: #fdf1da; color: #9a6205; }
.st-paid { background: #e1f5ea; color: #12794a; }
.st-hold, .st-refunded { background: #fdecec; color: #b02a2a; }
.st-awaiting { background: #eef2ef; color: #6b7a72; }
</style>
