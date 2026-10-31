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

              <h1 class="m-0 text-dark">Delivery Riders</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Delivery Riders</li>
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
              <div class="d-flex align-items-center mb-3" style="gap: 12px;">
                <div class="flex-grow-1">
                  <input
                type="text"
                class="form-control"
                v-model="searchData"
                @input="search"
                placeholder="Search by name / email / phone"
              />
                </div>
                <button class="btn btn-secondary d-flex align-items-center" @click="getData" style="height: 42px;" type="button">
                  <i class="fas fa-sync-alt mr-1"></i> Refresh
                </button>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Delivery Riders</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    to="/delivery-users/create"
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
                        <th>Role</th>
                        <th>Active Location</th>
                        <th>Is Available</th>
                        <th>Is Occupied</th>
                        <th>Status</th>
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
                            :to="`/delivery-users/${emp.id}`"
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
                          <nuxt-link
                            class="btn btn-primary btn-sm"
                            :to="`/delivery-users/${emp.id}/documents`"
                          >
                            Documents
                          </nuxt-link>
                        </td>
                        <td>
                          <img
                            style="width: 50px; height: 50px"
                            :src="
                              mediaUrl +
                              (emp.attachment ? emp.attachment : '/user.png')
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
                        <td>{{ emp.roles[0].name }}</td>
                        <td>{{ emp.city ? emp.city.name : "" }}</td>
                        <td>{{ emp.active == 1 ? "Enabled" : "Disabled" }}</td>
                        <td>
                          {{
                            emp.is_available == 1
                              ? "Available"
                              : "Not Available"
                          }}
                        </td>
                        <td>
                          {{
                            emp.is_occupied == 1 ? "Occupied" : "Not Occupied"
                          }}
                        </td>
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
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      // let items = await this.$axios.get(`/users?role_id=3&page=1`)
      let items = await this.$axios.get(
        `/users?role_id=5&cityId=${this.city.id}`
      );
      this.items = items.data.data;
      this.loading = false;
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (this.searchData.length >= 3) {
          this.loading = true;
          let items = await this.$axios.get(`/users?search=${this.searchData}`);
          this.items = items.data.data;
          this.loading = false;
        } else if (this.searchData.length === 0) {
          this.getData();
        }
      }, 300);
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(`/users/${id}?role_id=5`);
      }
      this.getData();
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
