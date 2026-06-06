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

              <h1 class="m-0 text-dark">Locations</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Locations</li>
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
                @input="search"
                placeholder="Search by city name"
              />
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Locations</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/cities/create`"
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
                        <th>Description 1</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(city, i) in items" :key="`city${i}`">
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/cities/${city.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <!-- <nuxt-link title="Delete Inspector" class="icon" to="">
                            <span @click="del(city.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link> -->
                        </td>
                        <td>{{ city.name }}</td>
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
  name: "Managecities",
  components: {
    BackButton,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    searchTimeout: null,
  }),
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      let items = await this.$axios.get(`/cities`);
      this.items = items.data.data;
      this.loading = false;
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (this.searchData.length >= 3) {
          this.loading = true;
          let items = await this.$axios.get(`/cities?search=${this.searchData}`);
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
        await this.$axios.delete(`/cities/${id}`);
      }
      this.getData();
    },
  },
};
</script>
