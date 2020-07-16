<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Organizations</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Organizations</li>
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
                  <h3 class="card-title">Create Organization</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Organization name</label>
                    <input type="text" class="form-control" placeholder="Enter name"
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
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-control" placeholder="Enter address"
                      v-model="form.address"
                    >
                    <span class="help-block" 
                      v-if="errors.address"
                    >{{ errors.address[0] }}</span>
                  </div>
                  <div class="form-group">
                    <input type="checkbox"
                      v-model="form.is_cashback_applicable"
                    >&nbsp;&nbsp;Is Cashback Applicable
                  </div>
                  <div class="form-group">
                    <input type="checkbox"
                      v-model="form.is_dine_in_and_delivery"
                    >&nbsp;&nbsp;Is Dine In and Delivery Both
                  </div>
                  <div class="form-group">
                    <input type="checkbox"
                      v-model="form.is_referral_amount_usability"
                    >&nbsp;&nbsp;Is Referral Applicable
                  </div>
                  <div class="form-group">
                    <label class="form-label">Time Zone</label>
                    <select class="form-control custom-select"
                      v-model="form.time_zone"
                    >
                      <option value="">Select Time Zone</option>
                      <option v-for="time_zone in time_zones" :key="`'time_zone'${time_zone.value}`" :value="time_zone.value">{{ time_zone.text }}</option>
                    </select>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >Create Organization</button>
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

import moment from 'moment'
import moment_timezone from 'moment-timezone'

export default {
  name: 'CreateOrganization',
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      address: '',
      time_zone: ''
    },
    time_zones: []
  }),
  components: {
    BackButton
  },
  mounted() {
    var timezones = moment.tz.names();
    for (var i = 0; i < timezones.length; i++) {
      this.time_zones.push({
        'text': timezones[i],
        'value': timezones[i]
      })
    }
  },
  methods: {
    async store() {
      try {
        await this.$axios.post(`/companies`, this.form)
        this.$router.push('/organizations');
      }
      catch(e) {}
    }
  }
}
</script> 