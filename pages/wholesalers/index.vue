<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Wholesalers</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Wholesalers</li>
              </ol>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-body p-3">
                  <div class="row align-items-center">
                    <!-- Search Input -->
                    <div class="col-12 col-md-4 mb-2 mb-md-0">
                      <input
                        type="text"
                        class="form-control"
                        v-model="searchData"
                        @input="search"
                        placeholder="Search by name / email / phone / business name"
                        style="height: 44px;"
                      />
                    </div>

                    <!-- Filter Tabs -->
                    <div class="col-12 col-md-6 mb-2 mb-md-0">
                      <div class="btn-group d-flex flex-wrap w-100" role="group" style="gap: 4px;">
                        <button
                          type="button"
                          :class="`btn btn-sm flex-grow-1 ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`"
                          @click="setFilter('all')"
                          style="height: 44px;"
                        >
                          All ({{ counts.all }})
                        </button>
                        <button
                          type="button"
                          :class="`btn btn-sm flex-grow-1 ${filter === 'pending' ? 'btn-warning text-white' : 'btn-secondary'}`"
                          @click="setFilter('pending')"
                          style="height: 44px;"
                        >
                          Pending ({{ counts.pending }})
                        </button>
                        <button
                          type="button"
                          :class="`btn btn-sm flex-grow-1 ${filter === 'approved' ? 'btn-success' : 'btn-secondary'}`"
                          @click="setFilter('approved')"
                          style="height: 44px;"
                        >
                          Approved ({{ counts.approved }})
                        </button>
                        <button
                          type="button"
                          :class="`btn btn-sm flex-grow-1 ${filter === 'blocked' ? 'btn-danger' : 'btn-secondary'}`"
                          @click="setFilter('blocked')"
                          style="height: 44px;"
                        >
                          Blocked ({{ counts.blocked }})
                        </button>
                      </div>
                    </div>

                    <!-- Refresh Button -->
                    <div class="col-12 col-md-2 text-center text-md-right">
                      <a class="btn btn-secondary w-100 d-inline-flex align-items-center justify-content-center" href="#" @click.prevent="getData" style="height: 44px;">
                        <i class="fas fa-sync mr-1"></i> Refresh
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Wholesalers</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <th>Status</th>
                        <th>Business Name</th>
                        <th>Trade Name</th>
                        <th>GST Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="10">Loading...</td>
                      </tr>
                      <tr
                        v-for="(wholesaler, i) in paginatedItems"
                        :key="`wholesaler${i}`"
                      >
                        <td>{{ (currentPage - 1) * perPage + i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="View Details"
                            class="btn btn-sm btn-info"
                            :to="`/wholesalers/${wholesaler.id}`"
                          >
                            <i class="fa fa-eye"></i>
                          </nuxt-link>
                          &nbsp;
                          <button
                            v-if="
                              !wholesaler.is_approved && !wholesaler.is_rejected
                            "
                            title="Reject Wholesaler"
                            class="btn btn-sm btn-outline-danger"
                            @click="reject(wholesaler.id)"
                          >
                            <i class="fa fa-times"></i>
                          </button>
                          &nbsp;
                          <button
                            v-if="!wholesaler.is_approved"
                            title="Approve Wholesaler"
                            class="btn btn-sm btn-success"
                            @click="approve(wholesaler.id)"
                          >
                            <i class="fa fa-check"></i>
                          </button>
                          &nbsp;
                          <button
                            v-if="!wholesaler.is_blocked"
                            title="Block Wholesaler"
                            class="btn btn-sm btn-danger"
                            @click="block(wholesaler.id)"
                          >
                            <i class="fa fa-ban"></i>
                          </button>
                          <button
                            v-else
                            title="Unblock Wholesaler"
                            class="btn btn-sm btn-warning"
                            @click="unblock(wholesaler.id)"
                          >
                            <i class="fa fa-unlock"></i>
                          </button>
                        </td>
                        <td>
                          <span
                            v-if="wholesaler.is_blocked"
                            class="badge badge-danger"
                            >Blocked</span
                          >
                          <span
                            v-else-if="wholesaler.is_rejected"
                            class="badge badge-danger"
                            >Rejected</span
                          >
                          <span
                            v-else-if="wholesaler.is_approved"
                            class="badge badge-success"
                            >Approved</span
                          >
                          <span v-else class="badge badge-warning"
                            >Pending</span
                          >
                        </td>
                        <td>{{ wholesaler.business_name || "-" }}</td>
                        <td>{{ wholesaler.trade_name || "-" }}</td>
                        <td>{{ wholesaler.gst_number || "-" }}</td>
                        <td>{{ wholesaler.first_name || "" }}</td>
                        <td>{{ wholesaler.email }}</td>
                        <td>{{ wholesaler.phone }}</td>
                        <td>
                          {{
                            wholesaler.registration_date ||
                            formatDate(wholesaler.created_at)
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
                <Pagination
                  v-if="filteredItems.length > 0"
                  :total-items="filteredItems.length"
                  :per-page="perPage"
                  :current-page="currentPage"
                  @page-changed="onPageChanged"
                  @per-page-changed="onPerPageChanged"
                />
              </div>
              <!-- /.card -->
            </div>
          </div>
          <!-- /.row -->
        </div>
      </section>
      <!-- /.content -->

      <!-- Reason Modal -->
      <div
        class="modal fade"
        id="reasonModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="reasonModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="reasonModalLabel">
                {{
                  reasonAction === "block"
                    ? "Block Wholesaler"
                    : "Reject Wholesaler"
                }}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>
                  {{
                    reasonAction === "block"
                      ? "Reason for Blocking"
                      : "Reason for Rejection"
                  }}
                </label>
                <textarea
                  v-model="reasonText"
                  class="form-control"
                  rows="3"
                  placeholder="Enter reason here..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="confirmReasonAction"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "ManageWholesalers",
  components: {
    BackButton,
    Pagination,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    currentPage: 1,
    perPage: 10,
    filter: "all",
    reasonText: "",
    reasonAction: "", // 'block' or 'reject'
    reasonId: null,
    searchTimeout: null,
  }),
  mounted() {
    this.getData();
  },
  computed: {
    counts() {
      return {
        all: this.items.length,
        pending: this.items.filter((w) => !w.is_approved && !w.is_blocked)
          .length,
        approved: this.items.filter((w) => w.is_approved && !w.is_blocked)
          .length,
        blocked: this.items.filter((w) => w.is_blocked).length,
      };
    },
    filteredItems() {
      let result = this.items;

      if (this.filter === "pending") {
        result = this.items.filter((w) => !w.is_approved && !w.is_blocked);
      } else if (this.filter === "approved") {
        result = this.items.filter((w) => w.is_approved && !w.is_blocked);
      } else if (this.filter === "blocked") {
        result = this.items.filter((w) => w.is_blocked);
      }

      return result;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
  },
  methods: {
    onPageChanged(page) {
      this.currentPage = page;
    },
    onPerPageChanged(perPage) {
      this.perPage = perPage;
      this.currentPage = 1;
    },
    setFilter(filter) {
      this.filter = filter;
      this.currentPage = 1;
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    async getData() {
      this.items = [];
      this.loading = true;
      // role_id=3 is for Distributors/Wholesalers
      let items = await this.$axios.get(`/users?role_id=3`);
      this.items = items.data.data;
      this.loading = false;
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (this.searchData.length >= 3) {
          this.loading = true;
          let items = await this.$axios.get(
            `/users?role_id=3&search=${this.searchData}`
          );
          this.items = items.data.data;
          this.loading = false;
        } else if (this.searchData.length === 0) {
          this.getData();
        }
      }, 300);
    },
    async approve(id) {
      console.log("Approve clicked for", id);
      try {
        const confirmed = await this.$root.confirm(
          "Are you sure you want to approve this wholesaler?"
        );
        console.log("Confirmation result:", confirmed);

        if (confirmed) {
          console.log("Sending approval request...");
          await this.$axios.post(`/users/${id}/approve`);
          console.log("Approval successful");
          this.getData();

          // Optionally show success message
          // await this.$root.alert("Wholesaler approved successfully", "Success");
        }
      } catch (error) {
        console.error("Approval error:", error);
        const msg =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Failed to approve wholesaler";
        await this.$root.alert(msg);
      }
    },
    async block(id) {
      this.reasonId = id;
      this.reasonAction = "block";
      this.reasonText = "";
      if (typeof $ !== "undefined") {
        $("#reasonModal").modal("show");
      }
    },
    async unblock(id) {
      if (
        await this.$root.confirm(
          "Are you sure you want to unblock this wholesaler?"
        )
      ) {
        try {
          await this.$axios.post(`/users/${id}/unblock`);
          this.getData();
        } catch (error) {
          await this.$root.alert("Failed to unblock wholesaler");
        }
      }
    },
    async reject(id) {
      this.reasonId = id;
      this.reasonAction = "reject";
      this.reasonText = "";
      if (typeof $ !== "undefined") {
        $("#reasonModal").modal("show");
      }
    },
    async confirmReasonAction() {
      if (!this.reasonText) {
        await this.$root.alert("Please enter a reason.");
        return;
      }

      if (typeof $ !== "undefined") {
        $("#reasonModal").modal("hide");
      }

      try {
        if (this.reasonAction === "block") {
          await this.$axios.post(`/users/${this.reasonId}/block`, {
            blocked_reason: this.reasonText,
          });
        } else if (this.reasonAction === "reject") {
          await this.$axios.post(`/users/${this.reasonId}/reject`, {
            rejection_reason: this.reasonText,
          });
        }
        this.getData();
      } catch (error) {
        await this.$root.alert(`Failed to ${this.reasonAction} wholesaler`);
      }
    },
  },
};
</script>

<style scoped>
.btn-group .btn {
  margin-right: 0;
}
</style>
