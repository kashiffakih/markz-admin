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
                  <h3 class="card-title">Update Organization <small>ID: {{ form.id }}</small></h3>
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
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Address</label>
                        <input type="text" class="form-control" placeholder="Enter address"
                          v-model="form.address"
                        >
                        <span class="help-block" 
                          v-if="errors.address"
                        >{{ errors.address[0] }}</span>
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
                    <div class="col-md-4">
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
                    <div class="col-md-4"></div>
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
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="checkbox"
                          v-model="form.is_cashback_applicable"
                        >&nbsp;&nbsp;Is Cashback Applicable
                      </div>
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
                        <input type="checkbox"
                          v-model="form.is_referral_amount_usability"
                        >&nbsp;&nbsp;Is Referral Applicable
                      </div>
                    </div>
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
                    >Update Organization</button>
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
export default {
  name: 'UpdateOrganization',
  async asyncData({$axios, params}) {
    let organization = await $axios.get(`/companies/${params.id}`)
    let categories = await $axios.get(`/categories`)
    let cities = await $axios.get(`/cities`)
    return {
      form: organization.data.data,
      categories: categories.data.data,
      cities: cities.data.data,
    }
  },
  data: () => ({
    imageData: '',
    genders: [
      {'label': "Select Gender", 'code': ""},
      {'label': "Male", 'code': "Male"},
      {'label': "Female", 'code': "Female"},
    ],
    marital_statuses: [
      {'label': "Select Marital Status", 'code': ""},
      {'label': "Married", 'code': "Married"},
      {'label': "UnMarried", 'code': "UnMarried"},
    ],
  }),
  methods: {
    async store() {
      await this.$axios.patch(`/companies/${this.$route.params.id}`, this.form)
      await this.handleFileUpload()
      this.$router.push('/organizations');
    },
    async handleFileUpload() {
      this.imageData = this.$refs.file.files[0]
      let formData = new FormData();
      formData.append('company_id', this.form.id);
      formData.append('imageData', this.imageData);
      await this.$axios.post('upload_company_logo', formData,
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