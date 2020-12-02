<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Reset Password</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Reset Password</li>
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
                  <h3 class="card-title">Reset Password</h3> &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Role</label>
                        <v-select 
                          v-model="form.role_id" 
                          :reduce="role => role.code" 
                          :options="roles"
                        ></v-select>
                      </div>
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
import BackButton from '@/components/back-button.vue'

export default {
  name: 'ResetPassword',
  async asyncData({$axios, store}) {
    let user = await $axios.get(`/users/${store.getters['auth/user'].id}`);
    return {
      form: user.data.data
    }
  },
  data: () => ({
    loading: false,
  }),
  mounted() {
    this.form.role_id = this.form.roles[0].id
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      try {
        this.loading = true
        await this.$axios.post(`/reset_password`, this.form)
        alert("Password Updated");
        this.$auth.logout();
        this.loading = false
      } catch(ex) {
        this.loading = false
      }
    }
  }
}
</script> 