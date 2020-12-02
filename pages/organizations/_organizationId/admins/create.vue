<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Admin Details</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Admin Details</li>
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
                  <h3 class="card-title">Create Admin Details of {{ org.name }}</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" placeholder="Enter first name"
                      v-model="form.name"
                    >
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" placeholder="Enter email"
                      v-model="form.email"
                    >
                    <span class="help-block" 
                      v-if="errors.email"
                    >{{ errors.email[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="number" class="form-control" placeholder="Enter phone"
                      v-model="form.phone"
                    >
                    <span class="help-block" 
                      v-if="errors.phone"
                    >{{ errors.phone[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >Create Admin</button>
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
    let organization = await $axios.get(`/companies/${params.organizationId}`)
    let company_designations = await $axios.get(`/companies/${params.organizationId}/company_designations`)
    company_designations = company_designations.data.data.map(role => ({
      'text': role.name,
      'value': role.id 
    }));
    return {
      org: organization.data.data,
      company_designations: company_designations
    }
  },
  data: () => ({
    form: {
      first_name: '',
      email: '',
      phone: '',
      active: 1,
      role_id: ''
    },
    dojDateMenu: false,
    dobDateMenu: false,
  }),
  mounted() {
    this.form.role_id = 2;
  },
  components: {
    BackButton
  },
  methods: {
    async store() {
      try {
        let admin = await this.$axios.post(`/users`, this.form)
        // Assign Role
        let role_payload = {
          user_id: admin.data.data.id,
          role_id: this.form.role_id
        }
        await this.$axios.post('/role_user', role_payload)
        // Assign Organization
        let organization_payload = {
          user_id: admin.data.data.id,
          company_id: this.$route.params.organizationId
        }
        await this.$axios.post('/company_user', organization_payload)
        this.$router.push('/organizations')
      }
      catch(e) {

      }
    }
  }
}
</script>