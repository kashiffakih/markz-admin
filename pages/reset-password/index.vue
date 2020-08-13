<template>
  <section class="hold-transition login-page">
    <div class="login-box">
      <div class="login-logo">
        <nuxt-link to="/"><b>A</b>ETHON</nuxt-link>
      </div>
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">Reset Your Password</p>

          <span style="color: red;"
            v-if="errors.email"
          >{{ errors.email[0] }}</span>
          <div class="input-group mb-3">
            <input disabled type="email" class="form-control" placeholder="Email"
              v-model="form.email"
            >
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>

          <span style="color: red;"
            v-if="errors.password"
          >{{ errors.password[0] }}</span>
          <div class="input-group mb-3">
            <input type="password" class="form-control" placeholder="Password"
              v-model="form.password"
            >
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>

          <span style="color: red;"
            v-if="errors.password_confirmation"
          >{{ errors.password_confirmation[0] }}</span>
          <div class="input-group mb-3">
            <input type="password" class="form-control" placeholder="Password"
              v-model="form.password_confirmation"
            >
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- /.col -->
            <div class="col-12">
              <button type="submit" class="btn btn-primary btn-block"
                @click="sendEmail"
              >Reset Password</button>
            </div>
            <!-- /.col -->
          </div>

          <br>
          <p class="mb-1">
            <nuxt-link to="/auth/login">Go back to Login</nuxt-link>
          </p>
        </div>
        <!-- /.login-card-body -->
      </div>
    </div>
    <!-- /.login-box -->
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ResetPassword',
  middleware: 'guest',
  auth: false,
  data: () => ({
    form: {
      email: '',
      password: '',
      password_confirmation: '',
    }
  }),
  mounted() {
    this.getEmail()
  },
  methods: {
    async getEmail() {
      let payLoad = {
        'token': this.$route.query.token
      }
      let email = await this.$axios.get(`/reset_password/getEmail?token=${payLoad.token}`)
      this.form.email = email.data.data.email
    },
    async sendEmail() {
      try {
        await this.$axios.post('/reset_password', this.form)
        alert("Password Updated");
      }
      catch(e) {}
    }
  }
}
</script>
