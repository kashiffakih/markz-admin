<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Resellers</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Resellers</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning"><div class="inner"><h3>{{ counts.pending || 0 }}</h3><p>Pending Approval</p></div><div class="icon"><i class="fas fa-user-clock"></i></div></div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success"><div class="inner"><h3>{{ counts.approved || 0 }}</h3><p>Active Resellers</p></div><div class="icon"><i class="fas fa-user-check"></i></div></div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-info"><div class="inner"><h3>{{ counts.withdrawals_requested || 0 }}</h3><p>Withdrawal Requests</p></div><div class="icon"><i class="fas fa-money-check-alt"></i></div></div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-primary"><div class="inner"><h3>₹{{ counts.wallet_liability || 0 }}</h3><p>Wallet Liability</p></div><div class="icon"><i class="fas fa-wallet"></i></div></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header p-2">
              <ul class="nav nav-pills">
                <li class="nav-item"><a class="nav-link" :class="{ active: tab === 'resellers' }" href="#" @click.prevent="tab = 'resellers'">Resellers</a></li>
                <li class="nav-item"><a class="nav-link" :class="{ active: tab === 'withdrawals' }" href="#" @click.prevent="tab = 'withdrawals'">Withdrawals</a></li>
              </ul>
              <div class="card-tools" style="margin-top:4px">
                <button class="btn btn-sm btn-outline-secondary mr-2" @click="settleNow" :disabled="settling">
                  <i class="fas fa-sync mr-1"></i> Settle matured margins
                </button>
              </div>
            </div>

            <!-- Resellers -->
            <div v-if="tab === 'resellers'">
              <div class="card-body pb-0">
                <div class="form-inline">
                  <select v-model="status" class="form-control form-control-sm mr-2" @change="fetchResellers">
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <input v-model="search" class="form-control form-control-sm" placeholder="Search name / phone" @keyup.enter="fetchResellers" />
                </div>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr><th>Business</th><th>Phone</th><th>Status</th><th class="text-right">Wallet</th><th class="text-right">Pending</th><th class="text-right">Earned</th><th class="text-right">Withdrawn</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in resellers" :key="r.id">
                      <td>{{ r.business_name }}<br /><small class="text-muted" v-if="r.user">{{ r.user.email }}</small></td>
                      <td>{{ r.phone }}</td>
                      <td><span class="badge" :class="badge(r.status)">{{ r.status }}</span>
                        <div v-if="r.rejection_reason" class="small text-muted">{{ r.rejection_reason }}</div></td>
                      <td class="text-right">₹{{ r.wallet_balance }}</td>
                      <td class="text-right">₹{{ r.pending_balance }}</td>
                      <td class="text-right">₹{{ r.total_earned }}</td>
                      <td class="text-right">₹{{ r.total_withdrawn }}</td>
                      <td>
                        <button v-if="r.status !== 'approved'" class="btn btn-xs btn-success mr-1" @click="approve(r)">Approve</button>
                        <button v-if="r.status === 'pending'" class="btn btn-xs btn-danger mr-1" @click="reject(r)">Reject</button>
                        <button v-if="r.status === 'approved'" class="btn btn-xs btn-warning" @click="suspend(r)">Suspend</button>
                      </td>
                    </tr>
                    <tr v-if="!resellers.length"><td colspan="8" class="text-center text-muted p-4">Koi reseller nahi mila</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Withdrawals -->
            <div v-else>
              <div class="card-body pb-0">
                <select v-model="wStatus" class="form-control form-control-sm" style="max-width:200px" @change="fetchWithdrawals">
                  <option value="">All</option>
                  <option value="requested">Requested</option>
                  <option value="paid">Paid</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr><th>#</th><th>Reseller</th><th>Payout details</th><th class="text-right">Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="w in withdrawals" :key="w.id">
                      <td>{{ w.id }}</td>
                      <td>{{ w.reseller ? w.reseller.business_name : '-' }}</td>
                      <td class="small">
                        <span v-if="w.reseller && w.reseller.upi_id">UPI: {{ w.reseller.upi_id }}</span>
                        <span v-if="w.reseller && w.reseller.acc_no"><br />{{ w.reseller.acc_name }} · {{ w.reseller.acc_no }} · {{ w.reseller.ifsc_code }}</span>
                      </td>
                      <td class="text-right">₹{{ w.amount }}</td>
                      <td><span class="badge" :class="badge(w.status)">{{ w.status }}</span>
                        <div class="small text-muted" v-if="w.transaction_id">{{ w.transaction_id }}</div>
                        <div class="small text-muted" v-if="w.remarks">{{ w.remarks }}</div></td>
                      <td>{{ fmt(w.created_at) }}</td>
                      <td>
                        <template v-if="w.status === 'requested'">
                          <button class="btn btn-xs btn-success mr-1" @click="markPaid(w)">Mark Paid</button>
                          <button class="btn btn-xs btn-danger" @click="rejectW(w)">Reject</button>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="!withdrawals.length"><td colspan="7" class="text-center text-muted p-4">Koi withdrawal nahi</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import moment from "moment";

