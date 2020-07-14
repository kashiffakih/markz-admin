<template>
  <section class="hold-transition login-page">
    <div class="login-box">
      <div class="login-logo">
        <nuxt-link to="/"><b>FOOD</b>OR</nuxt-link>
      </div>
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">Enter your registered Email ID</p>

          <span style="color: red;"
            v-if="errors.email"
          >{{ errors.email[0] }}</span>
          <div class="input-group mb-3">
            <input type="email" class="form-control" placeholder="Email"
              v-model="form.email"
            >
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <!-- /.col -->
            <div class="col-12">
              <button type="submit" class="btn btn-primary btn-block"
                @click="sendEmail"
              >Send Password Reset Email</button>
            </div>
            <!-- /.col -->
          </div>
        </div>
        <!-- /.login-card-body -->
      </div>
    </div>
    <!-- /.login-box -->
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ForgotPassword',
  middleware: 'guest',
  auth: false,
  data: () => ({
    form: {
      email: '',
    }
  }),
  methods: {
    async sendEmail() {
      try {
        await this.$axios.post('/forgot_password', this.form)
        alert('Email Sent')
      }
      catch(e) {

      }
    }
  }
}
</script>
