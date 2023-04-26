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
                        <label class="form-label">Email</label>
                        <v-select 
                          v-model="form.email" 
                          :reduce="email => email.code" 
                          :options="emails"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Password</label>
                        <div class="input-group">
                          <input type="password" class="form-control" placeholder="Password"
                            v-model="form.password"
                          >
                          <div class="input-group-append">
                            <div class="input-group-text">
                              <span class="fas fa-lock"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span style="color: red;"
                        v-if="errors.password"
                      >{{ errors.password[0] }}</span>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Password Confirmation</label>
                        <div class="input-group">
                          <input type="password" class="form-control" placeholder="Password"
                            v-model="form.password_confirmation"
                          >
                          <div class="input-group-append">
                            <div class="input-group-text">
                              <span class="fas fa-lock"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span style="color: red;"
                        v-if="errors.password_confirmation"
                      >{{ errors.password_confirmation[0] }}</span>
                    </div>
                    <div class="form-footer">
                      <button class="btn btn-primary btn-block"
                        @click="store"
                      >
                        Update Password
                      </button>
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
  name: 'Reset Password',
  async asyncData({$axios, params}) { 
    let users = await $axios.get(`/users?search=all`);
    let emails = []
    users = users.data.data.forEach(user => {
      emails.push({
        label: user.email,
        code: user.email
      })
    })
    return {
      emails: emails
    }
  },
  data: () => ({
   form: {
     email: '',
     password: '',
     password_confirmation: ''
   }

  }),
  mounted() {
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      try {
        await this.$axios.post(`/reset_password`, this.form)
        alert("Password Updated");
      } catch(e) {}
    }
  }
}
</script> 