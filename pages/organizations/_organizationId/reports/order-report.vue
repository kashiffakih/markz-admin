<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />

              <h1 class="m-0 text-dark">Order Report ({{ date }})</h1>
              <br />
              <client-only>
                <download-excel
                  class="btn btn-default"
                  :data="excel_items"
                  :fields="excel_fields"
                  worksheet="Order Repoort"
                  name="OrderReport.xls"
                >
                  <a href="#" class="download">export to excel</a>
                </download-excel>
              </client-only>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Order Report</li>
              </ol>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div
                  class="col-md-2"
                  style="
                    background-color: white;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px;
                  "
                >
                  <client-only>
                    <date-picker
                      placeholder="YYYY-MM-DD"
                      :format="customDateFormatter"
                      value="date"
                    />
                  </client-only>
                </div>
                <div
                  class="col-md-2"
                  style="
                    background-color: white;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px;
                  "
                >
                  <v-select
                    v-model="status_id"
                    :reduce="(status) => status.code"
                    :options="statuses"
                  ></v-select>
                </div>
                <div
                  class="col-md-2"
                  style="
                    background-color: white;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px;
                  "
                >
                  <button class="btn btn-sm btn-info btn-block" @click="search">
                    Search
                  </button>
                </div>
              </div>
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Order Report</h3>
                  <h3 class="card-title float-sm-right">
                    Total Earnings: {{ totalEarnings }} AED
                  </h3>
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
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(order, i) in items" :key="`order${i}`">
                        <td>{{ i + 1 }}</td>
                        <td>{{ order.id }}</td>
                        <td>{{ order.user ? order.user.name : "" }}</td>
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
                                v-for="(detail, d) in order.order_details"
                                :key="`detail${d}`"
                              >
                                <td>{{ d + 1 }}</td>
                                <td>
                                  {{
                                    detail.product ? detail.product.name : ""
                                  }}
                                </td>
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
                          {{
                            order.order_statuses.length == 0
                              ? "Order Received"
                              : ""
                          }}
                          <table>
                            <tbody>
                              <tr
                                v-for="(status, d) in order.order_statuses"
                                :key="`status${d}`"
                              >
                                <td>
                                  {{ status.status ? status.status.name : 'N/A' }}
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
import BackButton from "@/components/BackButton.vue";
import moment from "moment";
import "vue-select/dist/vue-select.css";
import moment_timezone from "moment-timezone";

export default {
  name: "ManageOrderReports",
  components: {
    BackButton,
  },
  async asyncData({ $axios, params }) {
    let s = await $axios.get(`/statuses`);
    s = s.data.data;
    let statuses = [];
    statuses.push({
      label: "Select Status",
      code: "",
    });
    s.forEach((status) => {
      statuses.push({
        label: status.name,
        code: status.id,
      });
    });
    return {
      statuses: statuses,
    };
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    date: "",
    totalEarnings: 0,
    status_id: "",
    excel_fields: {
      "Sr No": "sr_no",
      User: "user",
      "Order ID": "order_id",
      "Order Details": "order_details",
      Message: "message",
      "Order Data & Time": "order_date",
      "Order Cost": "order_cost",
      "Order Status": "order_status",
    },
    excel_items: [],
    fmt: "YYYY-MM-DD hh:mm:ss A",
    time_zone: "Asia/Kolkata",
  }),
  mounted() {
    this.date = this.$route.query.date;
    this.statusId = this.$route.query.statusId;
    this.search();
    this.loading = false;
  },
  methods: {
    customDateFormatter(date) {
      this.date = moment(date).format("YYYY-MM-DD");
      return moment(date).format("YYYY-MM-DD");
    },
    async getData() {
      this.items = [];
      this.loading = true;
      let items = await this.$axios.get(`/orders`);
      this.items = items.data.data;
      this.loading = false;
    },
    async search() {
      if (this.date != "") {
        this.loading = true;
        let items = await this.$axios.get(
          `/orders?date=${this.date}&statusId=${this.status_id}`
        );
        this.items = items.data.data;
        this.totalEarnings = 0;
        this.items.forEach((item) => {
          item.created_at = moment(
            this.convertToDubaiTime(item.created_at)
          ).format("DD-MM-YYYY hh:mm:ss");
          this.totalEarnings += parseFloat(item.order_cost);
        });
        this.loading = false;
      }
      this.getExcelItems();
    },
    getExcelItems() {
      this.items.forEach((order, i) => {
        this.excel_items.push({
          sr_no: i + 1,
          user: order.user ? order.user.name : "",
          order_id: order.id,
          order_details: `
            ${order.order_details.map((detail) => {
              return (
                (detail.product ? detail.product.name : 'N/A') +
                "( " +
                detail.quantity +
                " " +
                (detail.unit ? detail.unit.name : 'N/A') +
                ")<br>"
              );
            })}
          `,
          message: order.details,
          order_date: order.created_at,
          order_cost: order.order_cost,
          order_status: `
            ${order.order_statuses.map((status) => {
              return (status.status ? status.status.name : 'N/A') + "<br>";
            })}
          `,
        });
      });
    },
    convertToDubaiTime(time) {
      // construct a moment object - handle multiple possible input formats
      var m = moment(time, ["YYYY-MM-DD hh:mm:ss A", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true);
      
      if (!m.isValid()) {
        // If the input format is invalid, return the original value
        return time;
      }

      // convert to target timezone
      m.tz("Asia/Dubai");

      // format it for output
      var s = m.format(this.fmt);

      return s;
    },
  },
};
</script>
