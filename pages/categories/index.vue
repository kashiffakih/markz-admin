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

              <h1 class="m-0 text-dark">Categories</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Categories</li>
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
                placeholder="Search by category"
              />
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Categories</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/categories/create`"
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
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr
                        v-for="(category, i) in paginatedItems"
                        :key="`category${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/categories/${category.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link title="Delete Category" class="icon" to="">
                            <span @click="del(category.id)">
                              <i class="fa fa-trash text-danger"></i>
                            </span> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            class="btn btn-sm btn-info"
                            :to="`/categories/${category.id}/sub-categories`"
                            >Sub Categories</nuxt-link
                          >
                        </td>
                        <td>
                          <img
                            style="width: 50px; height: 50px"
                            :src="
                              category.imagepath
                                ? mediaUrl + category.imagepath
                                : '/product-vector.png'
                            "
                          />
                          <br />
                          {{ category.emp_code }}
                        </td>
                        <td>{{ category.name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
                <Pagination
                  v-if="items.length > 0"
                  :total-items="items.length"
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
  name: "Managecategories",
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
  }),
  mounted() {
    this.getData();
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
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
    async getData() {
      this.items = [];
      this.loading = true;
      let items = await this.$axios.get(`/categories`);
      this.items = items.data.data;
      this.loading = false;
    },
    async search() {
      if (this.searchData != "") {
        this.loading = true;
        let items = await this.$axios.get(
          `/categories?search=${this.searchData}`
        );
        this.items = items.data.data;
        this.loading = false;
      }
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        try {
          await this.$axios.delete(`/categories/${id}`);
          await this.$root.alert("Category deleted successfully");
        } catch (error) {
          console.error("Error deleting category:", error);
          const message =
            error.response?.data?.message ||
            "An error occurred while deleting the category";
          await this.$root.alert(message);
        }
        this.getData();
      }
    },
  },
};
</script>
