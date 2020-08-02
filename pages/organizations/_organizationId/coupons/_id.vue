<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">
                <back-button
                  :link="`/organizations/${organization.value}/coupons`"
                >
                </back-button>
                Coupon</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/coupons`">Coupons</nuxt-link>
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
                  <h3 class="card-title">Edit Coupon</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Coupon Name</label>
                    <input type="text" class="form-control" placeholder="Enter coupon name"
                      v-model="form.name"
                    >
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Start Date [{{ form.start_date }}]</label>
                    <date-picker
                      placeholder="DD-MM-YYYY"
                      :format="customStartDateFormatter"
                      value="form.start_date"
                    />
                    <span class="help-block" 
                      v-if="errors.start_date"
                    >{{ errors.start_date[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Date [{{ form.end_date }}]</label>
                    <date-picker
                      placeholder="DD-MM-YYYY"
                      :format="customEndDateFormatter"
                      value="form.end_date"
                    />
                    <span class="help-block" 
                      v-if="errors.end_date"
                    >{{ errors.end_date[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Coupon Type</label>
                    <select class="form-control" v-model="form.type">
                      <option value="">Select coupon type</option>
                      <option value="Flat">Flat</option>
                      <option value="Percent">Percent</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.type"
                    >{{ errors.type[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Coupon Value</label>
                    <input type="number" class="form-control" placeholder="Enter coupon value"
                      v-model="form.value"
                    >
                    <span class="help-block" 
                      v-if="errors.value"
                    >{{ errors.value[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Update Coupon' }}</button>
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

export default {
  name: 'UpdateCoupon',
  async asyncData({$axios, params}) {
    let coupon = await $axios.get(`/company_coupons/${params.id}`)
    return {
      form: coupon.data.data
    }
  },
  data: () => ({
    loading: false
  }),
  mounted() {
  },
  components: {
    BackButton,
  },
  methods: {
    customStartDateFormatter(date) {
      this.form.start_date = moment(date).format('DD-MM-YYYY');
      return moment(date).format('DD-MM-YYYY');
    },
    customEndDateFormatter(date) {
      this.form.end_date = moment(date).format('DD-MM-YYYY');
      return moment(date).format('DD-MM-YYYY');
    },
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.patch(`/company_coupons/${this.$route.params.id}`, this.form)
        this.$router.push(`/organizations/${this.organization.value}/coupons`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>