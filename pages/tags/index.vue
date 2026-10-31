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

              <h1 class="m-0 text-dark">Tags</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Tags</li>
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
                placeholder="Search by tag name"
              />
                </div>
                <button class="btn btn-secondary d-flex align-items-center" @click="getData" style="height: 42px;" type="button">
                  <i class="fas fa-sync-alt mr-1"></i> Refresh
                </button>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Tags</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/tags/create`"
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
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(tag, i) in items" :key="`tag${i}`">
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/tags/${tag.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <a
                            title="Delete Tag"
                            class="icon"
                            href="#"
                            @click="del(tag.id)"
                          >
                            <i class="fa fa-trash"></i>
                          </a>
                        </td>
                        <td>
                          <img
                            style="width: 50px; height: 50px"
                            :src="
                              tag.imagepath
                                ? mediaUrl + tag.imagepath
                                : '/product-vector.png'
                            "
                          />
                        </td>
                        <td>{{ tag.name }}</td>
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
  name: "Managetags",
  components: {
    BackButton,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    page: 1,
    rowsPerPage: 10,
    searchTimeout: null,
  }),
  mounted() {
    this.getData();
  },
  methods: {
    async getData(page = 1) {
      this.items = [];
      this.loading = true;
      this.page = page;
      let items = await this.$axios.get(
        `/tags?page=${this.page}&rowsPerPage=${this.rowsPerPage}`
      );
      this.items = items.data.data;
      this.loading = false;
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (this.searchData.length >= 3) {
          this.loading = true;
          let items = await this.$axios.get(`/tags?search=${this.searchData}`);
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
        try {
          await this.$axios.delete(`/tags/${id}`);
          await this.$root.alert("Tag deleted successfully");
        } catch (error) {
          console.error("Error deleting tag:", error);
          const message =
            error.response?.data?.message ||
            "An error occurred while deleting the tag";
          await this.$root.alert(message);
        }
        this.getData();
      }
    },
  },
};
</script>
