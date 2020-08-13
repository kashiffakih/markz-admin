<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Orders</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Orders</li>
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
              <input type="text" class="form-control" v-model="searchData" @keydown.enter="search" placeholder="Search by order id">
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Orders</h3> &nbsp;&nbsp;
                  <nuxt-link class="btn btn-sm btn-info float-sm-right" :to="`/organizations/${organization.value}/orders/create`">Add New</nuxt-link>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Order Details</th>
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
                        <td class="w-1">
                          <!-- <a target="_blank" :href="`${baseUrl}/orders/${order.id}/invoice`">
                            Invoice
                          </a>&nbsp;&nbsp;
                           <a target="_blank" :href="`${baseUrl}/orders/${order.id}/order`">
                            Order
                          </a>&nbsp;&nbsp; -->
                          <nuxt-link title="Edit Details" class="icon" :to="`/organizations/${organization.value}/orders/${order.id}`">
                            <i class="fa fa-edit"></i>
                          </nuxt-link>&nbsp;&nbsp;
                          <nuxt-link title="Delete Inspector" class="icon" to="">
                            <span @click="del(order.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>
                          {{ order.id }}
                        </td>
                        <td>{{ order.user ? (order.user.first_name + ' ' + order.user.middle_name + ' ' + order.user.last_name) : '' }}</td>
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
                                <td>{{ detail.product ? detail.product.name : '' }}</td>
                                <td>{{ detail.quantity }}</td>
                                <td>{{ detail.order_detail_cost }} INR</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td>{{ order.created_at }}</td>
                        <td>
                          {{ order.order_cost ? parseInt(order.order_cost).toFixed(2) : '-' }} INR
                        </td>
                        <td>
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  Order Received
                                </td>
                                <td>
                                  {{ order.created_at }}
                                </td>
                              </tr>
                              <tr
                                v-for="(status,d) in order.order_statuses"
                                :key="`status${d}`"
                              >
                                <td>
                                  {{ status.status.name }}
                                  <nuxt-link title="Edit Details" class="icon" :to="`/organizations/${organization.value}/orders/${order.id}/order-statuses/${status.id}`">
                                    <i class="fa fa-edit"></i>
                                  </nuxt-link>
                                </td>
                                <td>
                                  {{ status.created_at }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <nuxt-link class="btn btn-sm btn-info" :to="`/organizations/${organization.value}/orders/${order.id}/order-statuses/create`">
                           Update Status
                         </nuxt-link>
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
import moment_timezone from 'moment-timezone'

export default {
  name: 'ManageOrders',
  data:() =>  ({
    searchData: '',
    items: [],
    loading: true,
    fmt: "YYYY-MM-DD hh:mm:ss A",
    time_zone: 'Asia/Kolkata'
  }),
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.items = []
      this.loading = true
      let items = await this.$axios.get(`/orders`)
      items = items.data.data
      items.forEach(item => {
        if(item.user == null)
          item.user = {}
        else {
          item.user.bill_prefix = item.user.bill_prefix  ? item.user.bill_prefix + ', ' : ''
          item.user.bill_first_name = item.user.bill_first_name  ? item.user.bill_first_name + ' ' : ''
          item.user.bill_last_name = item.user.bill_last_name  ? item.user.bill_last_name + ', ' : ''
          item.user.bill_flat_no = item.user.bill_flat_no  ? item.user.bill_flat_no + ', ' : ''
          item.user.bill_building_name = item.user.bill_building_name  ? item.user.bill_building_name + ', ' : ''
          item.user.bill_email = item.user.bill_email  ? item.user.bill_email + ', ' : ''
          item.user.bill_phone = item.user.bill_phone  ? item.user.bill_phone + ', ' : ''
          item.user.bill_street_name = item.user.bill_street_name  ? item.user.bill_street_name + ', ' : ''
          item.user.bill_address = item.user.bill_address  ? item.user.bill_address + ', ' : ''
          item.user.bill_other_details = item.user.bill_other_details  ? item.user.bill_other_details + ', ' : ''
          item.user.bill_nationality = item.user.bill_nationality  ? item.user.bill_nationality + ', ' : ''

          item.user.prefix = item.user.prefix  ? item.user.prefix + ', ' : ''
          item.user.first_name = item.user.first_name  ? item.user.first_name + ' ' : ''
          item.user.last_name = item.user.last_name  ? item.user.last_name + ', ' : ''
          item.user.flat_no = item.user.flat_no  ? item.user.flat_no + ', ' : ''
          item.user.building_name = item.user.building_name  ? item.user.building_name + ', ' : ''
          item.user.email = item.user.email  ? item.user.email + ', ' : ''
          item.user.phone = item.user.phone  ? item.user.phone + ', ' : ''
          item.user.street_name = item.user.street_name  ? item.user.street_name + ', ' : ''
          item.user.address = item.user.address  ? item.user.address + ', ' : ''
          item.user.other_details = item.user.other_details  ? item.user.other_details + ', ' : ''
          item.user.nationality = item.user.nationality  ? item.user.nationality + ', ' : ''
        }
        item.created_at = moment(this.convertToDubaiTime(item.created_at)).format('DD-MM-YYYY hh:mm:ss')
        item.order_statuses.forEach(status => {
          status.created_at = moment(this.convertToDubaiTime(status.created_at)).format('DD-MM-YYYY hh:mm:ss')
        })
      })
      this.items = items

      this.loading = false
    },
    async search() {
      if(this.searchData != "")
      {
        this.loading = true
        let items = await this.$axios.get(`/orders?search=${this.searchData}`);
        this.items = items.data.data
        this.loading = false
      }
    },
    async del(id) {
      let r = confirm('Are you sure you want to delete the data?')
      if(r == true)
        await this.$axios.delete(`/orders/${id}`)
      this.getData()
    },
    convertToDubaiTime(time) {
      // construct a moment object
      var m = moment.tz(time, this.fmt, this.time_zone);

      // convert it to utc
      m.tz('Asia/Dubai');

      // format it for output
      var s = m.format(this.fmt)

      return s
    }
  },
}
</script>