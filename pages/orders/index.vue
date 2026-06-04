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
              <input
                type="text"
                class="form-control"
                v-model="searchData"
                @keydown.enter="search"
                placeholder="Search by order id"
              />
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br />
              <br />
              <div class="card">
                <!-- Role Filter (New) -->
                <div class="col-md-12" style="padding: 10px">
                  <div class="row">
                    <div class="col-sm-3">
                      <v-select
                        v-model="category_id"
                        :reduce="(category) => category.code"
                        :options="categories"
                        @input="filter"
                        placeholder="Select Category"
                      ></v-select>
                    </div>
                    <div class="col-sm-3">
                      <v-select
                        v-model="order_status_id"
                        :reduce="(status) => status.code"
                        :options="order_statuses"
                        @input="filter"
                        placeholder="Select Order Status"
                      ></v-select>
                    </div>
                    <div class="col-sm-3">
                      <v-select
                        v-model="role"
                        :reduce="(role) => role.code"
                        :options="roles"
                        @input="filter"
                        placeholder="Select Role"
                      ></v-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Orders</h3>
                  <!-- &nbsp;&nbsp; -->
                  <!-- <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/orders/create`"
                    >Add New</nuxt-link
                  > -->
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <!-- <th>Actions</th> -->
                        <th>Order Status</th>
                        <!-- <th>Delivery Boy Details</th>
                        <th>Store</th> -->
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Order Details</th>
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
                        <!-- <td class="w-1"> -->
                        <!-- <a target="_blank" :href="`${baseUrl}/orders/${order.id}/invoice`">
                            Invoice
                          </a>&nbsp;&nbsp;
                           <a target="_blank" :href="`${baseUrl}/orders/${order.id}/order`">
                            Order
                          </a>&nbsp;&nbsp; -->
                        <!-- <nuxt-link title="Edit Details" class="icon" :to="`/orders/${order.id}`">
                            <i class="fa fa-edit"></i>
                          </nuxt-link>&nbsp;&nbsp; -->
                        <!-- <nuxt-link title="Delete Inspector" class="icon" to="">
                            <span @click="del(order.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
 -->
                        <!-- </td> -->
                        <td>
                          <table>
                            <tbody>
                              <tr>
                                <td>Order Placed</td>
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
                                    :to="`/orders/${order.id}/order-statuses/${status.id}`"
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
                          <br />
                          <nuxt-link
                            class="btn btn-sm btn-info"
                            :to="`/orders/${order.id}/order-statuses/create`"
                          >
                            Update Status
                          </nuxt-link>
                          <!-- <nuxt-link
                            v-if="order.is_approved_by_hotelier"
                            class="btn btn-sm btn-info"
                            :to="`/orders/${order.id}/delivery-boys/create`"
                          >
                            Assign Delivery Rider
                          </nuxt-link>
                          <br /><br /> -->
                          <!-- <input
                            type="radio"
                            @change="approveOrder(order, 0)"
                            value="0"
                            v-model="order.is_approved_by_hotelier"
                          />
                          Not Yet Approved by Hotelier
                          <br />
                          <input
                            type="radio"
                            @change="approveOrder(order, 1)"
                            value="1"
                            v-model="order.is_approved_by_hotelier"
                          />
                          Is Approved by Hotelier
                          <br />
                          <input
                            type="radio"
                            @change="approveOrder(order, 2)"
                            value="2"
                            v-model="order.is_approved_by_hotelier"
                          />
                          Is Rejected by Hotelier -->
                        </td>
                        <!-- <td>
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
                        <td>{{ order.company ? order.company.name : "" }}</td> -->
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
                          <br />
                          <!-- <b>Role: </b>
                          {{
                            order.user.roles && order.user.roles.length > 0
                              ? order.user.roles[0].name
                              : "N/A"
                          }}
                          <br /> -->
                          <b>Phone: </b>
                          {{ order.user ? order.user.phone || "" : "" }}
                          <br />
                          <b>Address: </b>
                          {{
                            order.address
                              ? (order.address.add_1 || "") +
                                " " +
                                (order.address.add_2 || "") +
                                " " +
                                (order.address.add_3 || "") +
                                " " +
                                (order.address.state || "") +
                                " " +
                                (order.address.city || "") +
                                " " +
                                (order.address.pincode || "")
                              : (order.user.add_1 || "") +
                                " " +
                                (order.user.add_2 || "") +
                                " " +
                                (order.user.add_3 || "") +
                                " " +
                                (order.user.state || "") +
                                " " +
                                (order.user.city || "") +
                                " " +
                                (order.user.pincode || "")
                          }}
                        </td>
                        <td>
                          <button
                            type="button"
                            class="btn btn-sm btn-info"
                            @click="showOrderDetails(order)"
                          >
                            Order Details
                          </button>
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
      <!-- Order Details Modal -->
      <div
        class="modal fade"
        id="orderDetailsModal"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content" v-if="selectedOrder">
            <div class="modal-header">
              <h5 class="modal-title">Order #{{ selectedOrder.id }} Details</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h5>Items</h5>
              <table class="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Name</th>
                    <th>Colour</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(detail, d) in selectedOrder.order_details"
                    :key="`modal-detail${d}`"
                  >
                    <td>{{ d + 1 }}</td>
                    <td>
                      {{ detail.product ? detail.product.name : "" }}
                    </td>
                    <td>{{ detail.flavour || "N/A" }}</td>
                    <td>
                      {{
                        detail.product_pack
                          ? detail.product_pack.value
                          : "N/A"
                      }}
                    </td>
                    <td>{{ detail.quantity }}</td>
                    <td>{{ detail.order_detail_cost }} INR</td>
                  </tr>
                </tbody>
              </table>

              <div class="row mt-4">
                <div class="col-md-6">
                  <h5>Cost Breakdown</h5>
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Item total</td>
                        <td>
                          Rs. {{ parseFloat(selectedOrder.order_cost || 0).toFixed(2) }}
                        </td>
                      </tr>
                      <tr v-if="isMaharashtraOrder(selectedOrder)">
                        <td>CGST 2.5%</td>
                        <td>Rs. {{ (parseFloat(selectedOrder.tax_amount || 0) / 2).toFixed(2) }}</td>
                      </tr>
                      <tr v-if="isMaharashtraOrder(selectedOrder)">
                        <td>SGST 2.5%</td>
                        <td>Rs. {{ (parseFloat(selectedOrder.tax_amount || 0) / 2).toFixed(2) }}</td>
                      </tr>
                      <tr v-else>
                        <td>IGST 5%</td>
                        <td>Rs. {{ parseFloat(selectedOrder.tax_amount || 0).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td>Delivery charge</td>
                        <td>Rs. {{ parseFloat(selectedOrder.delivery_amount || 0).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td>Packing charge</td>
                        <td>Rs. {{ parseFloat(selectedOrder.packaging_amount || 0).toFixed(2) }}</td>
                      </tr>
                      <tr v-if="parseFloat(selectedOrder.platform_fee || 0) > 0">
                        <td>Platform Fee</td>
                        <td>Rs. {{ parseFloat(selectedOrder.platform_fee).toFixed(2) }}</td>
                      </tr>
                      <tr v-if="parseFloat(selectedOrder.coupon_amount || 0) > 0">
                        <td>Coupon Value</td>
                        <td>- Rs. {{ parseFloat(selectedOrder.coupon_amount).toFixed(2) }}</td>
                      </tr>
                      <tr v-if="selectedOrder.role !== 'Distributor' && parseFloat(selectedOrder.wallet_amount_used || 0) > 0">
                        <td>Reward</td>
                        <td>- Rs. {{ parseFloat(selectedOrder.wallet_amount_used).toFixed(2) }}</td>
                      </tr>
                      <tr style="font-weight: bold; border-top: 2px solid #ccc;">
                        <td>Grand Total</td>
                        <td>Rs. {{ parseFloat(selectedOrder.total_amount || 0).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-6">
                  <h5>Payment Info</h5>
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Details</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Payment Mode</td>
                        <td>
                          {{
                            selectedOrder.paymentmode != null
                              ? selectedOrder.paymentmode
                                  .split(" - Transaction ID: ")
                                  .map((str) => str.trim())[0]
                              : "N/A"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Payment Status</td>
                        <td>
                          {{
                            selectedOrder.paymentmode != null
                              ? selectedOrder.paymentmode.includes("Cash")
                                ? "Pending"
                                : "Done"
                              : "N/A"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Transaction ID</td>
                        <td>
                          {{
                            selectedOrder.paymentmode != null
                              ? selectedOrder.paymentmode
                                  .split(" - Transaction ID: ")
                                  .map((str) => str.trim())[1]
                              : "N/A"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
import Pagination from "@/components/Pagination.vue";
import moment from "moment";
// import moment_timezone from "moment-timezone";

export default {
  name: "ManageOrders",
  components: {
    BackButton,
    Pagination,
  },
  async asyncData({ $axios, params }) {
    let c = await $axios.get(`/categories`);
    c = c.data.data;
    let categories = [];
    categories.push({
      label: "Select Category",
      code: "",
      sub_categories: [],
    });
    c.forEach((cat) => {
      categories.push({
        label: cat.name,
        code: cat.id,
        sub_categories: cat.sub_categories,
      });
    });

    // Fetch order statuses
    let os = await $axios.get(`/statuses`);
    os = os.data.data;
    let order_statuses = [];
    order_statuses.push({
      label: "Select Order Status",
      code: "",
    });
    order_statuses.push({
      label: "Order Placed",
      code: 0,
    });
    os.forEach((status) => {
      order_statuses.push({
        label: status.name,
        code: status.id,
      });
    });

    return {
      categories: categories,
      order_statuses: order_statuses,
    };
  },
  data: () => ({
    selectedOrder: null,
    searchData: "",
    items: [],
    loading: true,
    fmt: "YYYY-MM-DD hh:mm:ss A",
    time_zone: "Asia/Kolkata",
    searchData: "",
    allItems: [],
    category_id: "",
    order_status_id: "",
    isApproved: [],
    meta: {}, // For storing pagination data
    current_page: 1,
    per_page: 10, // Default items per page
    currentPage: 1,

    perPage: 10,
    role: "",
    roles: [
      { label: "All Roles", code: "" },
      { label: "User", code: "User" },
      { label: "Distributor", code: "Distributor" },
    ],
  }),
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    },
  },
  methods: {
    showOrderDetails(order) {
      this.selectedOrder = order;
      const $ = window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#orderDetailsModal").modal("show");
      }
    },
    onPageChanged(page) {
      this.currentPage = page;
    },
    onPerPageChanged(perPage) {
      this.perPage = perPage;
      this.currentPage = 1;
    },
    isMaharashtraOrder(order) {
      // Check if order has address, otherwise use user's address
      const state = order.address
        ? order.address.state
        : order.user
        ? order.user.state
        : null;
      return state?.toString() === "Maharashtra";
    },
    async getData(page = 1) {
      this.items = [];
      this.loading = true;

      // Build query parameters - get ALL orders for client-side pagination
      // Use a large rowsPerPage value to get all records (backend doesn't support -1)
      let query = `/orders?rowsPerPage=10000`;

      // Add cityId as a separate parameter (if needed)
      if (this.city && this.city.id) {
        query += `&cityId=${this.city.id}`;
      }

      // Add category filter to server-side query if selected
      if (this.category_id) {
        query += `&category_id=${this.category_id}`;
      }

      // Add order status filter to server-side query if selected
      if (this.order_status_id) {
        query += `&order_status_id=${this.order_status_id}`;
      }

      // Add role filter
      if (this.role) {
        query += `&role=${this.role}`;
      }

      let response = await this.$axios.get(query);

      // Handle response based on whether it includes pagination metadata
      let data, meta;
      if (response.data.data && response.data.meta) {
        // Use Laravel's paginate response format
        data = response.data.data;
        meta = response.data.meta;
      } else {
        // Handle the old format without pagination
        data = response.data.data;
        // Create a basic meta object if backend doesn't provide it
        meta = {
          current_page: page,
          last_page: 1, // This will be incorrect but prevents errors
          per_page: this.per_page,
          total: data.length,
        };
      }

      this.meta = meta;

      data.forEach((item) => {
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
          this.convertToDubaiTime(item.created_at),
          this.fmt
        ).format("DD-MM-YYYY hh:mm:ss");
        item.order_statuses.forEach((status) => {
          status.created_at = moment(
            this.convertToDubaiTime(status.created_at),
            this.fmt
          ).format("DD-MM-YYYY hh:mm:ss");
        });

        // Add tax calculation breakdown to each order
        if (item.order_cost) {
          const isMaharashtra = this.isMaharashtraOrder(item);
          // Calculate the original cost before tax (assuming 5% GST)
          const originalCost = item.order_cost / 1.05;
          const taxAmount = item.order_cost - originalCost;

          item.taxBreakdown = {
            itemTotal: originalCost.toFixed(2),
            isMaharashtra: isMaharashtra,
            cgst: isMaharashtra ? (taxAmount / 2).toFixed(2) : null,
            sgst: isMaharashtra ? (taxAmount / 2).toFixed(2) : null,
            igst: isMaharashtra ? null : taxAmount.toFixed(2),
          };
        }
      });
      this.items = data;
      this.allItems = data; // Store all items for filtering
      this.current_page = meta.current_page;
      this.loading = false;
    },
    async search(page = 1) {
      if (this.searchData != "") {
        this.loading = true;
        // Build query parameters for search - using backend's expected format
        let query = `/orders?page=${page}&rowsPerPage=${this.per_page}&search=${this.searchData}`;
        let response = await this.$axios.get(query);

        // Extract items and pagination data
        const { data, meta } = response.data;
        this.meta = meta;

        data.forEach((item) => {
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
            item.user.flat_no = item.user.flat_no
              ? item.user.flat_no + ", "
              : "";
            item.user.building_name = item.user.building_name
              ? item.user.building_name + ", "
              : "";
            item.user.email = item.user.email ? item.user.email + ", " : "";
            item.user.phone = item.user.phone ? item.user.phone + ", " : "";
            item.user.street_name = item.user.street_name
              ? item.user.street_name + ", "
              : "";
            item.user.address = item.user.address
              ? item.user.address + ", "
              : "";
            item.user.other_details = item.user.other_details
              ? item.user.other_details + ", "
              : "";
            item.user.nationality = item.user.nationality
              ? item.user.nationality + ", "
              : "";
          }
          item.created_at = moment(
            this.convertToDubaiTime(item.created_at),
            this.fmt
          ).format("DD-MM-YYYY hh:mm:ss");
          item.order_statuses.forEach((status) => {
            status.created_at = moment(
              this.convertToDubaiTime(status.created_at),
              this.fmt
            ).format("DD-MM-YYYY hh:mm:ss");
          });

          // Add tax calculation breakdown to each order
          if (item.order_cost) {
            const isMaharashtra = this.isMaharashtraOrder(item);
            // Calculate the original cost before tax (assuming 5% GST)
            const originalCost = item.order_cost / 1.05;
            const taxAmount = item.order_cost - originalCost;

            item.taxBreakdown = {
              itemTotal: originalCost.toFixed(2),
              isMaharashtra: isMaharashtra,
              cgst: isMaharashtra ? (taxAmount / 2).toFixed(2) : null,
              sgst: isMaharashtra ? (taxAmount / 2).toFixed(2) : null,
              igst: isMaharashtra ? null : taxAmount.toFixed(2),
            };
          }
        });
        this.items = data;
        this.current_page = meta.current_page;
        this.loading = false;
      }
    },
    // filter() {
    //   if (this.category_id)
    //     this.items = this.allItems.filter(
    //       (item) => item.company.category_id == this.category_id
    //     );
    //   else this.items = this.allItems;
    // },

    filter() {
      // Reload data from server with the selected filters
      // The getData method will include category_id and order_status_id in the API call
      this.currentPage = 1; // Reset to first page when filtering
      this.getData();
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
      // construct a moment object - handle multiple possible input formats
      var m = moment(
        time,
        ["YYYY-MM-DD hh:mm:ss A", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601],
        true
      );

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
    async approveOrder(order, approvedStatus) {
      if (
        await this.$root.confirm(
          `Are you sure you want to change the status of order ${order.id}`
        )
      ) {
        if (approvedStatus == 1) order.is_approved_by_hotelier = 1;
        else if (approvedStatus == 2) {
          order.is_approved_by_hotelier = 2;
          order.delivery_boy_id = null;
          order.is.delivery_boy_accepted = 0;
        } else {
          order.is_approved_by_hotelier = 0;
          order.delivery_boy_id = null;
          order.is.delivery_boy_accepted = 0;
        }
        await this.$axios.patch(`/orders/${order.id}`, order);
        await this.$root.alert("Done");
        this.getData();
      }
      // else {
      //   order.is_approved_by_hotelier = !order.is_approved_by_hotelier
      // }
    },
    async changePage(page) {
      // Prevent changing to an invalid page
      if (
        page < 1 ||
        page > this.meta.last_page ||
        page === this.current_page
      ) {
        return;
      }

      // Determine whether to use search or regular data load
      if (this.searchData) {
        await this.search(page);
      } else {
        await this.getData(page);
      }
    },
    getPaginationRange() {
      // Create pagination range for display
      if (!this.meta || !this.meta.last_page) return [];
      const range = [];
      const currentPage = this.meta.current_page || 1;
      const lastPage = this.meta.last_page || 1;
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(lastPage, currentPage + 2);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      return range;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
