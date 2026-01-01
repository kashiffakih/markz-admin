<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- Filters -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label>Filter Type</label>
                  <select
                    class="form-control"
                    v-model="filterType"
                    @change="onFilterChange"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <!-- Custom Date Range -->
                <div class="col-md-3" v-if="filterType === 'custom'">
                  <label>Start Date</label>
                  <client-only>
                    <date-picker v-model="startDate" format="yyyy-MM-dd" />
                  </client-only>
                </div>
                <div class="col-md-3" v-if="filterType === 'custom'">
                  <label>End Date</label>
                  <client-only>
                    <date-picker v-model="endDate" format="yyyy-MM-dd" />
                  </client-only>
                </div>

                <div class="col-md-2 d-flex align-items-end">
                  <button
                    class="btn btn-primary btn-block"
                    @click="fetchAllData"
                  >
                    <i class="fas fa-search mr-1"></i> Apply Filters
                  </button>
                </div>
                <div class="col-md-2">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="lowStockThreshold"
                    min="1"
                    placeholder="Enter qty"
                    @change="fetchLowStockProducts"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Key Metrics (Cards) -->
          <div class="row">
            <div class="col-lg-3 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>{{ totalSales || 0 }}</h3>
                  <p>Total Revenue</p>
                </div>
                <div class="icon"><i class="ion ion-bag"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>{{ totalOrders || 0 }}</h3>
                  <p>Total Orders</p>
                </div>
                <div class="icon"><i class="ion ion-stats-bars"></i></div>
              </div>
            </div>
            <!-- Average Order Value -->
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>{{ averageOrderValue }}</h3>
                  <p>Avg Order Value</p>
                </div>
                <div class="icon"><i class="ion ion-pie-graph"></i></div>
              </div>
            </div>
            <!-- New Customers -->
            <div class="col-lg-3 col-6">
              <div class="small-box bg-danger">
                <div class="inner">
                  <h3>{{ totalNewCustomers }}</h3>
                  <p>New Customers</p>
                </div>
                <div class="icon"><i class="ion ion-person-add"></i></div>
              </div>
            </div>
          </div>

          <!-- Low Stock Alert Card -->
          <div class="row">
            <div class="col-lg-4 col-6">
              <div
                class="small-box"
                :class="
                  lowStockProducts.length > 0 ? 'bg-warning' : 'bg-success'
                "
              >
                <div class="inner">
                  <h3>{{ lowStockProducts.length }}</h3>
                  <p>Low Stock Products (&lt; {{ lowStockThreshold }} qty)</p>
                </div>
                <div class="icon">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row 1 -->
          <div class="row">
            <!-- Sales Over Time -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Sales Trend</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="LineChart"
                    :data="salesChartData"
                    :options="chartOptions.sales"
                  />
                </div>
              </div>
            </div>
            <!-- Customer Growth -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Customer Growth</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="LineChart"
                    :data="customerGrowthChartData"
                    :options="chartOptions.sales"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Category Distribution -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top Categories</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="PieChart"
                    :data="categoryChartData"
                    :options="chartOptions.pie"
                  />
                </div>
              </div>
            </div>
            <!-- Top Sub Categories -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top Sub Categories</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="PieChart"
                    :data="subCategoryChartData"
                    :options="chartOptions.pie"
                  />
                </div>
              </div>
            </div>
            <!-- Top Sub 2 Categories -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top Sub 2 Categories</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="PieChart"
                    :data="sub2CategoryChartData"
                    :options="chartOptions.pie"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row 2 -->
          <div class="row">
            <!-- Top Products -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top Selling Products</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="BarChart"
                    :data="productChartData"
                    :options="chartOptions.bar"
                  />
                </div>
              </div>
            </div>
            <!-- Least Products -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Least Selling Products</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="BarChart"
                    :data="leastProductChartData"
                    :options="chartOptions.bar"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row 3 -->
          <div class="row">
            <!-- Order Status -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Order Statuses</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="PieChart"
                    :data="orderStatusChartData"
                    :options="chartOptions.pie"
                  />
                </div>
              </div>
            </div>
            <!-- Payment Methods -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Payment Methods</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="PieChart"
                    :data="paymentMethodChartData"
                    :options="chartOptions.pie"
                  />
                </div>
              </div>
            </div>
            <!-- Sales by Price Range -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Sales by Price Range</h3>
                </div>
                <div class="card-body">
                  <GChart
                    type="ColumnChart"
                    :data="priceRangeChartData"
                    :options="chartOptions.column"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tables Row -->
          <div class="row">
            <!-- Recent Orders -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Recent Orders</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in recentOrders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>
                          {{ order.user ? order.user.first_name : "N/A" }}
                        </td>
                        <td>
                          <span
                            class="badge badge-info"
                            v-if="
                              order.order_statuses &&
                              order.order_statuses.length &&
                              order.order_statuses[0].status
                            "
                          >
                            {{ order.order_statuses[0].status.name }}
                          </span>
                          <span class="badge badge-secondary" v-else
                            >Placed</span
                          >
                        </td>
                        <td>{{ order.order_cost }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    class="mt-2 text-center"
                    v-if="recentOrders && !recentOrders.length"
                  >
                    <span>No recent orders found.</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Products Table -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top Performing Products</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Tally Name</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Quantity Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(product, index) in topProductsList"
                        :key="index"
                      >
                        <td>
                          {{ product.product_name }}
                        </td>
                        <td>
                          {{ product.tally_product_name }}
                        </td>
                        <td>
                          {{ product.size }}
                        </td>
                        <td>
                          {{ product.color }}
                        </td>
                        <td>
                          {{ product.total_qty }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="mt-2 text-center" v-if="!topProductsList.length">
                    <span>No data available.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tables Row 2: Top Customers & Sales by City -->
          <div class="row">
            <!-- Top Customers -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top Customers</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="cust in topCustomers" :key="cust.id">
                        <td>{{ cust.first_name }}</td>
                        <td>{{ cust.total_orders }}</td>
                        <td>{{ cust.total_spent }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="mt-2 text-center" v-if="!topCustomers.length">
                    <span>No data available.</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Sales by City -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Sales by City</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>City</th>
                        <th>Orders</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(city, index) in salesByCity" :key="index">
                        <td>{{ city.city }}</td>
                        <td>{{ city.total_orders }}</td>
                        <td>{{ city.total_revenue }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="mt-2 text-center" v-if="!salesByCity.length">
                    <span>No data available.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Low Stock Products Report -->
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div
                  class="card-header border-0 d-flex justify-content-between align-items-center"
                >
                  <h3 class="card-title">
                    <i
                      class="fas fa-exclamation-triangle text-warning mr-2"
                    ></i>
                    Low Stock Products Report (Stock &lt;
                    {{ lowStockThreshold }})
                  </h3>
                  <span
                    class="badge"
                    :class="
                      lowStockProducts.length > 0
                        ? 'badge-warning'
                        : 'badge-success'
                    "
                  >
                    {{ lowStockProducts.length }} Products
                  </span>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>App Display Name</th>
                        <th>Product Name</th>
                        <th>Points</th>
                        <th>Main Category</th>
                        <th>Second Category</th>
                        <th>Third Category</th>
                        <th>Colour</th>
                        <th>Size</th>
                        <th>Retail Price</th>
                        <th>Retail Offer Price</th>
                        <th>Wholesale Price</th>
                        <th>Wholesale Offer Price</th>
                        <th>Qty</th>
                        <!-- <th>UOM</th> -->
                        <th>Is Active</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(product, index) in lowStockProducts"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ product.app_display_name }}</td>
                        <td>{{ product.product_tally_name }}</td>
                        <td>{{ product.points }}</td>
                        <td>{{ product.main_category }}</td>
                        <td>{{ product.second_category }}</td>
                        <td>{{ product.third_category }}</td>
                        <td>{{ product.color }}</td>
                        <td>{{ product.size }}</td>
                        <td>{{ product.price }}</td>
                        <td>{{ product.retail_offer_price }}</td>
                        <td>{{ product.wholesale_price }}</td>
                        <td>{{ product.wholesale_offer_price }}</td>
                        <td>
                          <span
                            class="font-weight-bold"
                            :class="
                              product.qty < 5 ? 'text-danger' : 'text-warning'
                            "
                          >
                            {{ product.qty }}
                          </span>
                        </td>
                        <!-- <td>{{ product.uom }}</td> -->
                        <td>{{ product.is_active }}</td>
                        <td>
                          <span
                            v-if="parseInt(product.qty) < 5"
                            class="badge badge-danger"
                            >Critical</span
                          >
                          <span v-else class="badge badge-warning">Low</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    class="mt-2 text-center p-3"
                    v-if="!lowStockProducts.length"
                  >
                    <i class="fas fa-check-circle text-success fa-2x mb-2"></i>
                    <p class="text-success">
                      All products have sufficient stock!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import { GChart } from "vue-google-charts";

export default {
  name: "AnalyticsDashboard",
  components: {
    GChart,
  },
  data() {
    return {
      filterType: "monthly",
      startDate: "",
      endDate: "",
      loading: false,

      // Metrics
      totalSales: 0,
      totalOrders: 0,
      totalNewCustomers: 0,

      // Chart Data Containers
      salesChartData: [
        [
          { type: "string", label: "Date" },
          { type: "number", label: "Revenue" },
          { type: "number", label: "Orders" },
        ],
      ],
      productChartData: [
        [
          { type: "string", label: "Product" },
          { type: "number", label: "Quantity" },
        ],
      ],
      // Tables Data
      recentOrders: [],
      topProductsList: [],
      leastProductChartData: [
        [
          { type: "string", label: "Product" },
          { type: "number", label: "Quantity" },
        ],
      ],
      categoryChartData: [
        [
          { type: "string", label: "Category" },
          { type: "number", label: "Quantity" },
        ],
      ],
      subCategoryChartData: [
        [
          { type: "string", label: "Sub Category" },
          { type: "number", label: "Quantity" },
        ],
      ],
      sub2CategoryChartData: [
        [
          { type: "string", label: "Sub 2 Category" },
          { type: "number", label: "Quantity" },
        ],
      ],
      customerGrowthChartData: [
        [
          { type: "string", label: "Date" },
          { type: "number", label: "New Customers" },
        ],
      ],
      orderStatusChartData: [
        [
          { type: "string", label: "Status" },
          { type: "number", label: "Orders" },
        ],
      ],
      priceRangeChartData: [
        [
          { type: "string", label: "Price Range" },
          { type: "number", label: "Orders" },
        ],
      ],
      // New Analytics
      paymentMethodChartData: [
        [
          { type: "string", label: "Payment Method" },
          { type: "number", label: "Orders" },
        ],
      ],
      topCustomers: [],
      salesByCity: [],

      // Low Stock Products
      lowStockThreshold: 10,
      lowStockProducts: [],

      // Chart Options
      chartOptions: {
        sales: {
          title: "Revenue over Time",
          curveType: "function",
          legend: { position: "bottom" },
          height: 400,
        },
        pie: {
          pieHole: 0.4,
          height: 350,
          chartArea: { width: "90%", height: "80%" },
        },
        bar: {
          // Top Products (BarChart): Domain acts on Y-Axis (vAxis)
          legend: { position: "none" },
          height: 350,
          chartArea: { width: "80%", height: "80%" },
          vAxis: { type: "category" },
        },
        column: {
          // Price Range (ColumnChart): Domain acts on X-Axis (hAxis)
          legend: { position: "none" },
          height: 350,
          chartArea: { width: "80%", height: "80%" },
          hAxis: { type: "category" },
        },
      },
    };
  },
  computed: {
    averageOrderValue() {
      if (!this.totalSales || !this.totalOrders || this.totalOrders == 0)
        return "0.00";
      return (parseFloat(this.totalSales) / parseInt(this.totalOrders)).toFixed(
        2
      );
    },
  },
  mounted() {
    // Default Dates
    this.startDate = moment().startOf("month").format("YYYY-MM-DD");
    this.endDate = moment().endOf("month").format("YYYY-MM-DD");
    this.fetchAllData();
    this.fetchLowStockProducts();
  },
  methods: {
    onFilterChange() {
      if (this.filterType !== "custom") {
        this.fetchAllData();
      }
    },
    async fetchAllData() {
      this.loading = true;
      const params = {
        type: this.filterType,
        start_date: moment(this.startDate).format("YYYY-MM-DD"),
        end_date: moment(this.endDate).format("YYYY-MM-DD"),
      };

      try {
        // 1. Sales Trend
        const salesRes = await this.$axios.get("analytics/sales", {
          params,
        });
        this.processSalesData(salesRes.data.data);

        // 2. Top Products
        const prodRes = await this.$axios.get("analytics/top_products", {
          params,
        });
        this.processProductData(prodRes.data.data);

        // 2b. Least Products
        const leastRes = await this.$axios.get("analytics/least_products", {
          params,
        });
        this.processLeastProductData(leastRes.data.data);

        // 3. Top Categories
        const catRes = await this.$axios.get("analytics/top_categories", {
          params,
        });
        this.processCategoryData(catRes.data.data);

        // 3b. Top Sub Categories
        const subCatRes = await this.$axios.get(
          "analytics/top_sub_categories",
          {
            params,
          }
        );
        this.processSubCategoryData(subCatRes.data.data);

        // 3c. Top Sub 2 Categories
        const sub2CatRes = await this.$axios.get(
          "analytics/top_sub_2_categories",
          {
            params,
          }
        );
        this.processSub2CategoryData(sub2CatRes.data.data);

        // 4. Sales by Price
        const priceRes = await this.$axios.get("analytics/sales_by_price", {
          params,
        });
        this.processPriceData(priceRes.data.data);

        // 5. Customer Growth
        const custRes = await this.$axios.get("analytics/customer_growth", {
          params,
        });
        this.processCustomerGrowthData(custRes.data.data);

        // 6. Order Statuses
        const statusRes = await this.$axios.get("analytics/order_statuses", {
          params,
        });
        this.processOrderStatusData(statusRes.data.data);

        // 7. Recent Orders
        const recentRes = await this.$axios.get("analytics/recent_orders", {
          params,
        });
        this.recentOrders = recentRes.data.data;

        // 8. Payment Methods
        const payRes = await this.$axios.get("analytics/payment_methods", {
          params,
        });
        this.processPaymentMethodData(payRes.data.data);

        // 9. Top Customers
        const topCustRes = await this.$axios.get("analytics/top_customers", {
          params,
        });
        this.topCustomers = topCustRes.data.data;

        // 10. Sales By City
        const cityRes = await this.$axios.get("analytics/sales_by_city", {
          params,
        });
        this.salesByCity = cityRes.data.data;
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        this.loading = false;
      }
    },

    processSalesData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Date" },
        { type: "number", label: "Revenue" },
        { type: "number", label: "Orders" },
      ];
      const chartData = [header];
      let revenue = 0;
      let orders = 0;

      data.forEach((item) => {
        chartData.push([
          item.date,
          parseFloat(item.total_amount),
          parseInt(item.count),
        ]);
        revenue += parseFloat(item.total_amount);
        orders += parseInt(item.count);
      });

      this.salesChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0, 0]];
      this.totalSales = revenue.toFixed(2);
      this.totalOrders = orders;
    },

    processProductData(data) {
      if (!data) return;
      this.topProductsList = data; // Save raw data for table
      const header = [
        { type: "string", label: "Product" },
        { type: "number", label: "Quantity" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.name, parseInt(item.total_qty)]);
      });
      this.productChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    processLeastProductData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Product" },
        { type: "number", label: "Quantity" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.name, parseInt(item.total_qty)]);
      });
      this.leastProductChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    processCategoryData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Category" },
        { type: "number", label: "Quantity" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.name, parseInt(item.total_qty)]);
      });
      this.categoryChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    processSubCategoryData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Sub Category" },
        { type: "number", label: "Quantity" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.name, parseInt(item.total_qty)]);
      });
      this.subCategoryChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    processSub2CategoryData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Sub 2 Category" },
        { type: "number", label: "Quantity" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.name, parseInt(item.total_qty)]);
      });
      this.sub2CategoryChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    processPriceData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Price Range" },
        { type: "number", label: "Orders" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.range, parseInt(item.count)]);
      });
      this.priceRangeChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    processCustomerGrowthData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Date" },
        { type: "number", label: "New Customers" },
      ];
      const chartData = [header];
      let total = 0;
      data.forEach((item) => {
        chartData.push([item.date, parseInt(item.count)]);
        total += parseInt(item.count);
      });
      this.customerGrowthChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
      this.totalNewCustomers = total;
    },

    processOrderStatusData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Status" },
        { type: "number", label: "Orders" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([String(item.status), parseInt(item.count)]);
      });
      this.orderStatusChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },
    processPaymentMethodData(data) {
      if (!data) return;
      const header = [
        { type: "string", label: "Payment Method" },
        { type: "number", label: "Orders" },
      ];
      const chartData = [header];
      data.forEach((item) => {
        chartData.push([item.mode, parseInt(item.count)]);
      });
      this.paymentMethodChartData =
        chartData.length > 1 ? chartData : [header, ["No Data", 0]];
    },

    // Fetch Low Stock Products
    async fetchLowStockProducts() {
      try {
        const response = await this.$axios.get(
          "/analytics/low_stock_products",
          {
            params: { threshold: this.lowStockThreshold },
          }
        );

        let products = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          products = response.data.data.data || response.data.data;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        }

        this.lowStockProducts = products;
      } catch (error) {
        console.error("Error fetching low stock products:", error);
        this.lowStockProducts = [];
      }
    },
  },
};
</script>
