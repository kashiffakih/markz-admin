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
            <div class="col-md-12">
              <!-- jquery validation -->
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Create Organization</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Organization name</label>
                        <input type="text" class="form-control" placeholder="Enter name"
                          v-model="form.name"
                        >
                        <span class="help-block" 
                          v-if="errors.name"
                        >{{ errors.name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Owner name</label>
                        <input type="text" class="form-control" placeholder="Enter owner name"
                          v-model="form.owner_name"
                        >
                        <span class="help-block" 
                          v-if="errors.owner_name"
                        >{{ errors.owner_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Store Type</label>
                        <select class="form-control" v-model="form.category_id">
                          <option value="">Select store type</option>
                          <option
                            v-for="(category, c) in categories"
                            :key="`category${c}`"
                            :value="category.id"
                          >
                            {{ category.name }}
                          </option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.category_id"
                        >{{ errors.category_id[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Address</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Address line 1</label>
                        <input type="text" class="form-control" placeholder="Enter address line 1"
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
                        <input type="text" class="form-control" placeholder="Enter address line 2"
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
                        <label class="form-label">Short Address</label>
                        <input type="text" class="form-control" placeholder="Enter short address"
                          v-model="form.short_address"
                        >
                        <span class="help-block" 
                          v-if="errors.short_address"
                        >{{ errors.short_address[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Short Category</label>
                        <input type="text" class="form-control" placeholder="Enter short category"
                          v-model="form.short_category"
                        >
                        <span class="help-block" 
                          v-if="errors.short_category"
                        >{{ errors.short_category[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Delivery Details</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Delivery Duration</label>
                        <input type="number" class="form-control" placeholder="Enter delivery duration"
                          v-model="form.delivery_duration"
                        >
                        <span class="help-block" 
                          v-if="errors.delivery_duration"
                        >{{ errors.delivery_duration[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Open Time</label>
                        <div class="row">
                          <div class="col-md-4">
                            <select class="form-control" v-model="form.open_time_hr"> 
                              <option value="">Select Hr</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                              <option value="12">12</option>
                            </select>
                          </div>
                          <div class="col-md-4">
                            <select class="form-control" v-model="form.open_time_min"> 
                              <option value="">Select Min</option>
                              <option value="00">00</option>
                              <option value="15">15</option>
                              <option value="30">30</option>
                              <option value="45">45</option>
                            </select>
                          </div>
                          <div class="col-md-4">
                            <select class="form-control" v-model="form.open_time_am_pm"> 
                              <option value="">Select AM/PM</option>
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Delivery Charges (in Rs.)</label>
                        <input type="number" class="form-control" placeholder="Enter delivery charges"
                          v-model="form.delivery_charges"
                        >
                        <span class="help-block" 
                          v-if="errors.delivery_charges"
                        >{{ errors.delivery_charges[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Penalty on Order Rejection (in Rs.)</label>
                        <input type="number" class="form-control" placeholder="Enter penalty ampunt"
                          v-model="form.reject_penalty"
                        >
                        <span class="help-block" 
                          v-if="errors.reject_penalty"
                        >{{ errors.reject_penalty[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Contact Details</h3>
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
                        <input type="number" class="form-control" placeholder="Enter phone"
                          v-model="form.phone"
                        >
                        <span class="help-block" 
                          v-if="errors.phone"
                        >{{ errors.phone[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Comission Details</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Comission Type</label>
                        <select class="form-control" v-model="form.comission_type">
                          <option value="">Select comission type</option>
                          <option value="Flat">Flat</option>
                          <option value="Percent">Percent</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.comission_type"
                        >{{ errors.comission_type[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Comission Value</label>
                        <input type="number" class="form-control" placeholder="Enter comission"
                          v-model="form.comission_value"
                        >
                        <span class="help-block" 
                          v-if="errors.comission_value"
                        >{{ errors.comission_value[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Account Details</h3>
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
                    <div class="col-md-12">
                      <hr>
                      <h3>Dine In Details</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.is_dine_in_and_delivery"
                        >&nbsp;&nbsp;Is Dine In and Delivery Both
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Dine In Minimum Amount</label>
                        <input type="number" class="form-control" placeholder="Enter dine in minimum amount"
                          v-model="form.dine_in_min_amount"
                        >
                        <span class="help-block" 
                          v-if="errors.dine_in_min_amount"
                        >{{ errors.dine_in_min_amount[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Free Delivery</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.free_delivery_applicable"
                        >&nbsp;&nbsp;Is Free Delivery Applicable
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Free Delivery Minimum Amount</label>
                        <input type="number" class="form-control" placeholder="Enter free delivery minimum amount"
                          v-model="form.free_delivery_min_amount"
                        >
                        <span class="help-block" 
                          v-if="errors.free_delivery_min_amount"
                        >{{ errors.free_delivery_min_amount[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Tax and Packaging</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Tax Percent</label>
                        <input type="number" class="form-control" placeholder="Enter tax percent"
                          v-model="form.tax_percent"
                        >
                        <span class="help-block" 
                          v-if="errors.tax_percent"
                        >{{ errors.tax_percent[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Packaging Charges</label>
                        <input type="number" class="form-control" placeholder="Enter packaging charges"
                          v-model="form.packaging_charges"
                        >
                        <span class="help-block" 
                          v-if="errors.packaging_charges"
                        >{{ errors.packaging_charges[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <hr>
                      <h3>Status</h3>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.is_approved"
                        >&nbsp;&nbsp;Is Approved
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.is_enabled"
                        >&nbsp;&nbsp;Is Enabled
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.is_cashback_applicable"
                        >&nbsp;&nbsp;Is Cashback Applicable
                      </div>
                    </div>
                    <!-- <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.is_referral_amount_usability"
                        >&nbsp;&nbsp;Is Referral Applicable
                      </div>
                    </div> -->
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Logo</label>
                        <br>
                        <input type="file" id="file" name="file" ref="file" accept="application/ms-excel" multiple>
                        <img style="width: 100px; height: 100px;" :src="`${mediaUrl}${form.logo_path ? form.logo_path : 'company.png'}`">
                      </div>  
                    </div>
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
  async asyncData({$axios, params}) {
    let categories = await $axios.get(`/categories`)
    let cities = await $axios.get(`/cities`)
    return {
      categories: categories.data.data,
      cities: cities.data.data,
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      address: '',
      time_zone: '',
      comission_type: '',
      category_id: '',
      state: '',
      city_id: '',
      open_time_hr: '',
      open_time_min: '',
      open_time_am_pm: ''
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