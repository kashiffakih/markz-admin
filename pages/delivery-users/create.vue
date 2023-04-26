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
                  :link="`/delivery-users`"
                  title="Hi"
                >
                </back-button>
                Delivery Rider Details</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/delivery-users`">Delivery Riders</nuxt-link>
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
          <div class="row">
            <div class="col-md-12">
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Add Delivery Rider Details</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-control" v-model="form.active">
                          <option value="">Select Status</option>
                          <option value="1">Enable</option>
                          <option value="0">Disable</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.active"
                        >{{ errors.active[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">First Name</label>
                        <input type="text" class="form-control" placeholder="Enter first name"
                          v-model="form.first_name"
                        >
                        <span class="help-block" 
                          v-if="errors.first_name"
                        >{{ errors.first_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Middle Name</label>
                        <input type="text" class="form-control" placeholder="Enter middle name"
                          v-model="form.middle_name"
                        >
                        <span class="help-block" 
                          v-if="errors.middle_name"
                        >{{ errors.middle_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Last Name</label>
                        <input type="text" class="form-control" placeholder="Enter last name"
                          v-model="form.last_name"
                        >
                        <span class="help-block" 
                          v-if="errors.last_name"
                        >{{ errors.last_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" placeholder="Enter email"
                          v-model="form.email"
                        >
                        <span class="help-block" 
                          v-if="errors.email"
                        >{{ errors.email[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Phone</label>
                        <div class="input-group">
                          <input type="number" class="form-control" placeholder="Enter phone" v-mask="'###############'" v-model="form.phone">
                        </div>
                        <span class="help-block" 
                          v-if="errors.phone"
                        >{{ errors.phone[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Address line 1</label>
                        <input type="email" class="form-control" placeholder="Enter address line 1"
                          v-model="form.add_1"
                        >
                        <span class="help-block" 
                          v-if="errors.add_1"
                        >{{ errors.add_1[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Address line 2</label>
                        <input type="email" class="form-control" placeholder="Enter address line 2"
                          v-model="form.add_2"
                        >
                        <span class="help-block" 
                          v-if="errors.add_2"
                        >{{ errors.add_2[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Landmark</label>
                        <input type="text" class="form-control" placeholder="Enter landmark"
                          v-model="form.add_3"
                        >
                        <span class="help-block" 
                          v-if="errors.add_3"
                        >{{ errors.add_3[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">State</label>
                        <select class="form-control" v-model="form.state">
                          <option value="">Select State</option>
                          <option value="Maharashtra">Maharashtra</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.state"
                        >{{ errors.state[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">City</label>
                        <select class="form-control" v-model="form.city_id">
                          <option value="">Select City</option>
                          <option 
                            v-for="(city, c) in cities"
                            :key="`city${c}`"
                            :value="city.id"
                          >{{ city.name }}</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.city_id"
                        >{{ errors.city_id[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Pincode</label>
                        <input type="number" class="form-control" placeholder="Enter pincode"
                          v-model="form.pincode"
                        >
                        <span class="help-block" 
                          v-if="errors.pincode"
                        >{{ errors.pincode[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Gender</label>
                        <select class="form-control" v-model="form.gender">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.pincode"
                        >{{ errors.pincode[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Bank Name</label>
                        <input type="text" class="form-control" placeholder="Enter bank"
                          v-model="form.bank"
                        >
                        <span class="help-block" 
                          v-if="errors.bank"
                        >{{ errors.bank[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Branch</label>
                        <input type="text" class="form-control" placeholder="Enter branch"
                          v-model="form.branch"
                        >
                        <span class="help-block" 
                          v-if="errors.branch"
                        >{{ errors.branch[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Account Type</label>
                        <input type="text" class="form-control" placeholder="Enter account type"
                          v-model="form.acc_type"
                        >
                        <span class="help-block" 
                          v-if="errors.acc_type"
                        >{{ errors.acc_type[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Account Holder Name</label>
                        <input type="text" class="form-control" placeholder="Enter account holder name"
                          v-model="form.acc_name"
                        >
                        <span class="help-block" 
                          v-if="errors.acc_name"
                        >{{ errors.acc_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Account No</label>
                        <input type="text" class="form-control" placeholder="Enter account no"
                          v-model="form.acc_no"
                        >
                        <span class="help-block" 
                          v-if="errors.acc_no"
                        >{{ errors.acc_no[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">IFSC Code</label>
                        <input type="text" class="form-control" placeholder="Enter ifsc code"
                          v-model="form.ifsc_code"
                        >
                        <span class="help-block" 
                          v-if="errors.ifsc_code"
                        >{{ errors.ifsc_code[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Vehicle Type</label>
                        <select class="form-control" v-model="form.vehicle_type">
                          <option value="">Select Vehicle Type</option>
                          <option value="Moped">Moped</option>
                          <option value="Bicycle">Bicycle</option>
                          <option value="Tempo">Tempo</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.pincode"
                        >{{ errors.pincode[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Vehicle Name</label>
                        <input type="text" class="form-control" placeholder="Enter vehicle name"
                          v-model="form.vehicle_name"
                        >
                        <span class="help-block" 
                          v-if="errors.vehicle_name"
                        >{{ errors.vehicle_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Vehicle no</label>
                        <input type="text" class="form-control" placeholder="Enter vehicle no"
                          v-model="form.vehicle_no"
                        >
                        <span class="help-block" 
                          v-if="errors.vehicle_no"
                        >{{ errors.vehicle_no[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Photo</label>
                        <br>
                        <input type="file" id="file" name="file" ref="file" accept="application/ms-excel" multiple>
                      </div>
                    </div>
                  </div>
                  <!-- End row -->
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                      :disabled="loading"
                    >
                      {{ loading ? 'Saving...': 'Create Delivery Rider' }}
                    </button>
                  </div>
                </div>
                <!-- end form start -->
              </div>
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
import CountryCodes from '@/components/country-codes.vue'
import 'vue-select/dist/vue-select.css';
import moment from 'moment'

export default {
  name: 'CreateUser',
  async asyncData({$axios, params}) {
    let r = await $axios.get(`/roles`)
    r = r.data.data
    let roles = []
    roles.push({
      label: 'Select Role',
      code: '',
    })
    r.forEach((role) => {
      roles.push({
        label: role.name,
        code: role.id,
      })
    })
    let cities = await $axios.get(`/cities`)
    return {
      roles: roles,
      cities: cities.data.data,
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      active: 0,
      role_id: '',
      state: '',
      city_id: '',
      vehicle_type: '',
    },
    userid: '',
    loading: false
  }),
  mounted() {
    this.form.role_id = 5
    this.form.dob = moment().format('DD-MM-YYYY')
  },
  components: {
    BackButton,
    CountryCodes
  },
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/users`, this.form)
        this.userid = admin.data.data.id
        // Assign Role
        let role_payload = {
          user_id: admin.data.data.id,
          role_id: this.form.role_id
        }
        await this.$axios.post('/role_user', role_payload)
        // Assign Organization
        // let organization_payload = {
        //   user_id: admin.data.data.id,
        //   company_id: this.$route.params.organizationId
        // }
        // await this.$axios.post('/company_user', organization_payload)
        await this.handleFileUpload()
        this.$router.push(`/delivery-users`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
    async handleFileUpload() {
      this.attachment = this.$refs.file.files[0]
      let formData = new FormData();
      formData.append('userid', this.userid);
      formData.append('attachment', this.attachment);
      await this.$axios.post('upload_user_photo', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(response => {
      })
      .catch(function(){
        console.log('FAILURE!!');
      });
    },
  }
}
</script>