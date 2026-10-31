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

              <h1 class="m-0 text-dark">
                
                Company Wallet</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/company_wallets`">Company Wallet</nuxt-link>
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
                  <h3 class="card-title">Update Company Wallet</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Source</label>
                    <select class="form-control" v-model="form.source">
                      <option value="">Select Source</option>
                      <option value="Referral">Referral</option>
                      <option value="Cash Back">Cash Back</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.source"
                    >{{ errors.source[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-control" placeholder="Enter amount"
                      v-model="form.amount"
                    >
                    <span class="help-block" 
                      v-if="errors.amount"
                    >{{ errors.amount[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Update into wallet' }}</button>
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
import BackButton from "@/components/BackButton.vue";
export default {
  name: 'UpdateCompanyWallet',
  components: {
    BackButton
  },
  async asyncData({$axios, params}) {
    let user = await $axios.get(`/company_wallets/${params.id}`)
    return {
      form: user.data.data
    }
  },
  data: () => ({
    loading: false
  }),
  mounted() {
  },
  
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.patch(`/company_wallets/${this.$route.params.id}`, this.form)
        this.$router.push(`/organizations/${this.organization.value}/company_wallets`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>