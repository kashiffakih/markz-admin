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
                  :link="`/organizations/${organization.value}/delivery-users`"
                  title="Hi"
                >
                </back-button>
                Delivery Boy Details</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/users`">Delivery Boy</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Update</li>
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
                  <h3 class="card-title">Update Delivery Boy Details</h3>
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
                        <label class="form-label">Address line 3</label>
                        <input type="email" class="form-control" placeholder="Enter address line 3"
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
                        <input type="text" class="form-control" placeholder="Enter state"
                          v-model="form.state"
                        >
                        <span class="help-block" 
                          v-if="errors.state"
                        >{{ errors.state[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">City</label>
                        <input type="text" class="form-control" placeholder="Enter city"
                          v-model="form.city"
                        >
                        <span class="help-block" 
                          v-if="errors.city"
                        >{{ errors.city[0] }}</span>
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
                        <label class="form-label">Account Name</label>
                        <input type="text" class="form-control" placeholder="Enter account name"
                          v-model="form.acc_name"
                        >
                        <span class="help-block" 
                          v-if="errors.acc_name"
                        >{{ errors.acc_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Bank</label>
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
                        <label class="form-label">Photo</label>
                        <br>
                        <a :href="mediaUrl + form.attachment" target="_blank">{{ form.attachment }}</a>
                        <input type="text" class="form-control" placeholder="Enter attachment"
                          v-model="form.attachment"
                        >
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
                      {{ loading ? 'Saving...': 'Update Delivery Boy' }}
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
  name: 'UpdateUser',
  async asyncData({$axios, params}) {
    let user = await $axios.get(`/users/${params.id}`)
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
    return {
      roles: roles,
      form: user.data.data
    }
  },
  data: () => ({
    form: {
      first_name: '',
      last_name: '',
      email: '',
      phone_code: '+91',
      phone: '',
      gender: '',
      active: 1,
      role_id: '',
      dob: ''
    },
    userid: '',
    loading: false
  }),
  created() {
    this.form.role_id = parseInt(this.form.roles[0].id)
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
        let admin = await this.$axios.patch(`/users/${this.form.id}`, this.form)
        this.userid = admin.data.data.id
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