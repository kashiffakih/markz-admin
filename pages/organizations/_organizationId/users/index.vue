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

              <h1 class="m-0 text-dark">Users</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Users</li>
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
              <input
                type="text"
                class="form-control"
                v-model="searchData"
                @keydown.enter="search"
                placeholder="Search by name / email / phone"
              />
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Users</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/organizations/${organization.value}/users/create`"
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
                        <th>City</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(emp, i) in sorteditems" :key="`emp${i}`">
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/organizations/${organization.value}/users/${emp.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            title="Delete Inspector"
                            class="icon"
                            to=""
                          >
                            <span @click="del(emp.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>
                          <img
                            style="width: 50px; height: 50px"
                            :src="
                              mediaUrl +
                              (emp.attachment ? emp.attachment : 'user.png')
                            "
                          />
                          <br />
                          {{ emp.emp_code }}
                        </td>
                        <td>
                          {{ emp.first_name || "" }}
                          {{ emp.middle_name || "" }} {{ emp.last_name || "" }}
                        </td>
                        <td>{{ emp.email }}</td>
                        <td>{{ emp.phone_code }} {{ emp.phone }}</td>
                        <td>{{ emp.city ? emp.city.name : "" }}</td>
                        <td>{{ emp.roles[0].name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
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
export default {
  name: "ManageUsers",
  components: {
    BackButton,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    currentSort: "name",
    currentSortDir: "asc",
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
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      // let items = await this.$axios.get(`/users?role_id=3&page=1`)
      let items = await this.$axios.get(`/users?search=all`);
      this.items = items.data.data;
      this.loading = false;
    },
    async search() {
      if (this.searchData != "") {
        this.loading = true;
        let items = await this.$axios.get(`/users?search=${this.searchData}`);
        console.log(items);
        this.items = items.data.data;
        this.loading = false;
      }
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(`/users/${id}`);
        this.getData();
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
