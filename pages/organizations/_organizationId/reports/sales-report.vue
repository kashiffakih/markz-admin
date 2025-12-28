<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Sales Report</h1>
              <br />
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Sales Report</li>
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
                <!-- Premium Export Button -->
                <div class="col-md-2 d-flex align-items-end">
                  <client-only>
                    <download-excel
                      class="btn btn-excel btn-block"
                      :data="excel_items"
                      :fields="excel_fields"
                      worksheet="Sales Report"
                      name="SalesReport.xls"
                    >
                      <i class="fas fa-file-excel mr-2"></i> Export
                    </download-excel>
                  </client-only>
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Sales Data</h3>
              <h3 class="card-title float-sm-right">
                Total Revenue: {{ totalRevenue }}
              </h3>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-head-fixed table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Orders Count</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="3">Loading...</td>
                  </tr>
                  <tr v-for="(row, i) in items" :key="i">
                    <td>{{ row.date }}</td>
                    <td>{{ row.count }}</td>
                    <td>{{ row.total_amount }}</td>
                  </tr>
                  <tr v-if="!loading && items.length === 0">
                    <td colspan="3" class="text-center">No data found.</td>
                  </tr>
                </tbody>
              </table>
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
  name: "SalesReport",
  components: {
    BackButton,
  },
  data() {
    return {
      filterType: "monthly",
      startDate: "",
      endDate: "",
      loading: false,
      items: [],
      excel_items: [],
      excel_fields: {
        Date: "date",
        "Orders Count": "count",
        "Total Sales": "total_amount",
      },
      totalRevenue: 0,
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
        const res = await this.$axios.get("analytics/sales", { params });
        this.items = res.data.data;
        this.calculateTotals();
        this.prepareExcelData();
      } catch (error) {
        console.error("Error fetching sales data", error);
      } finally {
        this.loading = false;
      }
    },
    calculateTotals() {
      let total = 0;
      this.items.forEach((item) => {
        total += parseFloat(item.total_amount);
      });
      this.totalRevenue = total.toFixed(2);
    },
    prepareExcelData() {
      this.excel_items = this.items.map((item) => ({
        date: item.date,
        count: item.count,
        total_amount: item.total_amount,
      }));
    },
  },
};
</script>
