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

              <h1 class="m-0 text-dark">Customers</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Customers</li>
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
                    <div class="col-12 col-md-9 mb-2 mb-md-0">
                      <input
                        type="text"
                        class="form-control"
                        v-model="searchData"
                        @input="search"
                        placeholder="Search by name / email / phone"
                        style="height: 44px;"
                      />
                    </div>

                    <!-- Refresh Button -->
                    <div class="col-12 col-md-3 text-center text-md-right">
                      <a class="btn btn-secondary w-100 d-inline-flex align-items-center justify-content-center" href="#" @click.prevent="getData" style="height: 44px;">
                        <i class="fas fa-sync mr-1"></i> Refresh
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Customers</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    to="/customers/create"
                    >Add New</nuxt-link
                  >
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <th @click="sort('emp_code')">
                          Photo / ID
                          <i
                            v-if="currentSortDir == 'asc'"
                            class="fas fa-arrow-up"
                          ></i>
                          <i
                            v-if="currentSortDir == 'desc'"
                            class="fas fa-arrow-down"
                          ></i>
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(emp, i) in paginatedItems" :key="`emp${i}`">
                        <td>{{ (Number(currentPage) - 1) * Number(perPage || 10) + i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="View Rewards"
                            class="icon"
                            :to="`/customers/${emp.id}/rewards`"
                          >
                            <i class="fa fa-gift"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            title="View Addresses"
                            class="icon"
                            :to="`/customers/${emp.id}/addresses`"
                          >
                            <i class="fa fa-map-marker"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <a
                            title="Delete Customer"
                            class="icon text-danger cursor-pointer"
                            href="#"
                            @click.prevent="del(emp.id)"
                          >
                            <i class="fa fa-trash"></i>
                          </a>
                        </td>
                        <td>
                          <img
                            v-if="emp.imagepath"
                            style="width: 50px; height: 50px"
                            :src="
                              mediaUrl +
                              (emp.imagepath ? emp.imagepath : 'user.png')
                            "
                          />
                          <span v-else>No Profile</span>
                          <br />
                          {{ emp.emp_code }}
                        </td>
                        <td>
                          {{ emp.first_name || "" }}
                          {{ emp.middle_name || "" }} {{ emp.last_name || "" }}
                        </td>
                        <td>{{ emp.email }}</td>
                        <td>{{ emp.phone_code }} {{ emp.phone }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
                <Pagination
                  v-if="totalItems > 0 || items.length > 0"
                  :total-items="isServerPaginated ? totalItems : items.length"
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
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
import Pagination from "@/components/Pagination.vue";
export default {
  name: "ManageUsers",
  components: {
    BackButton,
    Pagination,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    currentSort: "name",
    currentSortDir: "asc",
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    isServerPaginated: false,
    searchTimeout: null,
  }),
  mounted() {
    this.getData();
  },
  computed: {
    sorteditems: function () {
      return this.items.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === "desc") modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
    paginatedItems() {
      if (this.isServerPaginated) return this.items;
      const start = (Number(this.currentPage) - 1) * Number(this.perPage);
      const end = start + Number(this.perPage);
      return this.sorteditems.slice(start, end);
    },
  },
  methods: {
    onPageChanged(page) {
      this.currentPage = Number(page);
      if (this.isServerPaginated) this.getData();
    },
    onPerPageChanged(perPage) {
      this.perPage = Number(perPage);
      this.currentPage = 1;
      if (this.isServerPaginated) this.getData();
    },
    async getData() {
      this.items = [];
      this.loading = true;
      let params = {
        role_id: 6,
        page: this.currentPage,
        rowsPerPage: this.perPage,
      };
      if (this.searchData) params.search = this.searchData;
      let response = await this.$axios.get(`/users`, { params });
      if (response.data.total !== undefined) {
        this.isServerPaginated = true;
        this.items = response.data.data;
        this.totalItems = response.data.total;
      } else {
        this.isServerPaginated = false;
        this.items = response.data.data;
        this.totalItems = response.data.data.length;
      }
      this.loading = false;
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        this.currentPage = 1;
        this.getData();
      }, 300);
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete this customer?")
      ) {
        try {
          await this.$axios.delete(`/users/${id}?role_id=6`);
          this.getData();
        } catch (error) {
          console.error("Delete customer error:", error);
          await this.$root.alert("Failed to delete customer.");
        }
      }
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
  },
};
</script>
