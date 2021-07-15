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
                    <!-- <label class="form-label">Select Organization</label> -->
                    <!-- <div class="row">
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
                    </div> -->

                    <hr>
                    <h5>Referrals and Cashbacks</h5>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Referral Amount to Referrer (in Rs.)</label> 
                          <input type="number" class="form-control" placeholder="Enter referral amount" v-model="form.referral_amount_to_referrer">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Referral Amount to Referree (in Rs.)</label> 
                          <input type="number" class="form-control" placeholder="Enter referral amount" v-model="form.referral_amount_to_referree">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Referral Min Amount</label> 
                          <input type="number" class="form-control" placeholder="Enter referral min amount" v-model="form.referral_min_amount">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Referral Amount Validity (in Days)</label> 
                          <input type="number" class="form-control" placeholder="Enter referral amount" v-model="form.referral_amount_validity">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Cashback Amount Validity (in Days)</label> 
                          <input type="number" class="form-control" placeholder="Enter referral amount" v-model="form.cashback_amount_validity">
                        </div>
                      </div>
                    </div>

                    <hr>
                    <h5>Best Values Banners</h5>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Best Value Banner 1</label>
                          <a :href="mediaUrl + form.banner_path_1" target="_blank">{{ form.banner_path_1 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath1" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Best Value Banner 2</label>
                          <a :href="mediaUrl + form.banner_path_2" target="_blank">{{ form.banner_path_2 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath2" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Best Value Banner 3</label>
                          <a :href="mediaUrl + form.banner_path_3" target="_blank">{{ form.banner_path_3 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath3" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                    </div>

                    <hr>
                    <h5>More Offers</h5>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">More Offers Banner 1</label>
                          <a :href="mediaUrl + form.banner_path_4" target="_blank">{{ form.banner_path_4 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath4" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">More Offers Banner 2</label>
                          <a :href="mediaUrl + form.banner_path_5" target="_blank">{{ form.banner_path_5 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath5" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">More Offers Banner 3</label>
                          <a :href="mediaUrl + form.banner_path_6" target="_blank">{{ form.banner_path_6 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath6" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                    </div>

                    <hr>
                    <h5>Distributor Accounts Banner</h5>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Accounts Banner 1</label>
                          <a :href="mediaUrl + form.banner_path_7" target="_blank">{{ form.banner_path_7 }}</a>
                          <br>
                          <input type="file" id="file" name="file" ref="bannerpath7" accept="application/ms-excel" multiple>
                        </div>
                      </div>
                    </div>

                    <hr>
                    <h5>Social Media Links</h5>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Facebook Url</label> 
                          <input type="text" class="form-control" placeholder="Enter facebook url" v-model="form.fb_path">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Instagram Url</label> 
                          <input type="text" class="form-control" placeholder="Enter instagram url" v-model="form.instagram_path">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Twitter Url</label> 
                          <input type="text" class="form-control" placeholder="Enter twitter url" v-model="form.twitter_path">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">LinkedIn Url</label> 
                          <input type="text" class="form-control" placeholder="Enter linkedin url" v-model="form.linkedin_path">
                        </div>
                      </div>

                    </div>

                    <hr>
                    <h5>Contact Details</h5>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Phone no</label> 
                          <input type="number" class="form-control" placeholder="Enter phone no" v-model="form.phone">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-label">Email</label> 
                          <input type="text" class="form-control" placeholder="Enter email" v-model="form.email">
                        </div>
                      </div>
                    </div>

                    <h5>Delivery Riders</h5>
                    <div class="row">
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
        this.handleFileUpload()
        alert('Details Updated')
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
    async handleFileUpload() {
      this.bannerpath1 = this.$refs.bannerpath1.files[0]
      this.bannerpath2 = this.$refs.bannerpath2.files[0]
      this.bannerpath3 = this.$refs.bannerpath3.files[0]
      this.bannerpath4 = this.$refs.bannerpath4.files[0]
      this.bannerpath5 = this.$refs.bannerpath5.files[0]
      this.bannerpath6 = this.$refs.bannerpath6.files[0]
      this.bannerpath7 = this.$refs.bannerpath7.files[0]
      let formData = new FormData();
      formData.append('settingid', this.form.id);
      formData.append('bannerpath1', this.bannerpath1);
      formData.append('bannerpath2', this.bannerpath2);
      formData.append('bannerpath3', this.bannerpath3);
      formData.append('bannerpath4', this.bannerpath4);
      formData.append('bannerpath5', this.bannerpath5);
      formData.append('bannerpath6', this.bannerpath6);
      formData.append('bannerpath7', this.bannerpath7);
      await this.$axios.post('upload_best_values_photo', formData,
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