<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Returns & Refunds</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Returns & Refunds</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- Summary Cards -->
          <div class="row">
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>{{ statusCounts.requested || 0 }}</h3>
                  <p>Pending Returns</p>
                </div>
                <div class="icon"><i class="fas fa-clock"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>{{ statusCounts.approved || 0 }}</h3>
                  <p>Approved</p>
                </div>
                <div class="icon"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>{{ statusCounts.refunded || 0 }}</h3>
                  <p>Refunded</p>
                </div>
                <div class="icon"><i class="fas fa-money-bill-wave"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-danger">
                <div class="inner">
                  <h3>{{ statusCounts.rejected || 0 }}</h3>
                  <p>Rejected</p>
                </div>
                <div class="icon"><i class="fas fa-times-circle"></i></div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Seller</label>
                    <select v-model="filters.seller_id" class="form-control" @change="fetchReturns">
                      <option value="">All Sellers</option>
                      <option v-for="s in sellers" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Status</label>
                    <select v-model="filters.status" class="form-control" @change="fetchReturns">
                      <option value="">All Status</option>
                      <option value="requested">Requested</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="refunded">Refunded</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>From Date</label>
                    <input type="date" v-model="filters.from_date" class="form-control" @change="fetchReturns" />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>To Date</label>
                    <input type="date" v-model="filters.to_date" class="form-control" @change="fetchReturns" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Returns Table -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fas fa-undo-alt mr-2"></i>Return Requests</h3>
              <div class="card-tools">
                <button class="btn btn-sm btn-primary" @click="showCreateModal = true">
                  <i class="fas fa-plus mr-1"></i> Create Return
                </button>
              </div>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Return #</th>
                    <th>Order #</th>
                    <th>Seller</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Reason</th>
                    <th class="text-right">Refund Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="10" class="text-center py-4">
                      <i class="fas fa-spinner fa-spin mr-2"></i>Loading...
                    </td>
                  </tr>
                  <tr v-else-if="returns.length === 0">
                    <td colspan="10" class="text-center py-4 text-muted">No return requests found</td>
                  </tr>
                  <tr v-for="item in returns" :key="item.id">
                    <td><strong>{{ item.return_number }}</strong></td>
                    <td>{{ item.order ? '#' + item.order.id : '-' }}</td>
                    <td>{{ item.company ? item.company.name : '-' }}</td>
                    <td>{{ item.user ? (item.user.first_name + ' ' + (item.user.last_name || '')) : '-' }}</td>
                    <td>{{ productName(item) }}</td>
                    <td>
                      <span :title="item.reason">{{ truncate(item.reason, 30) }}</span>
                    </td>
                    <td class="text-right">₹{{ parseFloat(item.refund_amount || 0).toFixed(2) }}</td>
                    <td>
                      <span class="badge" :class="statusBadge(item.status)">{{ item.status }}</span>
                    </td>
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-info btn-sm" @click="viewReturn(item)" title="View Details">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button v-if="item.status === 'requested'" class="btn btn-success btn-sm" @click="approveReturn(item)" title="Approve">
                          <i class="fas fa-check"></i>
                        </button>
                        <button v-if="item.status === 'requested'" class="btn btn-danger btn-sm" @click="rejectReturn(item)" title="Reject">
                          <i class="fas fa-times"></i>
                        </button>
                        <button v-if="item.status === 'approved'" class="btn btn-primary btn-sm" @click="processRefund(item)" title="Process Refund">
                          <i class="fas fa-money-bill-wave"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer" v-if="pagination.last_page > 1">
              <nav>
                <ul class="pagination pagination-sm m-0 float-right">
                  <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">«</a>
                  </li>
                  <li class="page-item" v-for="p in pagination.last_page" :key="p" :class="{ active: p === pagination.current_page }">
                    <a class="page-link" href="#" @click.prevent="changePage(p)">{{ p }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
                    <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">»</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- View Return Detail Modal -->
    <v-dialog v-model="showDetailModal" max-width="600">
      <v-card>
        <v-card-title class="headline">Return Details</v-card-title>
        <v-card-text v-if="selectedReturn">
          <table class="table table-bordered table-sm">
            <tr><th width="35%">Return #</th><td>{{ selectedReturn.return_number }}</td></tr>
            <tr><th>Order #</th><td>{{ selectedReturn.order ? '#' + selectedReturn.order.id : '-' }}</td></tr>
            <tr><th>Seller</th><td>{{ selectedReturn.company ? selectedReturn.company.name : '-' }}</td></tr>
            <tr><th>Customer</th><td>{{ selectedReturn.user ? (selectedReturn.user.first_name + ' ' + (selectedReturn.user.last_name || '')) : '-' }}</td></tr>
            <tr><th>Product</th><td>{{ productName(selectedReturn) }}</td></tr>
            <tr><th>Reason</th><td>{{ selectedReturn.reason }}</td></tr>
            <tr><th>Refund Amount</th><td>₹{{ parseFloat(selectedReturn.refund_amount || 0).toFixed(2) }}</td></tr>
            <tr>
              <th>Galti kiski</th>
              <td>
                <span class="badge" :class="faultBadge(selectedReturn.fault)">{{ faultText(selectedReturn.fault) }}</span>
                <div class="mt-1" v-if="selectedReturn.status !== 'refunded' && selectedReturn.status !== 'rejected'">
                  <button v-for="f in ['seller', 'customer', 'platform']" :key="f" class="btn btn-xs btn-outline-secondary mr-1" :disabled="selectedReturn.fault === f || actionLoading" @click="setFault(selectedReturn, f)">{{ faultText(f) }}</button>
                </div>
              </td>
            </tr>
            <tr v-if="parseFloat(selectedReturn.seller_debit || 0) > 0"><th>Seller se katega</th><td>₹{{ parseFloat(selectedReturn.seller_debit).toFixed(2) }} (return shipping)</td></tr>
            <tr v-if="parseFloat(selectedReturn.customer_fee || 0) > 0"><th>Customer ke refund se kata</th><td>₹{{ parseFloat(selectedReturn.customer_fee).toFixed(2) }} (delivery + return fee)</td></tr>
            <tr><th>Status</th><td><span class="badge" :class="statusBadge(selectedReturn.status)">{{ selectedReturn.status }}</span></td></tr>
            <tr v-if="selectedReturn.rejection_reason"><th>Rejection Reason</th><td class="text-danger">{{ selectedReturn.rejection_reason }}</td></tr>
            <tr v-if="selectedReturn.admin_remarks"><th>Admin Notes</th><td>{{ selectedReturn.admin_remarks }}</td></tr>
            <tr><th>Requested On</th><td>{{ formatDate(selectedReturn.created_at) }}</td></tr>
            <tr v-if="selectedReturn.refunded_at"><th>Refunded On</th><td>{{ formatDate(selectedReturn.refunded_at) }}</td></tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showDetailModal = false">Close</v-btn>
          <v-btn v-if="selectedReturn && selectedReturn.status === 'requested'" color="success" @click="approveReturn(selectedReturn); showDetailModal = false">Approve</v-btn>
          <v-btn v-if="selectedReturn && selectedReturn.status === 'requested'" color="error" @click="rejectReturn(selectedReturn); showDetailModal = false">Reject</v-btn>
          <v-btn v-if="selectedReturn && selectedReturn.status === 'approved'" color="primary" @click="processRefund(selectedReturn); showDetailModal = false">Process Refund</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject Reason Modal -->
    <v-dialog v-model="showRejectModal" max-width="450">
      <v-card>
        <v-card-title class="headline">Reject Return</v-card-title>
        <v-card-text>
          <p>Are you sure you want to reject this return request?</p>
          <v-textarea v-model="rejectNotes" label="Rejection Reason (seller/customer ko dikhega)" rows="3" outline></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showRejectModal = false">Cancel</v-btn>
          <v-btn color="error" :loading="actionLoading" @click="confirmReject">Reject</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Return Modal -->
    <v-dialog v-model="showCreateModal" max-width="480">
      <v-card>
        <v-card-title class="headline">Create Return Request</v-card-title>
        <v-card-text>
          <v-text-field v-model="newReturn.order_id" label="Order ID" outline type="number"></v-text-field>
          <v-text-field v-model="newReturn.reason" label="Return Reason" outline></v-text-field>
          <v-textarea v-model="newReturn.description" label="Details (optional)" rows="2" outline></v-textarea>
          <v-select v-model="newReturn.refund_mode" :items="[{text:'Wallet', value:'wallet'},{text:'Original payment', value:'original'}]" label="Refund Mode" outline></v-select>
          <v-text-field v-model="newReturn.refund_amount" label="Refund Amount (₹) - blank = full order amount" outline type="number" step="0.01"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showCreateModal = false">Cancel</v-btn>
          <v-btn color="primary" :loading="actionLoading" @click="createReturn">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import moment from "moment";
import BackButton from "~/components/BackButton";

export default {
  components: { BackButton },
  data() {
    return {
      returns: [],
      sellers: [],
      loading: false,
      actionLoading: false,
      filters: {
        seller_id: "",
        status: "",
        from_date: "",
        to_date: "",
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
      },
      statusCounts: {
        requested: 0,
        approved: 0,
        rejected: 0,
        refunded: 0,
      },
      showDetailModal: false,
      showRejectModal: false,
      showCreateModal: false,
      selectedReturn: null,
      rejectNotes: "",
      newReturn: { order_id: null, reason: "", description: "", refund_mode: "wallet", refund_amount: null },
    };
  },
  mounted() {
    this.fetchSellers();
    this.fetchReturns();
  },
  methods: {
    async fetchSellers() {
      try {
        const res = await this.$axios.get("companies");
        this.sellers = res.data.companies || res.data.data || res.data || [];
      } catch (e) {
        this.sellers = [];
      }
    },
    async fetchReturns(page) {
      this.loading = true;
      try {
        let params = { page: page || 1 };
        if (this.filters.seller_id) params.company_id = this.filters.seller_id;
        if (this.filters.status) params.status = this.filters.status;
        if (this.filters.from_date) params.from_date = this.filters.from_date;
        if (this.filters.to_date) params.to_date = this.filters.to_date;

        const res = await this.$axios.get("seller_returns", { params });
        const data = res.data;
        this.returns = data.data || data.returns || [];
        this.pagination = {
          current_page: data.current_page || 1,
          last_page: data.last_page || 1,
          total: data.total || 0,
        };
        const sc = data.status_counts || {};
        this.statusCounts = {
          requested: sc.requested || 0,
          approved: (sc.approved || 0) + (sc.pickup_scheduled || 0) + (sc.picked_up || 0) + (sc.received || 0),
          rejected: sc.rejected || 0,
          refunded: sc.refunded || 0,
        };
      } catch (e) {
        this.returns = [];
      }
      this.loading = false;
    },
    changePage(p) {
      if (p < 1 || p > this.pagination.last_page) return;
      this.fetchReturns(p);
    },
    viewReturn(item) {
      this.selectedReturn = item;
      this.showDetailModal = true;
    },
    async approveReturn(item) {
      if (!confirm("Approve this return request?")) return;
      this.actionLoading = true;
      try {
        await this.$axios.post(`seller_returns/${item.id}/approve`);
        this.$toast.success("Return approved successfully");
        this.fetchReturns(this.pagination.current_page);
      } catch (e) {
        this.$toast.error("Failed to approve return");
      }
      this.actionLoading = false;
    },
    rejectReturn(item) {
      this.selectedReturn = item;
      this.rejectNotes = "";
      this.showRejectModal = true;
    },
    async confirmReject() {
      this.actionLoading = true;
      try {
        await this.$axios.post(`seller_returns/${this.selectedReturn.id}/reject`, {
          rejection_reason: this.rejectNotes || "Rejected by admin",
        });
        this.$toast.success("Return rejected");
        this.showRejectModal = false;
        this.fetchReturns(this.pagination.current_page);
      } catch (e) {
        this.$toast.error("Failed to reject return");
      }
      this.actionLoading = false;
    },
    faultText(f) {
      return { seller: "Seller", customer: "Customer", platform: "Courier / Markz" }[f] || "-";
    },
    faultBadge(f) {
      return { seller: "badge-danger", customer: "badge-info", platform: "badge-warning" }[f] || "badge-secondary";
    },
    async setFault(item, fault) {
      this.actionLoading = true;
      try {
        const r = await this.$axios.post(`seller_returns/${item.id}/fault`, { fault });
        this.selectedReturn = Object.assign({}, this.selectedReturn, r.data.data);
        this.$toast.success("Fault update ho gaya, refund naye hisaab se");
        this.fetchReturns(this.pagination.current_page);
      } catch (e) {
        this.$toast.error("Fault change nahi hua");
      }
      this.actionLoading = false;
    },
    async processRefund(item) {
      if (!confirm("Process refund of ₹" + parseFloat(item.refund_amount || 0).toFixed(2) + " for this return?")) return;
      this.actionLoading = true;
      try {
        await this.$axios.post(`seller_returns/${item.id}/process_refund`);
        this.$toast.success("Refund processed successfully");
        this.fetchReturns(this.pagination.current_page);
      } catch (e) {
        this.$toast.error("Failed to process refund");
      }
      this.actionLoading = false;
    },
    async createReturn() {
      if (!this.newReturn.order_id || !this.newReturn.reason) {
        this.$toast.error("Order ID aur reason zaroori hai");
        return;
      }
      this.actionLoading = true;
      try {
        await this.$axios.post("seller_returns", this.newReturn);
        this.$toast.success("Return request created");
        this.showCreateModal = false;
        this.newReturn = { order_id: null, reason: "", description: "", refund_mode: "wallet", refund_amount: null };
        this.fetchReturns(1);
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || "Failed to create return");
      }
      this.actionLoading = false;
    },
    statusBadge(status) {
      const map = {
        requested: "badge-warning",
        pickup_scheduled: "badge-info",
        picked_up: "badge-info",
        received: "badge-primary",
        approved: "badge-info",
        rejected: "badge-danger",
        refunded: "badge-success",
        completed: "badge-primary",
      };
      return map[status] || "badge-secondary";
    },
    formatDate(d) {
      return d ? moment(d).format("DD MMM YYYY") : "-";
    },
    productName(r) {
      const d = r && r.order && r.order.order_details && r.order.order_details[0];
      return d && d.product ? d.product.name : "-";
    },
    truncate(str, len) {
      if (!str) return "-";
      return str.length > len ? str.substring(0, len) + "..." : str;
    },
  },
};
</script>

<style scoped>
.small-box .icon i {
  font-size: 50px;
  opacity: 0.3;
}
.badge {
  text-transform: capitalize;
  font-size: 12px;
  padding: 4px 8px;
}
</style>
