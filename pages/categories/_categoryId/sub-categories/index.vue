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
                  :link="`/categories`"
                >
                </back-button>
                {{ category.name }} / Sub Categories</h1>
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
                  <h3 class="card-title">Manage Sub Categories</h3> &nbsp;
                  <nuxt-link class="btn btn-sm btn-info float-sm-right" :to="`/categories/${category.id}/sub-categories/create`">Add New</nuxt-link>
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
                      <tr v-for="(sub_category, i) in category.sub_categories"
                        :key="`sub_category${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link title="Edit Details" class="icon" :to="`/categories/${category.id}/sub-categories/${sub_category.id}`">
                            <i class="fa fa-edit"></i>
                          </nuxt-link>&nbsp;&nbsp;
                          <!-- <nuxt-link title="Delete Inspector" class="icon" to="">
                            <span @click="del(sub_category.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link> -->
                          <nuxt-link class="btn btn-sm btn-info" :to="`/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories`">Sub 2 Categories</nuxt-link>
                        </td>
                        <td>
                          <img style="width: 50px; height: 50px;" :src="sub_category.imagepath ? (mediaUrl + sub_category.imagepath) : '/product-vector.png'">
                        </td>
                        <td>{{ sub_category.name }}</td>
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
  name: 'ManageSubCategories',
  // async asyncData({$axios, params}) {
  //   let category = await $axios.get(`/categories/${params.categoryId}`)
  //   return {
  //     category: category.data.data
  //   }
  // },
  data:() =>  ({
    searchData: '',
    category: {},
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