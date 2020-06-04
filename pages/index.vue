<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Dashboard (Daily Updates) {{ date }}</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Dashboard (Daily Updates)</li>
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
            <div class="col-md-2">
              <client-only>
                <date-picker
                  placeholder="YYYY-MM-DD"
                  :format="customDateFormatter"
                  value="date"
                />
              </client-only>
            </div>
            <div class="col-md-2">
              <button class="btn btn-sm btn-info btn-block"
                @click="search"
              >
                Search
              </button>
            </div>
          </div>
          <br><br>
          <!-- Small boxes (Stat box) -->
          <div class="row">
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>{{ loading ? 'Loading...' : count.new_order }}</h3>
                  <p>New Orders</p>
                </div>
                <div class="icon">
                  <i class="ion ion-bag"></i>
                </div>
                <nuxt-link :to="`/organizations/${organization.value}/reports/order-report?date=${date}`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>{{ loading ? 'Loading...' : count.order_processing }}</h3>

                  <p>Order Processing</p>
                </div>
                <div class="icon">
                  <i class="ion ion-person-add"></i>
                </div>
                <nuxt-link :to="`/organizations/${organization.value}/reports/order-report?date=${date}`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>{{ loading ? 'Loading...' : count.order_completed }}</h3>
                  <p>Order Processed</p>
                </div>
                <div class="icon">
                  <i class="ion ion-stats-bars"></i>
                </div>
                <nuxt-link :to="`/organizations/${organization.value}/reports/order-report?date=${date}`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-success">
                <div class="inner">
                  <p>Process Cart</p>
                </div>
                <div class="icon">
                  <i class="ion ion-stats-bars"></i>
                </div>
                <a href="http://localhost:3018/organizations/1/shipping-details-1" target="_blank" class="small-box-footer">Click Here <i class="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            <!-- ./col -->
          </div>
          <!-- /.row -->
        </div>
      </section>

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
    date: moment().format('YYYY-MM-DD'),
    count: {},
    loading: false
  }),
  mounted() {
    this.search()
  },
  methods: {
    customDateFormatter(date) {
      this.date = moment(date).format('YYYY-MM-DD')
      return moment(date).format('YYYY-MM-DD');
    },
    async search() {
      if(this.date != "")
      {
        this.loading = true
        let items = await this.$axios.get(`/count?date=${this.date}`);
        this.count = items.data.data
        this.loading = false
      }
    },
  }
}
</script>
