<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">
                <back-button
                  :link="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories`"
                >
                </back-button>{{ category.name }} / {{ sub_category.name }} / Sub 3 Categories</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Categories</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <br>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Sub 2 Categories</h3> &nbsp;
                  <nuxt-link class="btn btn-sm btn-info float-sm-right" :to="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories/${sub_2_category.id}/sub-3-categories/create`">Add New</nuxt-link>
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
                      <tr
                        v-if="loading"
                      > 
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(sub_3_category, i) in sub_2_category.sub_3_categories"
                        :key="`sub_3_category${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link title="Edit Details" class="icon" :to="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories/${sub_2_category.id}/sub-3-categories/${sub_3_category.id}`">
                            <i class="fa fa-edit"></i>
                          </nuxt-link>&nbsp;&nbsp;
                          <nuxt-link title="Delete Inspector" class="icon" to="">
                            <span @click="del(sub_3_category.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>
                          <img style="width: 50px; height: 50px;" :src="sub_3_category.imagepath ? (mediaUrl + sub_3_category.imagepath) : '/product-vector.png'">
                        </td>
                        <td>{{ sub_3_category.name }}</td>
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
import BackButton from '@/components/back-button.vue'

export default {
  name: 'ManageSub3Categories',
  data:() =>  ({
    searchData: '',
    category: {},
    sub_category: {},
    sub_2_category: {},
    loading: true,
  }),
  mounted() {
    this.getData()
  },
  components: {
    BackButton,
  },
  methods: {
    async getData() {
      this.category = {}
      this.loading = true
      let category = await this.$axios.get(`/categories/${this.$route.params.categoryId}`)
      this.category = category.data.data
      let sub_category = await this.$axios.get(`/categories/${this.$route.params.categoryId}/sub_categories/${this.$route.params.subCategoryId}`)
      this.sub_category = sub_category.data.data
      let sub_2_category = await this.$axios.get(`/sub_categories/${this.$route.params.subCategoryId}/sub_2_categories/${this.$route.params.sub2CategoryId}`)
      this.sub_2_category = sub_2_category.data.data
      this.loading = false
    },
    async search() {
      if(this.searchData != "")
      {
        this.loading = true
        let items = await this.$axios.get(`/categories?search=${this.searchData}`);
        this.items = items.data.data
        this.loading = false
      }
    },
    async del(id) {
      let r = confirm('Are you sure you want to delete the data?')
      if(r == true)
        await this.$axios.delete(`/categories/${this.category.id}/sub_categories/${id}`)
      this.getData()
    },
  },
}
</script>