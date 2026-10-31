<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Seller Dashboard</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Seller Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- Seller Filter -->
          <div class="card mb-3">
            <div class="card-body p-3">
              <div class="row align-items-center">
                <div class="col-md-4">
                  <label class="mb-1"><strong>Select Seller</strong></label>
                  <select class="form-control" v-model="selectedSellerId" @change="fetchDashboardData">
                    <option value="">All Sellers</option>
                    <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
                      {{ seller.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="mb-1"><strong>Period</strong></label>
                  <select class="form-control" v-model="period" @change="fetchDashboardData">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div class="col-md-3 d-flex align-items-end mt-3">
                  <button class="btn btn-primary" @click="fetchDashboardData" :disabled="loading">
                    <i class="fas fa-sync-alt mr-1" :class="{'fa-spin': loading}"></i> Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="row">
            <div class="col-lg-3 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>₹{{ stats.total_revenue || '0.00' }}</h3>
                  <p>Total Revenue</p>
                </div>
                <div class="icon"><i class="fas fa-rupee-sign"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>{{ stats.total_orders || 0 }}</h3>
                  <p>Total Orders</p>
                </div>
                <div class="icon"><i class="fas fa-shopping-bag"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>{{ stats.pending_orders || 0 }}</h3>
                  <p>Pending Orders</p>
                </div>
                <div class="icon"><i class="fas fa-clock"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-danger">
                <div class="inner">
                  <h3>₹{{ stats.commission_earned || '0.00' }}</h3>
                  <p>Commission Earned</p>
                </div>
                <div class="icon"><i class="fas fa-percentage"></i></div>
              </div>
            </div>
          </div>

          <!-- Payout Summary Cards -->
          <div class="row">
            <div class="col-lg-4 col-6">
              <div class="small-box bg-gradient-primary">
                <div class="inner">
                  <h3>₹{{ stats.total_earnings || '0.00' }}</h3>
                  <p>Total Seller Earnings</p>
                </div>
                <div class="icon"><i class="fas fa-wallet"></i></div>
              </div>
            </div>
            <div class="col-lg-4 col-6">
              <div class="small-box bg-gradient-success">
                <div class="inner">
                  <h3>₹{{ stats.paid_amount || '0.00' }}</h3>
                  <p>Paid to Sellers</p>
                </div>
                <div class="icon"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
            <div class="col-lg-4 col-6">
              <div class="small-box bg-gradient-danger">
                <div class="inner">
                  <h3>₹{{ stats.pending_amount || '0.00' }}</h3>
                  <p>Pending Payouts</p>
                </div>
                <div class="icon"><i class="fas fa-exclamation-circle"></i></div>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Recent Orders -->
            <div class="col-md-8">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title"><i class="fas fa-shopping-cart mr-2"></i>Recent Seller Orders</h3>
                  <div class="card-tools">
                    <nuxt-link to="/orders" class="btn btn-sm btn-outline-primary">
                      View All <i class="fas fa-arrow-right ml-1"></i>
                    </nuxt-link>
                  </div>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Seller</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in recentOrders" :key="order.id">
                        <td><strong>#{{ order.id }}</strong></td>
                        <td>{{ order.company ? order.company.name : 'N/A' }}</td>
                        <td>{{ order.user ? order.user.first_name : 'N/A' }}</td>
                        <td>₹{{ order.order_cost }}</td>
                        <td>
                          <span class="badge" :class="getStatusBadge(order)">
                            {{ getStatusText(order) }}
                          </span>
                        </td>
                        <td>{{ formatDate(order.created_at) }}</td>
                      </tr>
                      <tr v-if="!recentOrders.length">
                        <td colspan="6" class="text-center py-4 text-muted">
                          <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                          No orders yet
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Top Products -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title"><i class="fas fa-trophy mr-2"></i>Top Selling Products</h3>
                </div>
                <div class="card-body p-0">
                  <ul class="products-list product-list-in-card pl-2 pr-2">
                    <li class="item" v-for="(product, index) in topProducts" :key="index">
                      <div class="product-info ml-2">
                        <span class="product-title">
                          {{ product.name }}
                          <span class="badge badge-info float-right">{{ product.total_qty }} sold</span>
                        </span>
                        <span class="product-description text-muted">
                          ₹{{ product.revenue || '0' }} revenue
                        </span>
                      </div>
                    </li>
                    <li v-if="!topProducts.length" class="text-center py-4 text-muted">
                      <i class="fas fa-box-open fa-2x mb-2 d-block"></i>
                      No products data yet
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Sellers Overview -->
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title"><i class="fas fa-users mr-2"></i>Sellers Overview</h3>
                </div>
                <div class="card-body p-0">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td><i class="fas fa-circle text-success mr-2"></i>Active Sellers</td>
                        <td class="text-right"><strong>{{ stats.active_sellers || 0 }}</strong></td>
                      </tr>
                      <tr>
                        <td><i class="fas fa-circle text-warning mr-2"></i>Pending Approval</td>
                        <td class="text-right"><strong>{{ stats.pending_sellers || 0 }}</strong></td>
                      </tr>
                      <tr>
                        <td><i class="fas fa-circle text-danger mr-2"></i>Blocked Sellers</td>
                        <td class="text-right"><strong>{{ stats.blocked_sellers || 0 }}</strong></td>
                      </tr>
                      <tr>
                        <td><i class="fas fa-circle text-info mr-2"></i>Total Products</td>
                        <td class="text-right"><strong>{{ stats.total_products || 0 }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Earnings Chart -->
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title"><i class="fas fa-chart-bar mr-2"></i>Earnings Summary</h3>
                </div>
                <div class="card-body">
                  <div v-if="earningsData.length" style="min-height: 300px;">
                    <table class="table table-bordered table-sm">
                      <thead class="thead-dark">
                        <tr>
                          <th>Period</th>
                          <th class="text-right">Revenue (₹)</th>
                          <th class="text-right">Commission (₹)</th>
                          <th class="text-right">Seller Earnings (₹)</th>
                          <th class="text-right">Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in earningsData" :key="index">
                          <td>{{ item.period }}</td>
                          <td class="text-right">{{ item.revenue || '0.00' }}</td>
                          <td class="text-right">{{ item.commission || '0.00' }}</td>
                          <td class="text-right">{{ item.seller_earnings || '0.00' }}</td>
                          <td class="text-right">{{ item.orders || 0 }}</td>
                        </tr>
                      </tbody>
                      <tfoot class="font-weight-bold bg-light">
                        <tr>
                          <td>Total</td>
                          <td class="text-right">{{ earningsTotal.revenue }}</td>
                          <td class="text-right">{{ earningsTotal.commission }}</td>
                          <td class="text-right">{{ earningsTotal.seller_earnings }}</td>
                          <td class="text-right">{{ earningsTotal.orders }}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div v-else class="text-center py-5 text-muted">
                    <i class="fas fa-chart-bar fa-3x mb-3 d-block"></i>
                    <p>No earnings data available yet</p>
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
import BackButton from "@/components/BackButton.vue";
import moment from "moment";

export default {
  name: "SellerDashboard",
  components: { BackButton },
  data() {
    return {
      loading: false,
      selectedSellerId: "",
      period: "month",
      sellers: [],
      stats: {},
      recentOrders: [],
      topProducts: [],
      earningsData: [],
    };
  },
  computed: {
    earningsTotal() {
      let revenue = 0, commission = 0, seller_earnings = 0, orders = 0;
      this.earningsData.forEach(item => {
        revenue += parseFloat(item.revenue || 0);
        commission += parseFloat(item.commission || 0);
        seller_earnings += parseFloat(item.seller_earnings || 0);
        orders += parseInt(item.orders || 0);
      });
      return {
        revenue: revenue.toFixed(2),
        commission: commission.toFixed(2),
        seller_earnings: seller_earnings.toFixed(2),
        orders
      };
    }
  },
  mounted() {
    this.fetchSellers();
    this.fetchDashboardData();
  },
  methods: {
    async fetchSellers() {
      try {
        const response = await this.$axios.get("companies", {
          params: { rowsPerPage: 100 }
        });
        this.sellers = response.data.data || [];
      } catch (error) {
        console.log("Error fetching sellers:", error);
      }
    },
    async fetchDashboardData() {
      this.loading = true;
      const params = {
        company_id: this.selectedSellerId,
        period: this.period,
      };
      try {
        const [statsRes, ordersRes, productsRes, earningsRes] = await Promise.all([
          this.$axios.get("seller/dashboard/stats", { params }).catch(e => ({ data: {} })),
          this.$axios.get("seller/dashboard/recent_orders", { params }).catch(e => ({ data: { data: [] } })),
          this.$axios.get("seller/dashboard/top_products", { params }).catch(e => ({ data: { data: [] } })),
          this.$axios.get("seller/dashboard/earnings_summary", { params }).catch(e => ({ data: { data: [] } })),
        ]);
        this.stats = statsRes.data.data || statsRes.data || {};
        this.recentOrders = ordersRes.data.data || [];
        this.topProducts = productsRes.data.data || [];
        this.earningsData = earningsRes.data.data || [];
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        this.loading = false;
      }
    },
    getStatusText(order) {
      if (order.order_statuses && order.order_statuses.length && order.order_statuses[0].status) {
        return order.order_statuses[0].status.name;
      }
      return "Placed";
    },
    getStatusBadge(order) {
      const status = this.getStatusText(order).toLowerCase();
      if (status === 'delivered') return 'badge-success';
      if (status === 'cancelled') return 'badge-danger';
      if (status === 'shipped' || status === 'dispatched') return 'badge-info';
      return 'badge-warning';
    },
    formatDate(date) {
      return moment(date).format("DD MMM YYYY");
    },
  },
};
</script>

<style scoped>
.small-box .icon i {
  font-size: 50px;
}
.product-description {
  font-size: 12px;
}
</style>
