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
                  :link="`/notifications`"
                >
                </back-button>
                Notification</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/notifications`">Notifications</nuxt-link>
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
                  <h3 class="card-title">Create Notification</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Notification Title</label>
                    <input type="text" class="form-control" placeholder="Enter notification title"
                      v-model="form.title"
                    >
                    <span class="help-block" 
                      v-if="errors.title"
                    >{{ errors.title[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Notification Text</label>
                    <input type="text" class="form-control" placeholder="Enter text"
                      v-model="form.text"
                    >
                    <span class="help-block" 
                      v-if="errors.text"
                    >{{ errors.text[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">To</label>
                    <select class="form-control" v-model="form.to">
                      <option value="">Select Store/User</option>
                      <option value="Store">Store</option>
                      <option value="User">User</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.to"
                    >{{ errors.to[0] }}</span>
                  </div>
                  <div class="form-group">
                    <span v-if="form.to == 'Store'">
                      <input type="checkbox" v-model="form.s_all"> All&nbsp;&nbsp;
                      <input type="checkbox" v-model="form.s_approved"> To Approved Store&nbsp;&nbsp;
                      <input type="checkbox" v-model="form.s_enabled"> To Enabled Store&nbsp;&nbsp;
                    </span>
                    <span v-if="form.to == 'User'">
                      <input type="checkbox" v-model="form.u_all"> All&nbsp;&nbsp;
                      <input type="checkbox" v-model="form.u_delivery"> To Delivery Rider&nbsp;&nbsp;
                      <input type="checkbox" v-model="form.u_customer"> To Customer
                      <hr>
                      <span v-if="form.u_delivery">
                        <input type="checkbox" v-model="form.v_a"> To Available Delivery Rider&nbsp;&nbsp;
                        <input type="checkbox" v-model="form.v_na"> To Not Available Delivery Rider&nbsp;&nbsp;
                      </span>
                      <span v-if="form.u_customer">
                        <input type="checkbox" v-model="form.u_active"> To Active User&nbsp;&nbsp;
                        <input type="checkbox" v-model="form.u_inactive"> To In Active User&nbsp;&nbsp;
                      </span>
                    </span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Create Notification' }}</button>
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
  name: 'CreateNotification',
  data: () => ({
    form: {
      to: '',
      details: 'Other Details'
    },
    tagid: '',
    loading: false
  }),
  mounted() {
  },
  components: {
    BackButton,
  },
  methods: {
    async store() {
      let r = confirm("Please recheck. Notifications once sent can't be undo")
      if(r) {
        this.loading = true
        try {
          let notification = await this.$axios.post(`/notifications`, this.form)
          this.$router.push(`/notifications`)
          this.loading = false
        }
        catch(e) {
          this.loading = false
        }
      }
    },
  }
}
</script>