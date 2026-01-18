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

              <h1 class="m-0 text-dark">Orders</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Orders</li>
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
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <input
                  type="text"
                  class="form-control w-50"
                  v-model="searchData"
                  @keydown.enter="search"
                  placeholder="Search by order id"
                />
                <div>
                  <a class="refresh mr-3" href="#" @click="getData">Refresh</a>
                  <client-only>
                    <download-excel
                      class="btn btn-excel d-inline-block"
                      :data="excel_items"
                      :fields="excel_fields"
                      worksheet="Orders"
                      name="Orders.xls"
                    >
                      <i class="fas fa-file-excel mr-2"></i> Export
                    </download-excel>
                  </client-only>
                </div>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Orders</h3>
                  &nbsp;&nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/organizations/${organization.value}/orders/create`"
                    >Add New</nuxt-link
                  >
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <th>Order Status</th>
                        <th v-if="$route.query.search == 'all'">Store</th>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Order Details</th>
                        <th>Order Date & Time</th>
                        <th>Order Cost</th>
                        <th>Delivery Boy Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr
                        v-for="(order, i) in paginatedItems"
                        :key="`order${i}`"
                      >
                        <td>{{ (currentPage - 1) * perPage + i + 1 }}</td>
                        <td class="w-1">
                          <!-- <a target="_blank" :href="`${baseUrl}/orders/${order.id}/invoice`">
                            Invoice
                          </a>&nbsp;&nbsp;
                           <a target="_blank" :href="`${baseUrl}/orders/${order.id}/order`">
                            Order
                          </a>&nbsp;&nbsp; -->
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/organizations/${organization.value}/orders/${order.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            title="Delete Inspector"
                            class="icon"
                            to=""
                          >
                            <span @click="del(order.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>
                          <table>
                            <tbody>
                              <tr>
                                <td>Order Received</td>
                                <td>
                                  {{ order.created_at }}
                                </td>
                              </tr>
                              <tr
                                v-for="(status, d) in order.order_statuses"
                                :key="`status${d}`"
                              >
                                <td>
                                  {{ status.status ? status.status.name : "" }}
                                  <nuxt-link
                                    title="Edit Details"
                                    class="icon"
                                    :to="`/organizations/${organization.value}/orders/${order.id}/order-statuses/${status.id}`"
                                  >
                                    <i class="fa fa-edit"></i>
                                  </nuxt-link>
                                </td>
                                <td>
                                  {{ status.created_at }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <nuxt-link
                            class="btn btn-sm btn-info"
                            :to="`/organizations/${organization.value}/orders/${order.id}/order-statuses/create`"
                          >
                            Update Status
                          </nuxt-link>
                          <nuxt-link
                            class="btn btn-sm btn-info"
                            :to="`/organizations/${organization.value}/orders/${order.id}/delivery-boys/create`"
                            v-if="$route.query.search == 'all'"
                          >
                            Assign Delivery Rider
                          </nuxt-link>
                        </td>
                        <td v-if="$route.query.search == 'all'">
                          {{ order.company ? order.company.name : "" }}
                        </td>
                        <td>
                          {{ order.id }}
                        </td>
                        <td>
                          {{
                            order.user
                              ? (order.user.first_name || "") +
                                " " +
                                (order.user.middle_name || "") +
                                " " +
                                (order.user.last_name || "")
                              : ""
                          }}
                        </td>
                        <td>
                          <table>
                            <thead>
                              <tr>
                                <th>Sr No</th>
                                <th>Name</th>
                                <th>Pack</th>
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
                                <td>{{ detail.product_pack }}</td>
                                <td>{{ detail.quantity }}</td>
                                <td>{{ detail.order_detail_cost }} INR</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td>{{ order.created_at }}</td>
                        <td>
                          {{
                            order.order_cost
                              ? parseInt(order.order_cost).toFixed(2)
                              : "-"
                          }}
                          INR
                        </td>
                        <td>
                          {{
                            order.delivery_boy
                              ? order.delivery_boy.first_name
                              : "Not Assigned"
                          }}
                          <br />
                          <span v-if="order.is_delivery_boy_accepted == 0"
                            >Pending</span
                          >
                          <span v-if="order.is_delivery_boy_accepted == 1"
                            >Accepted</span
                          >
                          <span v-if="order.is_delivery_boy_accepted == 2"
                            >Not Accepted</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
                <Pagination
                  v-if="items.length > 0"
                  :total-items="items.length"
                  :per-page="perPage"
                  :current-page="currentPage"
                  @page-changed="onPageChanged"
                  @per-page-changed="onPerPageChanged"
                />
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
import Pagination from "@/components/Pagination.vue";
import moment from "moment";
import moment_timezone from "moment-timezone";

export default {
  name: "ManageOrders",
  components: {
    BackButton,
    Pagination,
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    fmt: "YYYY-MM-DD hh:mm:ss A",
    fmt: "YYYY-MM-DD hh:mm:ss A",
    time_zone: "Asia/Kolkata",
    searchData: "",
    excel_fields: {
      "Order ID": "id",
      User: "user_name",
      Date: "created_at",
      Cost: "order_cost",
      Status: "status_label",
    },
    excel_items: [],
    currentPage: 1,
    perPage: 10,
  }),
  mounted() {
    if (this.$route.query.search) this.searchData = this.$route.query.search;
    this.getData();
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    },
  },
  methods: {
    onPageChanged(page) {
      this.currentPage = page;
    },
    onPerPageChanged(perPage) {
      this.perPage = perPage;
      this.currentPage = 1;
    },
    async getData() {
      this.items = [];
      this.loading = true;
      let items = await this.$axios.get(
        `/orders?search=${this.searchData}&cityId=${this.city.id}`
      );
      items = items.data.data;
      items.forEach((item) => {
        if (item.user == null) item.user = {};
        else {
          item.user.bill_prefix = item.user.bill_prefix
            ? item.user.bill_prefix + ", "
            : "";
          item.user.bill_first_name = item.user.bill_first_name
            ? item.user.bill_first_name + " "
            : "";
          item.user.bill_last_name = item.user.bill_last_name
            ? item.user.bill_last_name + ", "
            : "";
          item.user.bill_flat_no = item.user.bill_flat_no
            ? item.user.bill_flat_no + ", "
            : "";
          item.user.bill_building_name = item.user.bill_building_name
            ? item.user.bill_building_name + ", "
            : "";
          item.user.bill_email = item.user.bill_email
            ? item.user.bill_email + ", "
            : "";
          item.user.bill_phone = item.user.bill_phone
            ? item.user.bill_phone + ", "
            : "";
          item.user.bill_street_name = item.user.bill_street_name
            ? item.user.bill_street_name + ", "
            : "";
          item.user.bill_address = item.user.bill_address
            ? item.user.bill_address + ", "
            : "";
          item.user.bill_other_details = item.user.bill_other_details
            ? item.user.bill_other_details + ", "
            : "";
          item.user.bill_nationality = item.user.bill_nationality
            ? item.user.bill_nationality + ", "
            : "";

          item.user.prefix = item.user.prefix ? item.user.prefix + ", " : "";
          item.user.first_name = item.user.first_name
            ? item.user.first_name + " "
            : "";
          item.user.last_name = item.user.last_name
            ? item.user.last_name + ", "
            : "";
          item.user.flat_no = item.user.flat_no ? item.user.flat_no + ", " : "";
          item.user.building_name = item.user.building_name
            ? item.user.building_name + ", "
            : "";
          item.user.email = item.user.email ? item.user.email + ", " : "";
          item.user.phone = item.user.phone ? item.user.phone + ", " : "";
          item.user.street_name = item.user.street_name
            ? item.user.street_name + ", "
            : "";
          item.user.address = item.user.address ? item.user.address + ", " : "";
          item.user.other_details = item.user.other_details
            ? item.user.other_details + ", "
            : "";
          item.user.nationality = item.user.nationality
            ? item.user.nationality + ", "
            : "";
        }
        item.created_at = moment(
          this.convertToDubaiTime(item.created_at)
        ).format("DD-MM-YYYY hh:mm:ss");
        item.order_statuses.forEach((status) => {
          status.created_at = moment(
            this.convertToDubaiTime(status.created_at)
          ).format("DD-MM-YYYY hh:mm:ss");
        });
      });
      this.items = items;

      this.items = items;
      this.prepareExcelData();
      this.loading = false;
    },
    prepareExcelData() {
      this.excel_items = this.items.map((item) => ({
        id: item.id,
        user_name: item.user
          ? (item.user.first_name || "") + " " + (item.user.last_name || "")
          : "",
        created_at: item.created_at,
        order_cost: item.order_cost,
        status_label:
          item.order_statuses.length > 0
            ? item.order_statuses[item.order_statuses.length - 1].status.name
            : "Placed",
      }));
    },
    async search() {
      if (this.searchData != "") {
        this.loading = true;
        let items = await this.$axios.get(`/orders?search=${this.searchData}`);
        this.items = items.data.data;
        this.loading = false;
      }
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(`/orders/${id}`);
        this.getData();
      }
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
