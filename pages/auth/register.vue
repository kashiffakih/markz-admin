<template>
  <div class="page">
    <div class="page-single">
      <div class="container">
        <div class="row">
          <div class="col col-login mx-auto">
            <div class="text-center mb-6">
              <img src="/brand/logo.png" class="h-6" alt="">
            </div>
            <form class="card" action="" method="post">
              <div class="card-body p-6">
                <div class="card-title">Create new account</div>
                <div class="form-group">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" placeholder="Enter name">
                </div>
                <div class="form-group">
                  <label class="form-label">Email address</label>
                  <input type="email" class="form-control" placeholder="Enter email">
                </div>
                <div class="form-group">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" placeholder="Password">
                </div>
                <div class="form-group">
                  <label class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" />
                    <span class="custom-control-label">Agree the <a href="terms.html">terms and policy</a></span>
                  </label>
                </div>
                <div class="form-footer">
                  <button type="submit" class="btn btn-primary btn-block">Create new account</button>
                </div>
              </div>
            </form>
            <div class="text-center text-muted">
              Already have account? <a href="./login.html">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  middleware: 'guest',
  auth: false,
  name: 'Register',
  async asyncData({$axios}) {
    let organizations = await $axios.get('/companies');
    organizations = organizations.data.data.map(organization => ({
      'text': organization.name,
      'value': organization.id 
    }));
    let roles = await $axios.get('/roles');
    roles = roles.data.data.map(role => ({
      'text': role.name,
      'value': role.id 
    }));
    return {
      organizations: organizations,
      roles: roles
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      password: '',
      role_id: '',
      organization_id: ''
    }
  }),
  methods: {
    async register() {
      let user  = await this.$axios.post('/register', this.form)
      user = user.data.data
      // await this.$auth.login({data: this.form})
      // Assign Role
      let role_payload = {
        user_id: user.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/assign_roles', role_payload)
      // Assign Organization
      let organization_payload = {
        user_id: user.id,
        organization_id: this.form.organization_id
      }
      await this.$axios.post('/assign_organizations', organization_payload)
      // Logged in again to get role and organization in the user json
      // await this.$auth.login({data: this.form})
      this.$router.push('/auth/login')
    }
  }
}
</script>