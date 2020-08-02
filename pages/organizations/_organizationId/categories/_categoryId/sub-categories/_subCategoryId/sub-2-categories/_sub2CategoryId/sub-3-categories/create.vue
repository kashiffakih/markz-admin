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
                  :link="`/organizations/${organization.value}/categories/${category.id}/sub-categories/${sub_category.id}/sub-2-categories/${sub_2_category.id}/sub-3-categories`"
                >
                </back-button>
                {{ category.name }} / {{ sub_category.name }} / {{ sub_2_category.name }} / Sub 3 Categories</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/categories`">Categories</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Create</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <!-- left column -->
            <div class="col-md-6">
              <!-- jquery validation -->
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Create Sub 3 Category of {{ category.name }}</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Sub 3 Category</label>
                    <input type="text" class="form-control" placeholder="Enter sub 3 category"
                      v-model="form.name"
                    >
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Photo</label>
                    <br>
                    <input type="file" id="file" name="file" ref="file" accept="application/ms-excel" multiple>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Create Sub 3 Category' }}</button>
                  </div>
                </div>
              </div>
              <!-- /.card -->
              </div>
            <!--/.col (left) -->
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
  name: 'CreateSub2Category',
  async asyncData({$axios, params}) {
    let category = await $axios.get(`/categories/${params.categoryId}`)
    let sub_category = await $axios.get(`/categories/${params.categoryId}/sub_categories/${params.subCategoryId}`)
    let sub_2_category = await $axios.get(`/sub_categories/${params.subCategoryId}/sub_2_categories/${params.sub2CategoryId}`)
    return {
      category: category.data.data,
      sub_category: sub_category.data.data,
      sub_2_category: sub_2_category.data.data
    }
  },
  data: () => ({
    form: {
      divide_by: 1
    },
    sub3categoryid: '',
    loading: false
  }),
  mounted() {
  },
  components: {
    BackButton,
  },
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/sub_2_categories/${this.sub_2_category.id}/sub_3_categories`, this.form)
        this.sub3categoryid = admin.data.data.id
        await this.handleFileUpload()
        this.$router.push(`/organizations/${this.organization.value}/categories/${this.category.id}/sub-categories/${this.sub_category.id}/sub-2-categories/${this.sub_2_category.id}/sub-3-categories`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
    async handleFileUpload() {
      this.attachment = this.$refs.file.files[0]
      let formData = new FormData();
      formData.append('sub3categoryid', this.sub2categoryid);
      formData.append('attachment', this.attachment);
      await this.$axios.post('upload_sub_3_category_photo', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(response => {
      })
      .catch(function(){
        console.log('FAILURE!!');
      });
    },
  }
}
</script>