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

              <h1 class="m-0 text-dark">Website Details</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Website Details</li>
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
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Details</h3>  &nbsp;
                  <button class="btn btn-sm btn-info float-sm-right" @click="store">Update</button>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>About Us</b>
                        <editor 
                          :data.sync="form.about"
                        ></editor>
                      </no-ssr>
                    </div>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>FAQs</b>
                        <editor 
                          :data.sync="form.faq"
                        ></editor>
                      </no-ssr>
                    </div>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>Privacy</b>
                        <editor 
                          :data.sync="form.privacy"
                        ></editor>
                      </no-ssr>
                    </div>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>Terms</b>
                        <editor 
                          :data.sync="form.terms"
                        ></editor>
                      </no-ssr>
                    </div>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>Contact Details</b>
                        <editor 
                          :data.sync="form.contact"
                        ></editor>
                      </no-ssr>
                    </div>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>Return, Refund and Cancellation Policy</b>
                        <editor 
                          :data.sync="form.return"
                        ></editor>
                      </no-ssr>
                    </div>
                    <div class="form-group">
                      <no-ssr placeholder="Loading...">
                        <b>Disclaimer</b>
                        <editor 
                          :data.sync="form.disclaimer"
                        ></editor>
                      </no-ssr>
                    </div>
                  </div>
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
import editor from '@/components/editor.vue'

export default {
  name: 'details',
  components: {
    BackButton
  },
  async asyncData({$axios, params}) {
    let setting = await $axios.get(`/settings/1`)
    return {
      form: setting.data.data || {}
    }
  },
  data: () => ({
    form: {
      about: '',
      faq: '',
      privacy: '',
      terms: '',
      contact: '',
      return: '',
      disclaimer: '',
    }
  }),
  
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/settings`, this.form)
        alert('Details Updated')
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>