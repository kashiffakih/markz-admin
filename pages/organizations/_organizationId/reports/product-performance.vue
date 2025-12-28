<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Product Performance Report</h1>
              <br />
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Product Performance</li>
              </ol>
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
                  <button class="btn btn-primary btn-block" @click="fetchData">
                    <i class="fas fa-search mr-1"></i> Apply
                  </button>
                </div>
                <!-- Premium Export Buttons -->
                <div class="col-md-3 d-flex align-items-end">
                  <div class="d-flex w-100">
                    <client-only>
                      <download-excel
                        class="btn btn-excel flex-fill mr-2"
                        :data="excel_items_top"
                        :fields="excel_fields"
                        worksheet="Top Products"
                        name="TopProducts.xls"
                      >
                        <i class="fas fa-file-excel mr-1"></i> Top
                      </download-excel>
                    </client-only>
                    <client-only>
                      <download-excel
                        class="btn btn-excel flex-fill"
                        :data="excel_items_least"
                        :fields="excel_fields"
                        worksheet="Least Products"
                        name="LeastProducts.xls"
                      >
                        <i class="fas fa-file-excel mr-1"></i> Least
                      </download-excel>
                    </client-only>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Top Products -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Top 10 Selling Products</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="3">Loading...</td>
                      </tr>
                      <tr v-for="(prod, i) in topProducts" :key="i">
                        <td>{{ prod.name }}</td>
                        <td>{{ prod.total_qty }}</td>
                        <td>{{ prod.total_revenue || 0 }}</td>
                      </tr>
                      <tr v-if="!loading && !topProducts.length">
                        <td colspan="3" class="text-center">
                          No data available.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Least Products -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header border-0">
                  <h3 class="card-title">Least 10 Selling Products</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="3">Loading...</td>
                      </tr>
                      <tr v-for="(prod, i) in leastProducts" :key="i">
                        <td>{{ prod.name }}</td>
                        <td>{{ prod.total_qty }}</td>
                        <td>{{ prod.total_revenue || 0 }}</td>
                      </tr>
                      <tr v-if="!loading && !leastProducts.length">
                        <td colspan="3" class="text-center">
                          No data available.
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
  name: "ProductPerformanceReport",
  components: {
    BackButton,
  },
  data() {
    return {
      filterType: "monthly",
      startDate: "",
      endDate: "",
      loading: false,
      topProducts: [],
      leastProducts: [],
      excel_items_top: [],
      excel_items_least: [],
      excel_fields: {
        Product: "name",
        "Quantity Sold": "total_qty",
        Revenue: "total_revenue",
      },
    };
  },
  mounted() {
    this.startDate = moment().startOf("month").format("YYYY-MM-DD");
    this.endDate = moment().endOf("month").format("YYYY-MM-DD");
    this.fetchData();
  },
  methods: {
    onFilterChange() {
      if (this.filterType !== "custom") {
        this.fetchData();
      }
    },
    async fetchData() {
      this.loading = true;
      const params = {
        type: this.filterType,
        start_date: moment(this.startDate).format("YYYY-MM-DD"),
        end_date: moment(this.endDate).format("YYYY-MM-DD"),
      };

      try {
        const topRes = await this.$axios.get("analytics/top_products", {
          params,
        });
        this.topProducts = topRes.data.data;

        const leastRes = await this.$axios.get("analytics/least_products", {
          params,
        });
        this.leastProducts = leastRes.data.data;

        this.prepareExcelData();
      } catch (error) {
        console.error("Error fetching product data", error);
      } finally {
        this.loading = false;
      }
    },
    prepareExcelData() {
      this.excel_items_top = this.topProducts.map((item) => ({
        name: item.name,
        total_qty: item.total_qty,
        total_revenue: item.total_revenue || 0,
      }));
      this.excel_items_least = this.leastProducts.map((item) => ({
        name: item.name,
        total_qty: item.total_qty,
        total_revenue: item.total_revenue || 0,
      }));
    },
  },
};
</script>
