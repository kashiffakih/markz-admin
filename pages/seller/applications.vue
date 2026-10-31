<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Seller Applications</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Applications</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-3 col-6">
              <div class="small-box bg-info" style="cursor:pointer" @click="setStatus('')">
                <div class="inner"><h3>{{ counts.total || 0 }}</h3><p>Total Applications</p></div>
                <div class="icon"><i class="fas fa-file-alt"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning" style="cursor:pointer" @click="setStatus('pending')">
                <div class="inner"><h3>{{ counts.pending || 0 }}</h3><p>Pending Review</p></div>
                <div class="icon"><i class="fas fa-clock"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success" style="cursor:pointer" @click="setStatus('approved')">
                <div class="inner"><h3>{{ counts.approved || 0 }}</h3><p>Approved</p></div>
                <div class="icon"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-danger" style="cursor:pointer" @click="setStatus('rejected')">
                <div class="inner"><h3>{{ counts.rejected || 0 }}</h3><p>Rejected</p></div>
                <div class="icon"><i class="fas fa-times-circle"></i></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body py-2">
              <div class="row">
                <div class="col-md-4">
                  <input type="text" v-model="search" class="form-control form-control-sm" placeholder="Search shop, owner, email, phone..." @input="debounceSearch" />
                </div>
                <div class="col-md-3">
                  <select v-model="status" class="form-control form-control-sm" @change="fetchList(1)">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title"><i class="fas fa-user-plus mr-2"></i>Applications</h3></div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th><th>Shop</th><th>Owner</th><th>Contact</th><th>City</th>
                    <th>GST</th><th>Status</th><th>Applied</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading"><td colspan="9" class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</td></tr>
                  <tr v-else-if="items.length === 0"><td colspan="9" class="text-center py-4 text-muted">No applications found</td></tr>
                  <tr v-for="a in items" :key="a.id" :class="{ 'table-warning': a.registration_status === 'pending' }">
                    <td>{{ a.id }}</td>
                    <td><strong>{{ a.name }}</strong></td>
                    <td>{{ a.owner_name }}</td>
                    <td>{{ a.email }}<br><small class="text-muted">{{ a.phone }}</small></td>
                    <td>{{ a.city ? a.city.name : '-' }}</td>
                    <td>{{ a.gst_number || '-' }}</td>
                    <td><span class="badge" :class="badge(a.registration_status)">{{ a.registration_status }}</span></td>
                    <td>{{ formatDate(a.applied_at) }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-info btn-sm" title="View" @click="view(a)"><i class="fas fa-eye"></i></button>
                        <button v-if="a.registration_status !== 'approved'" class="btn btn-success btn-sm" title="Approve" @click="openApprove(a)"><i class="fas fa-check"></i></button>
                        <button v-if="a.registration_status !== 'rejected'" class="btn btn-danger btn-sm" title="Reject" @click="openReject(a)"><i class="fas fa-times"></i></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer" v-if="pagination.last_page > 1">
              <ul class="pagination pagination-sm m-0 float-right">
                <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
                  <a class="page-link" href="#" @click.prevent="fetchList(pagination.current_page - 1)">«</a>
                </li>
                <li class="page-item" v-for="p in pages" :key="p" :class="{ active: p === pagination.current_page }">
                  <a class="page-link" href="#" @click.prevent="fetchList(p)">{{ p }}</a>
                </li>
                <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
                  <a class="page-link" href="#" @click.prevent="fetchList(pagination.current_page + 1)">»</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Detail -->
    <v-dialog v-model="showDetail" max-width="650">
      <v-card>
        <v-card-title class="headline">Application Details</v-card-title>
        <v-card-text v-if="selected">
          <table class="table table-bordered table-sm">
            <tr><th width="32%">Shop</th><td>{{ selected.name }}</td></tr>
            <tr><th>Owner</th><td>{{ selected.owner_name }}</td></tr>
            <tr><th>Email / Phone</th><td>{{ selected.email }} / {{ selected.phone }}</td></tr>
            <tr><th>Business Type</th><td>{{ selected.business_type || '-' }}</td></tr>
            <tr><th>Store Type</th><td>{{ selected.category ? selected.category.name : '-' }}</td></tr>
            <tr><th>Address</th><td>{{ [selected.add_1, selected.add_2, selected.add_3, selected.state].filter(Boolean).join(', ') || '-' }}, {{ selected.city ? selected.city.name : '' }} {{ selected.pincode }}</td></tr>
            <tr><th>GST</th><td>{{ selected.gst_number || '-' }}</td></tr>
            <tr><th>PAN</th><td>{{ selected.pan_number || '-' }}</td></tr>
            <tr><th>Kahan bech sakta hai</th><td><span class="badge" :class="selected.sell_scope === 'state' ? 'badge-warning' : 'badge-success'">{{ selected.sell_scope === 'state' ? 'Sirf apne state me (' + (selected.state || '-') + ')' : 'Poore India me' }}</span></td></tr>
            <tr><th>Bank</th><td>{{ selected.bank || '-' }} {{ selected.branch || '' }}<br>A/c: {{ selected.acc_name || '-' }} / {{ selected.acc_no || '-' }}<br>IFSC: {{ selected.ifsc_code || '-' }}</td></tr>
            <tr><th>Status</th><td><span class="badge" :class="badge(selected.registration_status)">{{ selected.registration_status }}</span></td></tr>
            <tr v-if="selected.rejection_reason"><th>Rejection Reason</th><td class="text-danger">{{ selected.rejection_reason }}</td></tr>
            <tr><th>Applied</th><td>{{ formatDate(selected.applied_at) }}</td></tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showDetail = false">Close</v-btn>
          <v-btn v-if="selected && selected.registration_status !== 'approved'" color="success" @click="showDetail = false; openApprove(selected)">Approve</v-btn>
          <v-btn v-if="selected && selected.registration_status !== 'rejected'" color="error" @click="showDetail = false; openReject(selected)">Reject</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Approve (with commission) -->
    <v-dialog v-model="showApprove" max-width="420">
      <v-card>
        <v-card-title class="headline">Approve Seller</v-card-title>
        <v-card-text v-if="target">
          <p><strong>{{ target.name }}</strong> approve hone par seller login kar paayega.</p>
          <v-select v-model="commissionType" :items="[{text:'Percentage', value:'Percent'},{text:'Fixed Amount', value:'Flat'}]" label="Commission Type" outline></v-select>
          <v-select v-model="sellScope" :items="[{text:'Poore India me (GST number hai)', value:'india'},{text:'Sirf apne state me (GST nahi hai)', value:'state'}]" label="Kahan bech sakta hai" outline></v-select>
          <v-text-field v-model="commissionValue" :label="commissionType === 'Percent' ? 'Commission (%)' : 'Commission (₹)'" type="number" step="0.01" outline></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showApprove = false">Cancel</v-btn>
          <v-btn color="success" :loading="busy" @click="confirmApprove">Approve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject -->
    <v-dialog v-model="showReject" max-width="450">
      <v-card>
        <v-card-title class="headline">Reject Application</v-card-title>
        <v-card-text>
          <v-textarea v-model="reason" label="Rejection reason (seller ko dikhega)" rows="3" outline></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showReject = false">Cancel</v-btn>
          <v-btn color="error" :loading="busy" @click="confirmReject">Reject</v-btn>
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
      items: [], loading: false, busy: false,
      counts: { total: 0, pending: 0, approved: 0, rejected: 0 },
      pagination: { current_page: 1, last_page: 1 },
      search: "", status: "pending", timer: null,
      selected: null, target: null,
      showDetail: false, showApprove: false, showReject: false,
      commissionType: "Percent", commissionValue: 10, sellScope: "india", reason: "",
    };
  },
  computed: {
    pages() {
      const start = Math.max(1, this.pagination.current_page - 2);
      const end = Math.min(this.pagination.last_page, start + 4);
      const r = [];
      for (let i = start; i <= end; i++) r.push(i);
      return r;
    },
  },
  mounted() {
    this.fetchList(1);
    this.fetchCounts();
  },
  methods: {
    async fetchList(page) {
      if (page < 1 || page > this.pagination.last_page) return;
      this.loading = true;
      try {
        const params = { page: page || 1 };
        if (this.status) params.status = this.status;
        if (this.search) params.search = this.search;
        const res = await this.$axios.get("seller_applications", { params });
        this.items = res.data.data || [];
        this.pagination = { current_page: res.data.current_page || 1, last_page: res.data.last_page || 1 };
      } catch (e) {
        this.items = [];
      }
      this.loading = false;
    },
    async fetchCounts() {
      try {
        const res = await this.$axios.get("seller_applications/counts");
        this.counts = res.data;
      } catch (e) {}
    },
    setStatus(s) { this.status = s; this.pagination.last_page = 1; this.fetchList(1); },
    debounceSearch() { clearTimeout(this.timer); this.timer = setTimeout(() => this.fetchList(1), 400); },
    view(a) { this.selected = a; this.showDetail = true; },
    openApprove(a) { this.target = a; this.commissionType = String(a.comission_type || "").toLowerCase().indexOf("flat") === 0 || a.comission_type === "fixed" ? "Flat" : "Percent"; this.commissionValue = a.comission_value || 10; this.sellScope = a.sell_scope === "state" ? "state" : "india"; this.showApprove = true; },
    openReject(a) { this.target = a; this.reason = ""; this.showReject = true; },
    async confirmApprove() {
      this.busy = true;
      try {
        await this.$axios.post(`seller_applications/${this.target.id}/approve`, {
          comission_type: this.commissionType, comission_value: this.commissionValue, sell_scope: this.sellScope,
        });
        this.$toast.success("Seller approved");
        this.showApprove = false;
        this.fetchList(this.pagination.current_page); this.fetchCounts();
      } catch (e) { this.$toast.error("Approve failed"); }
      this.busy = false;
    },
    async confirmReject() {
      if (!this.reason.trim()) { this.$toast.error("Reason likho"); return; }
      this.busy = true;
      try {
        await this.$axios.post(`seller_applications/${this.target.id}/reject`, { rejection_reason: this.reason });
        this.$toast.success("Application rejected");
        this.showReject = false;
        this.fetchList(this.pagination.current_page); this.fetchCounts();
      } catch (e) { this.$toast.error("Reject failed"); }
      this.busy = false;
    },
    badge(s) { return { pending: "badge-warning", approved: "badge-success", rejected: "badge-danger" }[s] || "badge-secondary"; },
    formatDate(d) { return d ? moment(d).format("DD MMM YYYY, hh:mm A") : "-"; },
  },
};
</script>

<style scoped>
.small-box .icon i { font-size: 50px; opacity: 0.3; }
.badge { text-transform: capitalize; font-size: 12px; padding: 4px 8px; }
</style>
