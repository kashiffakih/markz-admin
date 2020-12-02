<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Dashboard</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Dashboard</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <!-- Filter Dates -->
          <div class="row" style="background-color: white; border-radius: 5px; padding: 10px;">
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Month</label>

                <v-select 
                  v-model="month" 
                  :reduce="month => month.code" 
                  :options="months"
                  @input="changeFilter"
                ></v-select>
                <span class="help-block" 
                  v-if="errors.start_date"
                >{{ errors.start_date[0] }}</span>
              </div>
            </div>  
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Year</label>
                
                <v-select 
                  v-model="year" 
                  :reduce="year => year.code" 
                  :options="years"
                  @input="changeFilter"
                ></v-select>
                <span class="help-block" 
                  v-if="errors.start_date"
                >{{ errors.start_date[0] }}</span>
              </div>
            </div>  
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">Start Date: {{ start_date }}</label>
                
                <client-only>
                  <date-picker
                    placeholder="DD-MM-YYYY"
                    :format="customStartDateFormatter"
                    value="start_date"
                  />
                </client-only>
                <span class="help-block" 
                  v-if="errors.start_date"
                >{{ errors.start_date[0] }}</span>
              </div>
            </div>  
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">End Date: {{ end_date }}</label>
                
                <client-only>
                  <date-picker
                    placeholder="DD-MM-YYYY"
                    :format="customEndDateFormatter"
                    value="end_date"
                  />
                </client-only>
                <span class="help-block" 
                  v-if="errors.end_date"
                >{{ errors.end_date[0] }}</span>
              </div>
            </div> 
            <div class="col-md-2">
              <br>
              <div class="form-group">
                <button class="btn btn-danger btn-block" @click="search">Filter</button>
              </div>
            </div>  
          </div>

          <br>

          <!-- Main row -->
          <div class="row">
            <!-- Map Raised -->
            <div class="col-md-12">
              <client-only>
                <GmapMap
                  :center="{lat:25.2604008, lng:55.2995083}"
                  :zoom="4"
                  map-type-id="terrain"
                  style="width: 100%; height: 500px"
                >
                  <GmapMarker
                    v-for="(m, index) in insJobMarker"
                    :key="`insJobMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-job-marker.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in insAssignedJobMarker"
                    :key="`insAssignedJobMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-assigned-job.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in insNoJobMarker"
                    :key="`insNoJobMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-no-job.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in jobAssignedMarker"
                    :key="`jobAssignedMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'job-assigned.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in jobNotAssignedMarker"
                    :key="`jobNotAssignedMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'job-not-assigned.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <gmapInfoWindow
                    :options="infoOptions"
                    :position="infoWindowPos"
                    :opened="infoWinOpen"
                    @closeclick="infoWinOpen=false"
                  >
                    <div v-html="infoContent"></div>
                  </gmapInfoWindow>
                </GmapMap>
              </client-only>

            </div>
          </div>

          <!-- Inspector boxes -->
          <div class="row">
            <div class="col-12 col-sm-6 col-md-3"
              v-for="(inspectorTab, t) in inspectorTabs"
              :key="`inspectorTab${t}`"
            >
              <nuxt-link :to="`/organizations/${organization.value}/employees`">
                <div class="info-box">
                  <span :class="'info-box-icon ' + inspectorTab.color + ' elevation-1'"><i :class="inspectorTab.icon"></i></span>

                  <div class="info-box-content">
                    <span class="info-box-text" style="color: black;">{{ inspectorTab.name }}</span>
                    <span class="info-box-number">
                      {{ inspectorTab.count }}
                    </span>
                  </div>
                  <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
              </nuxt-link>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->

          <!-- Job boxes -->
          <div class="row">
            <div class="col-12 col-sm-6 col-md-6"
              v-for="(jobTab, t) in jobTabs"
              :key="`jobTab${t}`"
            >
              <nuxt-link :to="`/organizations/${organization.value}/jobs`">
                <div class="info-box">
                  <span :class="'info-box-icon ' + jobTab.color + ' elevation-1'"><i :class="jobTab.icon"></i></span>

                  <div class="info-box-content">
                    <span class="info-box-text" style="color: black;">{{ jobTab.name }}</span>
                    <span class="info-box-number">
                      {{ jobTab.count }}
                    </span>
                  </div>
                  <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
              </nuxt-link>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->

          <!-- Main row -->
          <div class="row">
            <!-- Map and Invoice Raised -->
            <div class="col-md-12">
              <!-- <client-only>
                <GmapMap
                  :center="{lat:25.2604008, lng:55.2995083}"
                  :zoom="4"
                  map-type-id="terrain"
                  style="width: 100%; height: 500px"
                >
                  <GmapMarker
                    v-for="(m, index) in insJobMarker"
                    :key="`insJobMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-job-marker.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in insAssignedJobMarker"
                    :key="`insAssignedJobMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-assigned-job.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in insNoJobMarker"
                    :key="`insNoJobMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-no-job.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in jobAssignedMarker"
                    :key="`jobAssignedMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'job-assigned.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in jobNotAssignedMarker"
                    :key="`jobNotAssignedMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'job-not-assigned.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker> -->
                  <!-- <GmapMarker
                    v-for="(m, index) in inspectorsMarker"
                    :key="`inspectorsMarker${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    :icon="'ins-no-job.png'"
                    @mouseover="toggleInfoWindow(m,index)"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in jobsMarker"
                    :key="`m${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    @mouseover="center=m.position"
                    :icon="'job-marker.png'"
                  >
                  </GmapMarker>
                  <GmapMarker
                    v-for="(m, index) in insJobMarker"
                    :key="`m${index}`"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    @mouseover="center=m.position"
                    :icon="'ins-job-marker.png'"
                  >
                  </GmapMarker> -->
                  <!-- <gmapInfoWindow
                    :options="infoOptions"
                    :position="infoWindowPos"
                    :opened="infoWinOpen"
                    @closeclick="infoWinOpen=false"
                  >
                    <div v-html="infoContent"></div>
                  </gmapInfoWindow>
                </GmapMap>
              </client-only>

              <br> -->

              <!-- TABLE: Invoices -->
              <!-- <div class="card">
                <div class="card-header border-transparent">
                  <h3 class="card-title">Invoices Raised</h3>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table m-0">
                      <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Item</th>
                        <th>Status</th>
                        <th>Popularity</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR9842</a></td>
                        <td>Call of Duty IV</td>
                        <td><span class="badge badge-success">Shipped</span></td>
                        <td>
                          <div class="sparkbar" data-color="#00a65a" data-height="20">90,80,90,-70,61,-83,63</div>
                        </td>
                      </tr>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR1848</a></td>
                        <td>Samsung Smart TV</td>
                        <td><span class="badge badge-warning">Pending</span></td>
                        <td>
                          <div class="sparkbar" data-color="#f39c12" data-height="20">90,80,-90,70,61,-83,68</div>
                        </td>
                      </tr>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR7429</a></td>
                        <td>iPhone 6 Plus</td>
                        <td><span class="badge badge-danger">Delivered</span></td>
                        <td>
                          <div class="sparkbar" data-color="#f56954" data-height="20">90,-80,90,70,-61,83,63</div>
                        </td>
                      </tr>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR7429</a></td>
                        <td>Samsung Smart TV</td>
                        <td><span class="badge badge-info">Processing</span></td>
                        <td>
                          <div class="sparkbar" data-color="#00c0ef" data-height="20">90,80,-90,70,-61,83,63</div>
                        </td>
                      </tr>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR1848</a></td>
                        <td>Samsung Smart TV</td>
                        <td><span class="badge badge-warning">Pending</span></td>
                        <td>
                          <div class="sparkbar" data-color="#f39c12" data-height="20">90,80,-90,70,61,-83,68</div>
                        </td>
                      </tr>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR7429</a></td>
                        <td>iPhone 6 Plus</td>
                        <td><span class="badge badge-danger">Delivered</span></td>
                        <td>
                          <div class="sparkbar" data-color="#f56954" data-height="20">90,-80,90,70,-61,83,63</div>
                        </td>
                      </tr>
                      <tr>
                        <td><a href="pages/examples/invoice.html">OR9842</a></td>
                        <td>Call of Duty IV</td>
                        <td><span class="badge badge-success">Shipped</span></td>
                        <td>
                          <div class="sparkbar" data-color="#00a65a" data-height="20">90,80,90,-70,61,-83,63</div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="card-footer clearfix">
                  <a href="javascript:void(0)" class="btn btn-sm btn-info float-left">Place New Order</a>
                  <a href="javascript:void(0)" class="btn btn-sm btn-secondary float-right">View All Orders</a>
                </div>
              </div> -->
              <!-- /.Invoices -->

              <!-- USERS LIST -->
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Inspectors</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body p-0">
                  <ul class="users-list clearfix">
                    <li
                      v-for="(emp, u) in users"
                      :key="`emp${u}`"
                    >
                      <nuxt-link :to="`/organizations/${organization.value}/employees/${emp.id}/full`">
                        <img style="width: 128px; height: 128px;" :src="mediaUrl + (emp.attachment ? emp.attachment : '/user.png')" :alt="emp.first_name">
                        <a class="users-list-name" href="#">{{ emp.first_name }}</a>
                        <span class="users-list-date">{{ emp.emp_code }}</span>
                      </nuxt-link>
                    </li>
                  </ul>
                  <!-- /.users-list -->
                </div>
                <!-- /.card-body -->
                <div class="card-footer text-center">
                  <nuxt-link :to="`/organizations/${organization.value}/employees`">
                    View All Inspectors
                  </nuxt-link>
                </div>
                <!-- /.card-footer -->
              </div>
              <!--/. USERS LIST -->
            </div>


            <!-- Map Controls and Payment made to the inspectors -->
            <div class="col-md-4">
              <!-- <div class="info-box mb-3 bg-warning">
                <span class="info-box-icon"><i class="fa fa-map-marker"></i></span>

                <div class="info-box-content">
                  <span class="info-box-text">USA (Click to view)</span> 
                  <span class="info-box-number">3 Inspectors | 2 Jobs</span>
                </div>
              </div>
              <div class="info-box mb-3 bg-success">
                <span class="info-box-icon"><i class="fa fa-map-marker"></i></span>

                <div class="info-box-content">
                  <span class="info-box-text">Europe (Click to view)</span>
                  <span class="info-box-number">3 Inspectors | 2 Jobs</span>
                </div>
              </div>
              <div class="info-box mb-3 bg-primary">
                <span class="info-box-icon"><i class="fa fa-map-marker"></i></span>

                <div class="info-box-content">
                  <span class="info-box-text">UAE (Click to view)</span>
                  <span class="info-box-number">3 Inspectors | 2 Jobs</span>
                </div>
              </div>
              <div class="info-box mb-3 bg-danger">
                <span class="info-box-icon"><i class="fa fa-map-marker"></i></span>

                <div class="info-box-content">
                  <span class="info-box-text">Asia (Click to view)</span>
                  <span class="info-box-number">3 Inspectors | 2 Jobs</span>
                </div>
              </div>
              <div class="info-box mb-3 bg-info">
                <span class="info-box-icon"><i class="fa fa-map-marker"></i></span>

                <div class="info-box-content">
                  <span class="info-box-text">Australia (Click to view)</span>
                  <span class="info-box-number">3 Inspectors | 2 Jobs</span>
                </div>
              </div> -->

              <!-- PRODUCT LIST -->
              <!-- <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Payments made to inspector</h3>
                </div>
                <div class="card-body p-0">
                  <ul class="products-list product-list-in-card pl-2 pr-2">
                    <li class="item">
                      <div class="product-img">
                        <img src="dist/img/default-150x150.png" alt="Product Image" class="img-size-50">
                      </div>
                      <div class="product-info">
                        <a href="javascript:void(0)" class="product-title">Samsung TV
                          <span class="badge badge-warning float-right">$1800</span></a>
                        <span class="product-description">
                          Samsung 32" 1080p 60Hz LED Smart HDTV.
                        </span>
                      </div>
                    </li>
                    <li class="item">
                      <div class="product-img">
                        <img src="dist/img/default-150x150.png" alt="Product Image" class="img-size-50">
                      </div>
                      <div class="product-info">
                        <a href="javascript:void(0)" class="product-title">Bicycle
                          <span class="badge badge-info float-right">$700</span></a>
                        <span class="product-description">
                          26" Mongoose Dolomite Men's 7-speed, Navy Blue.
                        </span>
                      </div>
                    </li>
                    <li class="item">
                      <div class="product-img">
                        <img src="dist/img/default-150x150.png" alt="Product Image" class="img-size-50">
                      </div>
                      <div class="product-info">
                        <a href="javascript:void(0)" class="product-title">
                          Xbox One <span class="badge badge-danger float-right">
                          $350
                        </span>
                        </a>
                        <span class="product-description">
                          Xbox One Console Bundle with Halo Master Chief Collection.
                        </span>
                      </div>
                    </li>
                    <li class="item">
                      <div class="product-img">
                        <img src="dist/img/default-150x150.png" alt="Product Image" class="img-size-50">
                      </div>
                      <div class="product-info">
                        <a href="javascript:void(0)" class="product-title">PlayStation 4
                          <span class="badge badge-success float-right">$399</span></a>
                        <span class="product-description">
                          PlayStation 4 500GB Console (PS4)
                        </span>
                      </div>
                    </li>

                  </ul>
                </div>
                <div class="card-footer text-center">
                  <a href="javascript:void(0)" class="uppercase">View All Products</a>
                </div>
              </div> -->
            </div>
          </div>

          <br>

          <br><br>

        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

  </section>
