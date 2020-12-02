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
                  :link="`/delivery-users/${$route.params.userId}/documents`"
                >
                </back-button>
              Documents</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Documents</li>
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
                  <h3 class="card-title">Update Documents of {{ user.first_name }}</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Doc. Type</label>
                    <select class="form-control" v-model="form.type">
                      <option value="">Select Doc. Type</option>
                      <option value="Adhaar Card">Adhaar Card</option>
                      <option value="Pan Card">Pan Card</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.type"
                    >{{ errors.type[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Document No</label>
                    <input type="text" class="form-control" placeholder="Enter no"
                      v-model="form.value"
                    >
                    <span class="help-block" 
                      v-if="errors.value"
                    >{{ errors.value[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Attachment</label>
                    <br>
                    <a :href="mediaUrl + form.imagepath" target="_blank">{{ form.imagepath }}</a>
                    <input type="text" class="form-control" placeholder="Enter atatchment"
                      v-model="form.imagepath"
                    >
                    <br>
                    <input type="file" id="file" name="file" ref="file" accept="application/ms-excel" multiple>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >Update Document</button>
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
  name: 'CreateAdmin',
  async asyncData({$axios, params}) {
    let user = await $axios.get(`/users/${params.userId}`)
     let doc = await $axios.get(`/user_documents/${params.id}`)
    return {
      user: user.data.data,
      form: doc.data.data
    }
  },
  data: () => ({
    form: {
      user_id: '',
      type: '',
    },
    docId: '',
  }),
  mounted() {
    this.form.user_id = this.$route.params.userId
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      try {
        let admin = await this.$axios.patch(`user_documents/${this.$route.params.id}`, this.form)
        this.docId = admin.data.data.id
        await this.handleFileUpload()
        this.$router.push(`/delivery-users/${this.$route.params.userId}/documents`)
      }
      catch(e) {

      }
    },
    async handleFileUpload() {
      this.attachment = this.$refs.file.files[0]
      let formData = new FormData();
      formData.append('docid', this.docId);
      formData.append('attachment', this.attachment);
      await this.$axios.post('upload_user_doc_photo', formData,
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