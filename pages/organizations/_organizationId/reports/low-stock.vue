<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Low Stock Products Report</h1>
              <br />
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Low Stock Products</li>
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
                  <label>Stock Threshold</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="stockThreshold"
                    min="1"
                    placeholder="Enter quantity threshold"
                  />
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button class="btn btn-primary btn-block" @click="fetchData">
                    <i class="fas fa-search mr-1"></i> Apply
                  </button>
                </div>
                <!-- Export Button -->
                <div class="col-md-3 d-flex align-items-end">
                  <client-only>
                    <download-excel
                      class="btn btn-excel btn-block"
                      :data="excel_items"
                      :fields="excel_fields"
                      worksheet="Low Stock Products"
                      name="LowStockProducts.xls"
                    >
                      <i class="fas fa-file-excel mr-1"></i> Export to Excel
                    </download-excel>
                  </client-only>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="row mb-3">
            <div class="col-lg-4 col-6">
              <div
                class="small-box"
                :class="criticalCount > 0 ? 'bg-danger' : 'bg-success'"
              >
                <div class="inner">
                  <h3>{{ criticalCount }}</h3>
                  <p>Critical (Stock &lt; 5)</p>
                </div>
                <div class="icon"><i class="fas fa-times-circle"></i></div>
              </div>
            </div>
            <div class="col-lg-4 col-6">
              <div
                class="small-box"
                :class="lowCount > 0 ? 'bg-warning' : 'bg-success'"
              >
                <div class="inner">
                  <h3>{{ lowCount }}</h3>
                  <p>Low (Stock ≤ {{ stockThreshold }})</p>
                </div>
                <div class="icon">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>{{ products.length }}</h3>
                  <p>Total Products Found</p>
                </div>
                <div class="icon"><i class="fas fa-box"></i></div>
              </div>
            </div>
          </div>

          <!-- Products Table -->
          <div class="card">
            <div
              class="card-header border-0 d-flex justify-content-between align-items-center"
            >
              <h3 class="card-title">
                <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
                Products with Stock ≤ {{ stockThreshold }}
              </h3>
              <span
                class="badge"
                :class="products.length > 0 ? 'badge-warning' : 'badge-success'"
              >
                {{ products.length }} Products
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
                  <tr v-if="loading">
                    <td colspan="17">Loading...</td>
                  </tr>
                  <tr
                    v-for="(product, index) in paginatedProducts"
                    :key="index"
                  >
                    <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
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
                  <tr v-if="!loading && !products.length">
                    <td colspan="17" class="text-center p-4">
                      <i
                        class="fas fa-check-circle text-success fa-2x mb-2"
                      ></i>
                      <p class="text-success mb-0">
                        All products have sufficient stock!
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Pagination
              v-if="products.length > 0"
              :total-items="products.length"
              :per-page="perPage"
              :current-page="currentPage"
              @page-changed="onPageChanged"
              @per-page-changed="onPerPageChanged"
            />
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "LowStockReport",
  components: {
    BackButton,
    Pagination,
  },
  data() {
    return {
      stockThreshold: 10,
      loading: false,
      products: [],
      currentPage: 1,
      perPage: 10,
      excel_items: [],
      excel_fields: {
        "Sr. No.": "sr_no",
        "App Display Name": "app_display_name", // Added
        "Product Name": "product_tally_name", // Changed mapping
        Points: "points",
        "Main Category": "main_category",
        "Second Category": "second_category",
        "Third Category": "third_category",
        Colour: "color",
        Size: "size",
        "Retail Price": "price",
        "Retail Offer Price": "retail_offer_price",
        "Wholesale Price": "wholesale_price",
        "Wholesale Offer Price": "wholesale_offer_price",
        Qty: "qty",
        UOM: "uom",
        "Is Active": "is_active",
        Status: "status",
      },
    };
  },
  computed: {
    criticalCount() {
      return this.products.filter((p) => parseInt(p.qty) < 5).length;
    },
    lowCount() {
      return this.products.filter(
        (p) => parseInt(p.qty) >= 5 && parseInt(p.qty) <= this.stockThreshold
      ).length;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.products.slice(start, end);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await this.$axios.get(
          "/analytics/low_stock_products",
          {
            params: { threshold: this.stockThreshold },
          }
        );

        let allProducts = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          allProducts = response.data.data.data || response.data.data;
        } else if (Array.isArray(response.data)) {
          allProducts = response.data;
        }

        this.products = allProducts;
        this.prepareExcelData();
      } catch (error) {
        console.error("Error fetching products:", error);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    prepareExcelData() {
      this.excel_items = this.products.map((item, index) => ({
        sr_no: index + 1,
        app_display_name: item.app_display_name,
        product_name: item.product_name,
        product_tally_name: item.product_tally_name,
        points: item.points,
        main_category: item.main_category,
        second_category: item.second_category,
        third_category: item.third_category,
        color: item.color,
        size: item.size,
        price: item.price,
        retail_offer_price: item.retail_offer_price,
        wholesale_price: item.wholesale_price,
        wholesale_offer_price: item.wholesale_offer_price,
        qty: item.qty,
        uom: item.uom,
        is_active: item.is_active,
        status: parseInt(item.qty) < 5 ? "Critical" : "Low",
      }));
    },
    onPageChanged(page) {
      this.currentPage = page;
    },
    onPerPageChanged(perPage) {
      this.perPage = perPage;
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
.btn-excel {
  background: linear-gradient(135deg, #1d6f42 0%, #217346 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-excel:hover {
  background: linear-gradient(135deg, #217346 0%, #1d6f42 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 115, 70, 0.4);
}

.small-box {
  border-radius: 12px;
  overflow: hidden;
}

.small-box .inner h3 {
  font-size: 2.2rem;
  font-weight: 700;
}
</style>