</template>

<script>
import moment from 'moment'
import 'vue-select/dist/vue-select.css';

export default {
  name: 'Dashboard', 
  data: () => ({
    start_date: '',
    end_date: '',
    count: {},
    months: [
      {label: 'All', code: '13'},
      {label: 'January', code: '01'},
      {label: 'February', code: '02'},
      {label: 'March', code: '03'},
      {label: 'April', code: '04'},
      {label: 'May', code: '05'},
      {label: 'June', code: '06'},
      {label: 'July', code: '07'},
      {label: 'August', code: '08'},
      {label: 'September', code: '09'},
      {label: 'October', code: '10'},
      {label: 'November', code: '11'},
      {label: 'December', code: '12'},
    ],
    month: '',
    years: [
      {label: '2020', code: '2020'},
      {label: '2021', code: '2021'},
    ],
    year: '2020',
    inspectorsMarker: [],
    jobsMarker: [],
    inspectorTabs: [],
    jobTabs: [],
    insJobMarker: [],

    insJobMarker: [],
    insAssignedJobMarker: [],
    insNoJobMarker: [],
    jobAssignedMarker: [],
    jobNotAssignedMarker: [],

    users: [],
    infoContent: '',
    infoWindowPos: {
      lat: 0,
      lng: 0
    },
    infoWinOpen: false,
    currentMidx: null,
    //optional: offset infowindow so it visually sits nicely on top of our marker
    infoOptions: {
      pixelOffset: {
        width: 0,
        height: -35
      }
    },
  }),
  created() {
    // Get current month
    this.month = moment().format('MM')
    this.start_date = moment().startOf('month').format('DD-MM-YYYY')
    this.end_date = moment().endOf('month').format('DD-MM-YYYY')
  },
  async mounted() {
    this.search()
  },
  methods: {
    async getData() {
      // let count = await this.$axios.get('count')
      // count = this.count.data.data
      // console.log(count)
      this.inspectorTabs = [
        { name: 'Total No. of Inspectors', icon: 'fas fa-users', color: 'bg-info', count: this.count.inspectors.total },
        { name: 'No. of Inspectors Engaged', icon: 'fas fa-users-cog', color: 'bg-danger', count: this.count.inspectors.engaged },
        { name: 'No. of Inspectors on Leave', icon: 'fas fa-skiing', color: 'bg-success', count: this.count.inspectors.on_leave },
        { name: 'Inspectors with no Job', icon: 'fas fa-user-lock', color: 'bg-warning', count: this.count.inspectors.no_job },
      ]
      this.jobTabs = [
        { name: 'On Going Jobs', icon: 'fas fa-briefcase', color: 'bg-info', count: this.count.jobs.on_going },
        // { name: 'Completed Jobs', icon: 'fas fa-tasks', color: 'bg-danger', count: this.count.jobs.completed },
        { name: 'New Jobs With No Inspector', icon: 'fas fa-network-wired', color: 'bg-success', count: this.count.jobs.no_inspector },
        // { name: 'No of Inspections Cancelled', icon: 'far fa-window-close', color: 'bg-warning', count: this.count.jobs.cancelled },
      ]
    },
    customStartDateFormatter(date) {
      this.start_date = moment(date).format('DD-MM-YYYY');
      return moment(date).format('DD-MM-YYYY');
    },
    customEndDateFormatter(date) {
      this.end_date = moment(date).format('DD-MM-YYYY');
      return moment(date).format('DD-MM-YYYY');
    },
    changeFilter() {
      if(this.month == 13) {
        this.start_date = moment().month(0).year(this.year).startOf('month').format('DD-MM-YYYY')
        this.end_date = moment().month(11).year(this.year).endOf('month').format('DD-MM-YYYY')
      }
      else {
        this.start_date = moment().month(this.month - 1).year(this.year).startOf('month').format('DD-MM-YYYY')
        this.end_date = moment().month(this.month - 1).year(this.year).endOf('month').format('DD-MM-YYYY')
      }
    },
    async search() {
      let response = await this.$axios.get(`/count?start_date=${this.start_date}&end_date=${this.end_date}`)
      this.count = response.data.data
      this.users = response.data.users
      this.getData()
      this.getInspectorsLocation()
    },
    async getInspectorsLocation() {
      this.inspectorsMarker = []
      this.jobsMarker = []
      let inspectors = await this.$axios.get(`/users?role_id=3`)
      inspectors = inspectors.data.data

      let onGoingJobs = await this.$axios.get(`jobs?type=ongoing&start_date=${this.start_date}&end_date=${this.end_date}`) 
      onGoingJobs = onGoingJobs.data.data
      for(const inspector of inspectors) {
        let inspectorAddress = ''
        let jobAddress = ''
        for(const address of inspector.addresses) {

          let checkIfSame = false
          for(const onGoingJob of onGoingJobs) {

            let user = onGoingJob.users.find(user => user.id == inspector.id)
            // console.log(onGoingJob)
            // console.log(user)
            if(user) {
              // Inspector Accepted the Job
              if(user.pivot.status == 1) {
                checkIfSame = true
                // If Coordinates are there
                if(onGoingJob.lat != null) 
                {
                  // If the job is today
                  let today = moment().format('DD-MM-YYYY')

                  let eta = onGoingJob.eta
                  let etb = onGoingJob.eta
                  let ets = onGoingJob.eta
                  if(today == eta || today == etb || today == ets)
                    this.getLatLngFromAddress(onGoingJob.lat, onGoingJob.lng, 2, inspector, onGoingJob)
                  else {
                    this.getLatLngFromAddress(address.lat, address.lng, 1, inspector, onGoingJob)
                    this.getLatLngFromAddress(onGoingJob.lat, onGoingJob.lng, 11, inspector, onGoingJob)
                  }
                }
                // If inspector accepted, then remove job from list
                onGoingJobs = onGoingJobs.filter(job => job.id != onGoingJob.id)
              }
              // // If inspector not responded to the job
              // else {
              //   // If Coordinates are there
              //   if(onGoingJob.lat != null) 
              //     await this.getLatLngFromAddress(onGoingJob.lat, onGoingJob.lng, 3, inspector)
              // }
            }
            // If no inspector is assigned for the job
            else if(onGoingJob.users.length == 0) {
              if(onGoingJob.lat != null) 
                this.getLatLngFromAddress(onGoingJob.lat, onGoingJob.lng, 4, null, onGoingJob)
              // If no inspector assigned the job, then remote job from list
              onGoingJobs = onGoingJobs.filter(job => job.id != onGoingJob.id)
            } 
          }
          // If inspector has no job
          if(!checkIfSame && address.lat != null && address.lat != '') 
            this.getLatLngFromAddress(address.lat, address.lng, 5, inspector, null)
        }
      }

      // Once Marker for Jobs which are assigned and jobs which are not assigned are plotted, we will plot for jobs which are alloted but inspector has not responded
      for(const onGoingJob of onGoingJobs) {
        // If Coordinates are there
        if(onGoingJob.lat != null) 
          this.getLatLngFromAddress(onGoingJob.lat, onGoingJob.lng, 3, null, onGoingJob)
      }
      // console.log('Ins Marker')
      // console.log(this.inspectorsMarker)
      // console.log('Job Marker')
      // console.log(this.jobsMarker)
    },
    // Type 1 & 11: Inspector Accepted the job but job is not today
    // Type 2: Inspector Accepted the job and job is today
    // Type 3: Inspector Assigned the job, but not responded to the job
    // Type 4: No inspector is assigned the job
    // Type 5: If inspector has no job

    // type = 1 : Update Inspector Marker
    // type = 2 : Update Job Marker
    // type = 3 : Update Both Marker
    async getLatLngFromAddress(lat, lng, type, user, job) {
      if(type == 1) {
        this.insAssignedJobMarker.push({
          position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          user: user,
          job: job,
        })
      }
      if(type == 11) {
        this.jobAssignedMarker.push({
          position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          user: user,
          job: job,
        })
      }
      if(type == 2) {
        this.insJobMarker.push({
          position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          user: user,
          job: job,
        })
      }
      if(type == 3 || type == 4) {
        this.jobNotAssignedMarker.push({
          position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          user: user,
          job: job,
        })
      }
      if(type == 5) {
        this.insNoJobMarker.push({
          position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          user: user,
          job: job,
        })
      }
      // if(type == 1)
      //   this.inspectorsMarker.push({
      //     position: {
      //       lat: parseFloat(lat),
      //       lng: parseFloat(lng)
      //     },
      //     user: user,
      //   })
      // if(type == 2)
      //   this.jobsMarker.push({
      //     position: {
      //       lat: parseFloat(lat),
      //       lng: parseFloat(lng)
      //     },
      //     user: user,
      //   }) 
      // if(type == 3) {
      //   this.insJobMarker.push({
      //     position: {
      //       lat: parseFloat(lat),
      //       lng: parseFloat(lng)
      //     },
      //     user: user,
      //   })
      // }
    },
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = this.getInfoWindowContent(marker);
      

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },

    getInfoWindowContent: function (marker) {
      let user = null
      let job = null
      if(marker.user) 
        user = marker.user
      if(marker.job) 
        job = marker.job
      return (`<div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">${user ? (user.first_name + ' ' + user.last_name) : ''}</p>
              <p class="title is-4">${job ? (job.vessel_name + ' ETA:' + job.eta) : ''}</p>
            </div>
          </div>
        </div>
      </div>`);
    },
  }
}
</script>
