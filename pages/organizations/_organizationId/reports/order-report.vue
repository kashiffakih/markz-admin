<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Order Report</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Order Report</li>
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
            <div class="col-12">
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
              <br>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Order Report</h3>
                  <h3 class="card-title float-sm-right">Total Earnings: {{ totalEarnings }} AED</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Order Details</th>
                        <th>Message</th>
                        <th>Order Date & Time</th>
                        <th>Order Cost</th>
                        <th>Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-if="loading"
                      > 
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(order, i) in items"
                        :key="`order${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td>{{ order.id }}</td>
                        <td>{{ order.user ? order.user.name : '' }}</td>
                        <td>
                          <table>
                            <thead>
                              <tr>
                                <th>Sr No</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(detail,d) in order.order_details"
                                :key="`detail${d}`"
                              >
                                <td>{{ d + 1 }}</td>
                                <td>{{ detail.product.name }}</td>
                                <td>{{ detail.quantity }}</td>
                                <td>{{ detail.order_detail_cost }} AED</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td>{{ order.details }}</td>
                        <td>{{ order.created_at }}</td>
                        <td>{{ order.order_cost }} AED</td>
                        <td>
                          {{ order.order_statuses.length == 0 ? 'Order Received' : '' }}
                          <table>
                            <tbody>
                              <tr
                                v-for="(status,d) in order.order_statuses"
                                :key="`status${d}`"
                              >
                                <td>
                                  {{ status.status.name }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
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
import moment from 'moment'

export default {
  name: 'ManageOrderReports',
  data:() =>  ({
    searchData: '',
    items: [],
    loading: true,
    date: '',
    totalEarnings: 0,
  }),
  mounted() {
    // this.getData()
    this.loading = false
  },
  methods: {
    customDateFormatter(date) {
      this.date = moment(date).format('YYYY-MM-DD')
      return moment(date).format('YYYY-MM-DD');
    },
    async getData() {
      this.items = []
      this.loading = true
      let items = await this.$axios.get(`/orders`)
      this.items = items.data.data
      this.loading = false
    },
    async search() {
      if(this.date != "")
      {
        this.loading = true
        let items = await this.$axios.get(`/orders?date=${this.date}`);
        this.items = items.data.data
        this.totalEarnings = 0
        this.items.forEach(item => {
          this.totalEarnings += parseFloat(item.order_cost)
        })
        this.loading = false
      }
    },
  },
}
</script>