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
                  :link="`/offers`"
                >
                </back-button>
                Offers</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/offers`">Offers</nuxt-link>
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
                  <h3 class="card-title">Create Offer</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Description 1</label>
                    <input type="text" class="form-control" placeholder="Enter description 1"
                      v-model="form.desc_1"
                    >
                    <span class="help-block" 
                      v-if="errors.desc_1"
                    >{{ errors.desc_1[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Description 2</label>
                    <input type="text" class="form-control" placeholder="Enter description 2"
                      v-model="form.desc_2"
                    >
                    <span class="help-block" 
                      v-if="errors.desc_2"
                    >{{ errors.desc_2[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Description 3</label>
                    <input type="text" class="form-control" placeholder="Enter description 3"
                      v-model="form.desc_3"
                    >
                    <span class="help-block" 
                      v-if="errors.desc_3"
                    >{{ errors.desc_3[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">URL</label>
                    <input type="text" class="form-control" placeholder="Enter url"
                      v-model="form.url"
                    >
                    <span class="help-block" 
                      v-if="errors.url"
                    >{{ errors.url[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Available On</label>
                    <select class="form-control" v-model="form.available_on">
                      <option value="">Select Available On</option>
                      <option value="Web">Web</option>
                      <option value="App">App</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.available_on"
                    >{{ errors.available_on[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Button Text</label>
                    <input type="text" class="form-control" placeholder="Enter button text"
                      v-model="form.button_text"
                    >
                    <span class="help-block" 
                      v-if="errors.button_text"
                    >{{ errors.button_text[0] }}</span>
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
                    <label class="form-label">Photo</label>
                    <br>
                    <input type="file" id="file" name="file" ref="file" accept="application/ms-excel" multiple>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Create New Offer' }}</button>
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
  name: 'Offers',
  data: () => ({
    form: {
      start_date: '',
      end_date: '',
      available_on: '',
    },
    tagid: '',
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
        let admin = await this.$axios.post(`/offers`, this.form)
        this.$router.push(`/offers`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>