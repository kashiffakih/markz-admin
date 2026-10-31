<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Seller Payouts</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Payouts</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- Summary Cards -->
          <div class="row" v-if="summary">
            <div class="col-lg-4 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>₹{{ summary.total_unsettled || '0.00' }}</h3>
                  <p>Total Unsettled</p>
                </div>
                <div class="icon"><i class="fas fa-hand-holding-usd"></i></div>
              </div>
            </div>
            <div class="col-lg-4 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>{{ summary.sellers_with_pending || 0 }}</h3>
                  <p>Sellers with Pending Payouts</p>
                </div>
                <div class="icon"><i class="fas fa-users"></i></div>
              </div>
            </div>
            <div class="col-lg-4 col-6">
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>{{ summary.unsettled_orders || 0 }}</h3>
                  <p>Unsettled Orders</p>
                </div>
                <div class="icon"><i class="fas fa-file-invoice"></i></div>
              </div>
            </div>
          </div>

          <!-- Payouts Table -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fas fa-money-bill-wave mr-2"></i>Payout History</h3>
              <div class="card-tools">
                <button class="btn btn-sm btn-primary" @click="showGenerateModal = true">
                  <i class="fas fa-plus mr-1"></i> Generate Payout
                </button>
              </div>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Payout #</th>
                    <th>Seller</th>
                    <th>Period</th>
                    <th class="text-right">Gross Amount</th>
                    <th class="text-right">Commission</th>
                    <th class="text-right">Net Payable</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payout in payouts" :key="payout.id">
                    <td><strong>{{ payout.payout_number }}</strong></td>
                    <td>{{ payout.company ? payout.company.name : 'N/A' }}</td>
                    <td>{{ payout.period_from }} — {{ payout.period_to }}</td>
                    <td class="text-right">₹{{ payout.total_order_amount }}</td>
                    <td class="text-right text-danger">₹{{ payout.total_commission }}</td>
                    <td class="text-right text-success font-weight-bold">₹{{ payout.net_payable }}</td>
                    <td>
                      <span class="badge" :class="payoutStatusBadge(payout.status)">
                        {{ payout.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(payout.created_at) }}</td>
                    <td>
                      <button v-if="payout.status === 'pending'"
                        class="btn btn-xs btn-success" @click="markPaid(payout)">
                        <i class="fas fa-check"></i> Mark Paid
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!payouts.length">
                    <td colspan="9" class="text-center py-4 text-muted">
                      <i class="fas fa-money-bill-wave fa-2x mb-2 d-block"></i>
                      No payouts generated yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Generate Payout Modal -->
          <v-dialog v-model="showGenerateModal" max-width="500">
            <v-card>
              <v-card-title class="headline">Generate New Payout</v-card-title>
              <v-card-text>
                <div class="form-group">
                  <label>Select Seller</label>
                  <select class="form-control" v-model="newPayout.company_id">
                    <option value="">-- Select --</option>
                    <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
                      {{ seller.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Period From</label>
                  <input type="date" class="form-control" v-model="newPayout.period_from" />
                </div>
                <div class="form-group">
                  <label>Period To</label>
                  <input type="date" class="form-control" v-model="newPayout.period_to" />
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="showGenerateModal = false">Cancel</v-btn>
                <v-btn color="primary" @click="generatePayout" :loading="generating">Generate</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </div>
      </section>
    </div>
  </section>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import moment from "moment";

export default {
  name: "SellerPayouts",
  components: { BackButton },
  data() {
    return {
      payouts: [],
      sellers: [],
      summary: {},
      showGenerateModal: false,
      generating: false,
      newPayout: {
        company_id: "",
        period_from: moment().startOf("month").format("YYYY-MM-DD"),
        period_to: moment().endOf("month").format("YYYY-MM-DD"),
      },
    };
  },
  mounted() {
    this.fetchPayouts();
    this.fetchSummary();
    this.fetchSellers();
  },
  methods: {
    async fetchPayouts() {
      try {
        const res = await this.$axios.get("seller_payouts", { params: { rowsPerPage: 50 } });
        this.payouts = res.data.data || [];
      } catch (e) { console.error(e); }
    },
    async fetchSummary() {
      try {
        const res = await this.$axios.get("seller_payouts/unsettled_summary");
        this.summary = res.data.data || {};
      } catch (e) { console.error(e); }
    },
    async fetchSellers() {
      try {
        const res = await this.$axios.get("companies", { params: { rowsPerPage: 100 } });
        this.sellers = res.data.data || [];
      } catch (e) { console.error(e); }
    },
    async generatePayout() {
      if (!this.newPayout.company_id) {
        alert("Please select a seller");
        return;
      }
      this.generating = true;
      try {
        await this.$axios.post("seller_payouts", this.newPayout);
        this.showGenerateModal = false;
        this.fetchPayouts();
        this.fetchSummary();
      } catch (e) {
        alert(e.response ? e.response.data.message : "Error generating payout");
      } finally {
        this.generating = false;
      }
    },
    async markPaid(payout) {
      if (!confirm(`Mark payout ${payout.payout_number} as paid?`)) return;
      try {
        const txn = prompt("Transaction / UTR number (optional):", "") || null;
        await this.$axios.post(`seller_payouts/${payout.id}/mark_paid`, {
          payment_mode: "bank_transfer",
          transaction_id: txn,
        });
        this.fetchPayouts();
        this.fetchSummary();
      } catch (e) {
        alert(e.response ? e.response.data.message : "Error");
      }
    },
    payoutStatusBadge(status) {
      if (status === "completed") return "badge-success";
      if (status === "processing") return "badge-info";
      return "badge-warning";
    },
    formatDate(date) {
      return moment(date).format("DD MMM YYYY");
    },
  },
};
</script>