export default {
  name: "AdminResellers",
  components: { BackButton },
  data() {
    return {
      tab: "resellers",
      counts: {},
      resellers: [],
      withdrawals: [],
      status: "",
      wStatus: "requested",
      search: "",
      settling: false,
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.fetchCounts();
      this.fetchResellers();
      this.fetchWithdrawals();
    },
    msg(e) {
      return e.response && e.response.data && e.response.data.message ? e.response.data.message : "Error";
    },
    fmt(d) {
      return d ? moment(d).format("DD MMM YYYY") : "";
    },
    badge(s) {
      return { approved: "badge-success", paid: "badge-success", pending: "badge-warning", requested: "badge-warning", rejected: "badge-danger", suspended: "badge-secondary" }[s] || "badge-light";
    },
    async fetchCounts() {
      try { this.counts = (await this.$axios.get("resellers/counts")).data; } catch (e) { console.error(e); }
    },
    async fetchResellers() {
      try {
        const res = await this.$axios.get("resellers", { params: { status: this.status || undefined, search: this.search || undefined } });
        this.resellers = res.data.data || [];
      } catch (e) { console.error(e); }
    },
    async fetchWithdrawals() {
      try {
        const res = await this.$axios.get("resellers/withdrawals", { params: { status: this.wStatus || undefined } });
        this.withdrawals = res.data.data || [];
      } catch (e) { console.error(e); }
    },
    async approve(r) {
      if (!confirm(`Approve ${r.business_name}?`)) return;
      try { await this.$axios.post(`resellers/${r.id}/approve`); this.refresh(); } catch (e) { alert(this.msg(e)); }
    },
    async reject(r) {
      const reason = prompt("Reject karne ka reason:", "");
      if (!reason) return;
      try { await this.$axios.post(`resellers/${r.id}/reject`, { rejection_reason: reason }); this.refresh(); } catch (e) { alert(this.msg(e)); }
    },
    async suspend(r) {
      const reason = prompt("Suspend reason (optional):", "") || null;
      try { await this.$axios.post(`resellers/${r.id}/suspend`, { reason }); this.refresh(); } catch (e) { alert(this.msg(e)); }
    },
    async markPaid(w) {
      const mode = prompt("Payment mode (bank_transfer / upi / manual):", "upi");
      if (!mode) return;
      const txn = prompt("Transaction / UTR number (optional):", "") || null;
      try { await this.$axios.post(`resellers/withdrawals/${w.id}/mark_paid`, { payment_mode: mode, transaction_id: txn }); this.refresh(); } catch (e) { alert(this.msg(e)); }
    },
    async rejectW(w) {
      const remarks = prompt("Reject reason (amount wallet me wapas jayega):", "");
      if (!remarks) return;
      try { await this.$axios.post(`resellers/withdrawals/${w.id}/reject`, { remarks }); this.refresh(); } catch (e) { alert(this.msg(e)); }
    },
    async settleNow() {
      this.settling = true;
      try {
        const res = await this.$axios.post("resellers/settle");
        alert(res.data.message);
        this.refresh();
      } catch (e) { alert(this.msg(e)); } finally { this.settling = false; }
    },
  },
};
</script>
