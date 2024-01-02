<template>
  <section class="hold-transition login-page">
    <div class="login-box">
      <div class="login-logo">
        <nuxt-link to="/"><b>AADAB</b></nuxt-link>
      </div>
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">Sign in to start your session</p>

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
          <div class="row">
            <!-- /.col -->
            <div class="col-4">
              <button type="submit" class="btn btn-primary btn-block"
                @click="login"
              >Sign In</button>
            </div>
            <!-- /.col -->
          </div>

          <br>
          <p class="mb-1">
            <nuxt-link to="/auth/forgot-password">I forgot my password</nuxt-link>
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
  name: 'Login',
  middleware: 'guest',
  auth: false,
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  methods: {
    async login() {
      try {
        await this.$axios.post('/login', this.form)
        await this.$auth.login({ data: this.form })
        this.$router.push('/')
      }
      catch(e) {}
    }
  }
}
</script>
