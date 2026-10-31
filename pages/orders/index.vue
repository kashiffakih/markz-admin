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
              <div class="card mb-3">
                <div class="card-body p-3">
                  <div class="row align-items-center">
                    <div class="col-12 col-md-3 mb-2 mb-md-0">
                      <input
                        type="text"
                        class="form-control"
                        v-model="searchData"
                        @input="search"
                        placeholder="Search by order id"
                        style="height: 44px"
                      />
                    </div>
                    <div class="col-12 col-sm-4 col-md-3 mb-2 mb-sm-0">
                      <v-select
                        v-model="category_id"
                        :reduce="(category) => category.code"
                        :options="categories"
                        @input="filter"
                        placeholder="Select Category"
                        style="min-height: 44px"
                      ></v-select>
                    </div>
                    <div class="col-12 col-sm-4 col-md-3 mb-2 mb-sm-0">
                      <v-select
                        v-model="order_status_id"
                        :reduce="(status) => status.code"
                        :options="order_statuses"
                        @input="filter"
                        placeholder="Select Order Status"
                        style="min-height: 44px"
                      ></v-select>
                    </div>
                    <div class="col-12 col-sm-4 col-md-2 mb-2 mb-sm-0">
                      <v-select
                        v-model="role"
                        :reduce="(role) => role.code"
                        :options="roles"
                        @input="filter"
                        placeholder="Select Role"
                        style="min-height: 44px"
                      ></v-select>
                    </div>
                    <div
                      class="col-12 col-md-1 text-center text-md-right mt-2 mt-md-0"
                    >
                      <a
                        class="btn btn-secondary w-100 d-inline-flex align-items-center justify-content-center"
                        href="#"
                        @click.prevent="getData"
                        style="height: 44px"
                      >
                        <i class="fas fa-sync mr-1"></i> Refresh
                      </a>
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
                        <th>Order Details</th>
                        <th>Order Status</th>
                        <th>Order ID</th>
                        <th>Customer</th>
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
                        <td>
                          <button
                            type="button"
                            class="btn btn-sm btn-info btn-block mb-1"
                            @click="showOrderDetails(order)"
                          >
                            Order Details
                          </button>
                          <button
                            v-if="order.delhivery_waybill"
                            type="button"
                            class="btn btn-sm btn-danger btn-block mb-1"
                            @click="cancelShipment(order)"
                          >
                            Cancel Shipment
                          </button>
                          <button
                            v-if="order.delhivery_waybill && isNDR(order)"
                            type="button"
                            class="btn btn-sm btn-warning btn-block mb-1"
                            @click="reattemptDelivery(order)"
                          >
                            Re-attempt Delivery
                          </button>
                          <button
                            v-if="order.delhivery_waybill"
                            type="button"
                            class="btn btn-sm btn-success btn-block"
                            @click="printPackingSlip(order)"
                          >
                            Print Packing Slip
                          </button>
                          <div class="mt-2 text-left" style="font-size: 13px">
                            <b>Tracking URL:</b>
                            <input
                              type="text"
                              class="form-control form-control-sm mb-1 mt-1"
                              v-model="order.delhivery_tracking_url"
                              placeholder="Enter tracking URL"
                            />
                            <button
                              class="btn btn-sm btn-primary btn-block mb-1"
                              @click="updateTrackingUrl(order)"
                            >
                              Update Tracking URL
                            </button>
                            <a
                              v-if="
                                order.delhivery_tracking_url &&
                                !order.delhivery_waybill
                              "
                              :href="order.delhivery_tracking_url"
                              target="_blank"
                              class="btn btn-sm btn-success btn-block"
                            >
                              <i class="fas fa-external-link-alt"></i> Track
                              Order
                            </a>
                            <!-- <button
                              v-if="
                                order.delivery_method &&
                                order.delivery_method !== 'Regular' &&
                                $auth.user &&
                                $auth.user.roles &&
                                $auth.user.roles[0].name !== 'Distributor'
                              "
                              type="button"
                              class="btn btn-sm btn-warning btn-block mt-1"
                              @click="openInstantDeliveryModal(order)"
                            >
                              <i class="fas fa-bolt"></i> Manage Instant
                              Delivery
                            </button> -->
                            <button
                              v-if="order.delhivery_waybill"
                              type="button"
                              class="btn btn-sm btn-info btn-block mt-1"
                              @click="viewTransitHistory(order)"
                            >
                              <i class="fas fa-truck"></i> Live Transit History
                            </button>
                          </div>
                        </td>
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
                                  {{ order.created_at }}<br />
                                  <b>Order ID: </b> {{ order.id }}<br />
                                  <b>Amount: </b>₹{{ order.total_amount }}
                                  <div
                                    v-if="
                                      order.delivery_method &&
                                      order.delivery_method ==
                                        'Instant Delivery'
                                    "
                                    class="mt-2"
                                  >
                                    <span
                                      class="badge badge-danger"
                                      style="font-size: 14px"
                                      ><i
                                        class="fas fa-exclamation-triangle"
                                      ></i>
                                      INSTANT DELIVERY</span
                                    >
                                    <div
                                      v-if="order.delivery_method !== 'Instant'"
                                      class="mt-1"
                                    >
                                      <small
                                        ><b>Partner:</b>
                                        {{ order.delivery_method }}</small
                                      >
                                    </div>
                                    <div v-if="order.extra_charges > 0">
                                      <small
                                        ><b>Extra Charge:</b> ₹{{
                                          order.extra_charges
                                        }}</small
                                      >
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr v-if="order.expected_delivery_date">
                                <td>Expected Delivery</td>
                                <td>
                                  {{ order.expected_delivery_date }}
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
              <div class="table-responsive">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Name</th>
                      <th>Colour</th>
                      <th>Size</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
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
                      <td>
                        Rs.
                        {{
                          (
                            parseFloat(detail.order_detail_cost || 0) /
                            (detail.quantity || 1)
                          ).toFixed(2)
                        }}
                      </td>
                      <td>
                        Rs.
                        {{
                          parseFloat(detail.order_detail_cost || 0).toFixed(2)
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="row mt-4">
                <div class="col-md-6 mb-4 mb-md-0">
                  <h5>Cost Breakdown</h5>
                  <div class="table-responsive">
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
                            Rs.
                            {{
                              parseFloat(selectedOrder.order_cost || 0).toFixed(
                                2
                              )
                            }}
                          </td>
                        </tr>
                        <tr v-if="isMaharashtraOrder(selectedOrder)">
                          <td>CGST 2.5%</td>
                          <td>
                            Rs.
                            {{
                              (
                                parseFloat(selectedOrder.tax_amount || 0) / 2
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr v-if="isMaharashtraOrder(selectedOrder)">
                          <td>SGST 2.5%</td>
                          <td>
                            Rs.
                            {{
                              (
                                parseFloat(selectedOrder.tax_amount || 0) / 2
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr v-else>
                          <td>IGST 5%</td>
                          <td>
                            Rs.
                            {{
                              parseFloat(selectedOrder.tax_amount || 0).toFixed(
                                2
                              )
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Delivery charge</td>
                          <td>
                            Rs.
                            {{
                              parseFloat(
                                selectedOrder.delivery_amount || 0
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Packing charge</td>
                          <td>
                            Rs.
                            {{
                              parseFloat(
                                selectedOrder.packaging_amount || 0
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr
                          v-if="parseFloat(selectedOrder.platform_fee || 0) > 0"
                        >
                          <td>Platform Fee</td>
                          <td>
                            Rs.
                            {{
                              parseFloat(selectedOrder.platform_fee).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Coupon Value</td>
                          <td>
                            - Rs.
                            {{
                              parseFloat(
                                selectedOrder.coupon_amount || 0
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr v-if="selectedOrder.role !== 'Distributor'">
                          <td>Reward</td>
                          <td>
                            - Rs.
                            {{
                              parseFloat(
                                selectedOrder.wallet_amount_used || 0
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                        <tr
                          style="font-weight: bold; border-top: 2px solid #ccc"
                        >
                          <td>Grand Total</td>
                          <td>
                            Rs.
                            {{
                              parseFloat(
                                selectedOrder.total_amount || 0
                              ).toFixed(2)
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-md-6">
                  <h5>Payment Info</h5>
                  <div class="table-responsive">
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
      <!-- Tracking Modal -->
      <div
        class="modal fade"
        id="trackingModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="trackingModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="trackingModalLabel">
                Live Transit History
              </h5>
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
              <div v-if="trackingLoading" class="text-center">
                Loading tracking data...
              </div>
              <div
                v-else-if="
                  trackingData &&
                  trackingData.ShipmentData &&
                  trackingData.ShipmentData.length > 0
                "
              >
                <div
                  v-for="(shipment, idx) in trackingData.ShipmentData"
                  :key="idx"
                  class="mb-4"
                >
                  <h6>Waybill: {{ shipment.Shipment.AWB }}</h6>
                  <div class="timeline mt-3">
                    <div
                      v-for="(scan, sIdx) in shipment.Shipment.Scans"
                      :key="sIdx"
                      class="time-label"
                      style="display: flex; margin-bottom: 15px"
                    >
                      <div style="flex: 0 0 auto; margin-right: 15px">
                        <span class="badge badge-primary">{{
                          scan.ScanDetail.ScanDateTime
                        }}</span>
                      </div>
                      <div>
                        <strong>{{ scan.ScanDetail.Scan }}</strong
                        ><br />
                        <small class="text-muted">{{
                          scan.ScanDetail.ScannedLocation
                        }}</small>
                        <div v-if="scan.ScanDetail.Instructions">
                          <small>{{ scan.ScanDetail.Instructions }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center">
                No tracking history found or shipment not picked up yet.
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

      <!-- Instant Delivery Modal -->
      <div
        class="modal fade"
        id="instantDeliveryModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="instantDeliveryModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="instantDeliveryModalLabel">
                Manage Instant Delivery
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" v-if="activeInstantOrder">
              <form @submit.prevent="saveInstantDelivery">
                <div class="form-group">
                  <label>Delivery Partner</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="activeInstantOrder.delivery_method"
                    placeholder="e.g. Dunzo, Porter, etc."
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Extra Charges (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    class="form-control"
                    v-model="activeInstantOrder.extra_charges"
                    placeholder="Enter extra charges"
                  />
                </div>
                <div class="form-group">
                  <label>Tracking URL</label>
                  <input
                    type="url"
                    class="form-control"
                    v-model="activeInstantOrder.delhivery_tracking_url"
                    placeholder="https://..."
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="saveInstantDelivery"
              >
                Save changes
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
    let s = os.data.data;

    const orderSequence = [
      "Order Placed",
      "Order Processing",
      "Create Shipment",
      "Request Pickup",
      "Out For Delivery",
      "Delivered",
      "Cancel Shipment",
      "Cancelled",
    ];
    s.sort((a, b) => {
      let indexA = orderSequence.indexOf(a.name);
      let indexB = orderSequence.indexOf(b.name);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    let order_statuses = [];
    order_statuses.push({
      label: "Select Order Status",
      code: "",
    });
    order_statuses.push({
      label: "Order Placed",
      code: 0,
    });
    s.forEach((status) => {
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
    searchTimeout: null,
    trackingLoading: false,
    trackingData: null,
    activeInstantOrder: null,
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
      const $ =
        window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#orderDetailsModal").modal("show");
      }
    },
    isNDR(order) {
      if (order.order_statuses && order.order_statuses.length > 0) {
        let latest = order.order_statuses[order.order_statuses.length - 1];
        return latest.status_id == 12;
      }
      return false;
    },
    async reattemptDelivery(order) {
      if (
        !confirm(
          "Are you sure you want to request a delivery re-attempt on Delhivery?"
        )
      )
        return;
      try {
        await this.$axios.post(`/delhivery/ndr/update`, {
          waybills: order.delhivery_waybill,
          action: "RE-ATTEMPT",
        });
        alert("Re-attempt requested successfully");
        this.getData();
      } catch (e) {
        alert(
          e.response?.data?.error ||
            e.response?.data?.message ||
            "Failed to request re-attempt"
        );
      }
    },
    async updateTrackingUrl(order) {
      try {
        await this.$axios.post(`/orders`, {
          id: order.id,
          delhivery_tracking_url: order.delhivery_tracking_url,
        });
        alert("Tracking URL updated successfully!");
      } catch (e) {
        alert("Failed to update tracking URL. Please try again.");
        console.error(e);
      }
    },
    async viewTransitHistory(order) {
      this.trackingData = null;
      this.trackingLoading = true;
      const $ =
        window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#trackingModal").modal("show");
      }

      try {
        const response = await this.$axios.get(
          `/delhivery/track?order_id=${order.id}`
        );
        this.trackingData = response.data;
      } catch (e) {
        console.error("Failed to load tracking data", e);
      } finally {
        this.trackingLoading = false;
      }
    },
    openInstantDeliveryModal(order) {
      this.activeInstantOrder = JSON.parse(JSON.stringify(order));
      const $ =
        window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#instantDeliveryModal").modal("show");
      }
    },
    async saveInstantDelivery() {
      try {
        await this.$axios.post(`/orders/instant_delivery`, {
          id: this.activeInstantOrder.id,
          delivery_method: this.activeInstantOrder.delivery_method,
          extra_charges: this.activeInstantOrder.extra_charges,
          delhivery_tracking_url:
            this.activeInstantOrder.delhivery_tracking_url,
        });

        const index = this.paginatedItems.findIndex(
          (o) => o.id === this.activeInstantOrder.id
        );
        if (index !== -1) {
          this.paginatedItems[index].delivery_method =
            this.activeInstantOrder.delivery_method;
          this.paginatedItems[index].extra_charges =
            this.activeInstantOrder.extra_charges;
          this.paginatedItems[index].delhivery_tracking_url =
            this.activeInstantOrder.delhivery_tracking_url;
        }

        const $ =
          window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
        if ($) {
          $("#instantDeliveryModal").modal("hide");
        }
        alert("Instant Delivery details updated successfully!");
      } catch (e) {
        console.error("Failed to update instant delivery", e);
        alert("Failed to update details.");
      }
    },
    async cancelShipment(order) {
      if (
        !confirm("Are you sure you want to cancel the shipment on Delhivery?")
      )
        return;
      try {
        await this.$axios.post(`/delhivery/cancel`, { order_id: order.id });
        alert("Shipment cancelled successfully");
        this.getData();
      } catch (e) {
        alert(e.response?.data?.error || "Failed to cancel shipment");
      }
    },
    async printPackingSlip(order) {
      try {
        let res = await this.$axios.post(`/delhivery/generate_label`, {
          order_id: order.id,
        });
        if (res.data.success && res.data.label_url) {
          window.open(res.data.label_url, "_blank");
        } else {
          alert("Failed to generate packing slip");
        }
      } catch (e) {
        alert(e.response?.data?.error || "Failed to generate packing slip");
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
      return state?.toString().trim().toLowerCase() === "maharashtra";
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
    search(page = 1) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (this.searchData.length >= 1) {
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

              item.user.prefix = item.user.prefix
                ? item.user.prefix + ", "
                : "";
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
        } else if (this.searchData.length === 0) {
          this.getData();
        }
      }, 300);
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
