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

              <h1 class="m-0 text-dark">
                {{ category.name }} / {{ sub_category.name }} / Sub 2 Categories
              </h1>
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
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Sub 2 Categories</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories/create`"
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
                        v-for="(sub_2_category, i) in paginatedItems"
                        :key="`sub_2_category${i}`"
                      >
                        <td>{{ (currentPage - 1) * perPage + i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories/${sub_2_category.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <a
                            title="Delete Sub 2 Category"
                            class="icon"
                            href="#"
                            @click="del(sub_2_category.id)"
                          >
                            <i class="fa fa-trash"></i>
                          </a>
                          <!-- <nuxt-link
                            class="btn btn-sm btn-info"
                            :to="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories/${sub_2_category.id}/sub-3-categories`"
                            >Sub 3 Categories</nuxt-link
                          > -->
                        </td>
                        <td>
                          <img
                            style="width: 50px; height: 50px"
                            :src="
                              sub_2_category.imagepath
                                ? mediaUrl + sub_2_category.imagepath
                                : '/product-vector.png'
                            "
                          />
                        </td>
                        <td>{{ sub_2_category.name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
                <Pagination
                  v-if="
                    sub_category.sub_2_categories &&
                    sub_category.sub_2_categories.length > 0
                  "
                  :total-items="sub_category.sub_2_categories.length"
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
  name: "ManageSub2Categories",
  components: {
    BackButton,
    Pagination,
  },
  // async asyncData({$axios, params}) {
  //   let category = await $axios.get(`/categories/${params.categoryId}`)
  //   return {
  //     category: category.data.data
  //   }
  // },
  data: () => ({
    category: {},
    sub_category: {},
    loading: true,
    currentPage: 1,
    perPage: 10,
  }),
  mounted() {
    this.getData();
  },

  computed: {
    paginatedItems() {
      if (!this.sub_category.sub_2_categories) return [];
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.sub_category.sub_2_categories.slice(start, end);
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
      this.category = {};
      this.loading = true;
      let category = await this.$axios.get(
        `/categories/${this.$route.params.categoryId}`
      );
      this.category = category.data.data;
      let sub_category = await this.$axios.get(
        `/categories/${this.$route.params.categoryId}/sub_categories/${this.$route.params.subCategoryId}`
      );
      this.sub_category = sub_category.data.data;
      this.loading = false;
    },

    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(
          `/sub_categories/${this.sub_category.id}/sub_2_categories/${id}`
        );
      }
      this.getData();
    },
  },
};
</script>
