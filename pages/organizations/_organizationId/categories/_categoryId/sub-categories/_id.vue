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
                  :link="`/organizations/${organization.value}/categories`"
                >
                </back-button>
                Category</h1>
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
                  <h3 class="card-title">Update Sub Category of {{ category.name }}</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Sub Category</label>
                    <input type="text" class="form-control" placeholder="Enter sub category"
                      v-model="form.name"
                    >
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Photo</label>
                    <br>
                    <a :href="mediaUrl + form.imagepath" target="_blank">{{ form.imagepath }}</a>
                    <input type="text" class="form-control" placeholder="Enter attachment"
                      v-model="form.imagepath"
                    >
                    <br>
                    <input type="file" id="file" name="file" ref="file" accept="application/ms-excel" multiple>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Update Sub Category' }}</button>
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
  name: 'UpdateSubCategory',
  async asyncData({$axios, params}) {
    let category = await $axios.get(`/categories/${params.categoryId}`)
    let sub_category = await $axios.get(`/categories/${params.categoryId}/sub_categories/${params.id}`)
    return {
      category: category.data.data,
      form: sub_category.data.data,
    }
  },
  data: () => ({
    form: {
      divide_by: 1
    },
    subcategoryid: '',
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
        let admin = await this.$axios.patch(`/categories/${this.category.id}/sub_categories/${this.form.id}`, this.form)
        this.subcategoryid = admin.data.data.id
        await this.handleFileUpload()
        this.$router.push(`/organizations/${this.organization.value}/categories/${this.category.id}/sub-categories`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
    async handleFileUpload() {
      this.attachment = this.$refs.file.files[0]
      let formData = new FormData();
      formData.append('subcategoryid', this.subcategoryid);
      formData.append('attachment', this.attachment);
      await this.$axios.post('upload_sub_category_photo', formData,
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