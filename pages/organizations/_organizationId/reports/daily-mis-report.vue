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

              <h1 class="m-0 text-dark">Daily MIS Report ({{ date }})</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Daily MIS Report</li>
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
                  class="col-md-3"
                  style="
                    background-color: white;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px;
                  "
                >
                  <v-select
                    v-model="timeslot"
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
                  <button
                    class="btn btn-sm btn-info btn-block"
                    @click="getProducts"
                  >
                    Get Report
                  </button>
                </div>
                <!-- Premium Export Button -->
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
                    <download-excel
                      class="btn btn-excel btn-block"
                      :data="excel_items"
                      :fields="excel_fields"
                      worksheet="Daily MIS Report"
                      name="DailyMISReport.xls"
                    >
                      <i class="fas fa-file-excel mr-2"></i> Export
                    </download-excel>
                  </client-only>
                </div>
              </div>
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">MIS Report</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Product Name</th>
                        <th>Origin</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="4">Loading...</td>
                      </tr>
                      <tr v-for="(product, i) in products" :key="`product${i}`">
                        <td>{{ i + 1 }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.origin }}</td>
                        <td>{{ product.qty }} {{ product.unit }}</td>
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
    let s = await $axios.get(`/delivery_time_slots`);
    s = s.data.data;
    let statuses = [];
    statuses.push({
      label: "Select Time Slot",
      code: "",
    });
    s.forEach((status) => {
      statuses.push({
        label: status.time_slot,
        code: status.time_slot,
      });
    });
    return {
      statuses: statuses,
    };
  },
  data: () => ({
    searchData: "",
    items: [],
    products: [],
    loading: true,
    date: "",
    totalEarnings: 0,
    timeslot: "",
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
    this.date = moment().format("YYYY-MM-DD");
    this.search();
    this.loading = false;
  },
  methods: {
    async search() {
      if (this.date != "") {
        this.loading = true;
        let items = await this.$axios.get(`/orders?date=${this.date}`);
        this.items = items.data.data;
        this.loading = false;
      }
      this.getExcelItems();
    },
    async getProducts() {
      if (!this.timeslot) {
        await this.$root.alert("Please select time slot");
      }
      this.products = [];
      let items = this.items.filter(
        (item) => item.delivery_time == this.timeslot
      );
      items.forEach((item) => {
        let products = [];
        item.order_details.forEach((detail) => {
          let prod = products.find((p) => p.id == detail.product_id);
          if (prod) prod.qty += parseFloat(detail.quantity);
          else {
            products.push({
              id: detail.product_id,
              name: detail.product.name,
              origin: detail.product.location,
              qty: detail.quantity,
              unit: detail.unit.name,
            });
          }
          this.products = products;
        });
      });
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
                detail.product.name +
                "( " +
                detail.quantity +
                " " +
                detail.unit.name +
                ")<br>"
              );
            })}
          `,
          message: order.details,
          order_date: order.created_at,
          order_cost: order.order_cost,
          order_status: `
            ${order.order_statuses.map((status) => {
              return status.status.name + "<br>";
            })}
          `,
        });
      });
    },
    convertToDubaiTime(time) {
      // construct a moment object
      var m = moment.tz(time, this.fmt, this.time_zone);

      // convert it to utc
      m.tz("Asia/Dubai");

      // format it for output
      var s = m.format(this.fmt);

      return s;
    },
  },
};
</script>
