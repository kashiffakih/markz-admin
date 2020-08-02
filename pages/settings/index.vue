<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Settings</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Settings</li>
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
            <div class="col-md-12">
              <!-- jquery validation -->
              <div class="card card-primary">
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="col-md-12">
                    <label class="form-label">Select Organization</label>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <select class="form-control custom-select"
                            v-model="organizationId"
                          >
                            <option value="">Select Organization</option>
                            <option v-for="org in organizations" :key="`'org'${org.id}`" :value="org.value">{{ org.text }}</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-footer">
                          <button class="btn btn-primary btn-block"
                            @click="updateDetails"
                          >Update Organization</button>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Referral Amount (in Rs.)</label> 
                          <input type="number" class="form-control" placeholder="Enter referral amount" v-model="form.referral_amount">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Reject Penalty on Rider (in Rs.)</label> 
                          <input type="number" class="form-control" placeholder="Enter reject penalty amount" v-model="form.reject_penalty_on_rider">
                        </div>
                      </div>
                    </div>

                    <button class="btn btn-primary btn-block"
                            @click="updateSettings"
                          >Update Details</button>

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
  name: 'AdminSettings',
  async asyncData({$axios}) {
    let organizations = await $axios.get('/companies');
    organizations = organizations.data.data.map(organization => ({
      'text': organization.name,
      'value': organization.id,
      'time_zone': organization.time_zone ? organization.time_zone : 'Asia/Calcutta',
      logo_path: organization.logo_path
    }));
    let setting = await $axios.get(`/settings/1`)
    let form = setting.data.data == null ? {} : setting.data.data
    return {
      organizations: organizations,
      form: form
    }
  },
  data: () => ({
    organizationId: '',
    form: {
      referral_amount: 0,
      reject_penalty_on_rider: 0
    },
    loading: false
  }),
  mounted() {
    this.organizationId = this.$store.getters['settings/organization'].value;
  },
  methods: {
    updateDetails() {
      if(this.organizationId){
        let organization = this.organizations.filter(o => o.value == this.organizationId)
        if(organization.length) {
          this.$store.dispatch('settings/setOrganization', organization[0])
          alert("Details Updated")
        }
      } else {
        alert("Please select the organization")
      }
    },
    async updateSettings() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/settings`, this.form)
        alert('Details Updated')
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    }
  }
}
</script> 