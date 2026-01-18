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

              <h1 class="m-0 text-dark">Offers</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Offers</li>
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
                placeholder="Search by offer name"
              />
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Offers</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/offers/create`"
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
                        <th>Image</th>
                        <th>Desc 1</th>
                        <th>Desc 2</th>
                        <th>Desc 3</th>
                        <th>Url</th>
                        <th>Button Text</th>
                        <th>Available On</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(offer, i) in items" :key="`offer${i}`">
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/offers/${offer.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            title="Delete Inspector"
                            class="icon"
                            to=""
                          >
                            <span @click="del(offer.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>
                          <a
                            target="_blank"
                            :href="
                              offer.imagepath ? mediaUrl + offer.imagepath : ''
                            "
                            >{{ offer.imagepath }}</a
                          >
                        </td>
                        <td>{{ offer.desc_1 }}</td>
                        <td>{{ offer.desc_2 }}</td>
                        <td>{{ offer.desc_3 }}</td>
                        <td>{{ offer.url }}</td>
                        <td>{{ offer.button_text }}</td>
                        <td>{{ offer.available_on }}</td>
                        <td>{{ offer.start_date }}</td>
                        <td>{{ offer.end_date }}</td>
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
  name: "Manageoffers",
  components: {
    BackButton,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
  }),
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      let items = await this.$axios.get(`/offers`);
      this.items = items.data.data;
      this.loading = false;
    },
    async search() {
      if (this.searchData != "") {
        this.loading = true;
        let items = await this.$axios.get(`/offers?search=${this.searchData}`);
        this.items = items.data.data;
        this.loading = false;
      }
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(`/offers/${id}`);
      }
      this.getData();
    },
  },
};
</script>
