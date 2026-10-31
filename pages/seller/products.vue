<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Seller Products</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Products</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- Status Count Cards -->
          <div class="row">
            <div class="col-lg-3 col-6">
              <div class="small-box bg-info" style="cursor:pointer" @click="setFilter('all')">
                <div class="inner">
                  <h3>{{ statusCounts.total || 0 }}</h3>
                  <p>Total Products</p>
                </div>
                <div class="icon"><i class="fas fa-boxes"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning" style="cursor:pointer" @click="setFilter('pending')">
                <div class="inner">
                  <h3>{{ statusCounts.pending || 0 }}</h3>
                  <p>Pending Approval</p>
                </div>
                <div class="icon"><i class="fas fa-clock"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success" style="cursor:pointer" @click="setFilter('approved')">
                <div class="inner">
                  <h3>{{ statusCounts.approved || 0 }}</h3>
                  <p>Approved</p>
                </div>
                <div class="icon"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
            <div class="col-lg-3 col-6">
              <div class="small-box bg-danger" style="cursor:pointer" @click="setFilter('rejected')">
                <div class="inner">
                  <h3>{{ statusCounts.rejected || 0 }}</h3>
                  <p>Rejected</p>
                </div>
                <div class="icon"><i class="fas fa-times-circle"></i></div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="card">
            <div class="card-body py-2">
              <div class="row align-items-end">
                <div class="col-md-3">
                  <div class="form-group mb-0">
                    <label class="mb-1">Search</label>
                    <input type="text" v-model="filters.search" class="form-control form-control-sm" placeholder="Product name..." @input="debounceSearch" />
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group mb-0">
                    <label class="mb-1">Seller</label>
                    <select v-model="filters.company_id" class="form-control form-control-sm" @change="fetchProducts">
                      <option value="">All Sellers</option>
                      <option v-for="s in sellers" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group mb-0">
                    <label class="mb-1">Status</label>
                    <select v-model="filters.approval_status" class="form-control form-control-sm" @change="fetchProducts">
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group mb-0">
                    <label class="mb-1">Category</label>
                    <select v-model="filters.category_id" class="form-control form-control-sm" @change="fetchProducts">
                      <option value="">All Categories</option>
                      <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3 text-right">
                  <button v-if="selectedProducts.length > 0" class="btn btn-sm btn-success mr-1" @click="bulkApprove">
                    <i class="fas fa-check mr-1"></i>Approve ({{ selectedProducts.length }})
                  </button>
                  <button v-if="selectedProducts.length > 0" class="btn btn-sm btn-danger" @click="bulkReject">
                    <i class="fas fa-times mr-1"></i>Reject ({{ selectedProducts.length }})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Table -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i class="fas fa-box mr-2"></i>Products</h3>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Seller</th>
                    <th>Category</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">MRP</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="10" class="text-center py-4">
                      <i class="fas fa-spinner fa-spin mr-2"></i>Loading...
                    </td>
                  </tr>
                  <tr v-else-if="products.length === 0">
                    <td colspan="10" class="text-center py-4 text-muted">No products found</td>
                  </tr>
                  <tr v-for="product in products" :key="product.id" :class="{'table-warning': product.approval_status === 'pending'}">
                    <td><input type="checkbox" :value="product.id" v-model="selectedProducts" /></td>
                    <td>
                      <img
                        :src="getProductImage(product)"
                        style="width:50px; height:50px; object-fit:cover; border-radius:4px;"
                        @error="$event.target.src = mediaUrl + 'defaults/placeholder.png'"
                      />
                    </td>
                    <td>
                      <strong>{{ product.name || 'Unnamed' }}</strong>
                      <br><small class="text-muted">ID: {{ product.id }}</small>
                    </td>
                    <td>{{ product.company ? product.company.name : '-' }}</td>
                    <td>{{ product.category ? product.category.name : '-' }}</td>
                    <td class="text-right">
                      ₹{{ getPrice(product) }}
                    </td>
                    <td class="text-right">
                      ₹{{ getMrp(product) }}
                    </td>
                    <td>
                      <span class="badge" :class="statusBadge(product.approval_status)">
                        {{ product.approval_status || 'pending' }}
                      </span>
                    </td>
                    <td>{{ formatDate(product.created_at) }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-info btn-sm" @click="viewProduct(product)" title="View">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button v-if="product.approval_status !== 'approved'" class="btn btn-success btn-sm" @click="approveProduct(product)" title="Approve">
                          <i class="fas fa-check"></i>
                        </button>
                        <button v-if="product.approval_status !== 'rejected'" class="btn btn-danger btn-sm" @click="openRejectModal(product)" title="Reject">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer" v-if="pagination.last_page > 1">
              <nav>
                <ul class="pagination pagination-sm m-0 float-right">
                  <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">«</a>
                  </li>
                  <li class="page-item" v-for="p in paginationPages" :key="p" :class="{ active: p === pagination.current_page }">
                    <a class="page-link" href="#" @click.prevent="changePage(p)">{{ p }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
                    <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">»</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Product Detail Modal -->
    <v-dialog v-model="showDetailModal" max-width="700">
      <v-card>
        <v-card-title class="headline">Product Details</v-card-title>
        <v-card-text v-if="selectedProduct">
          <div class="row">
            <div class="col-md-4">
              <img
                :src="getProductImage(selectedProduct)"
                style="width:100%; border-radius:8px;"
                @error="$event.target.src = mediaUrl + 'defaults/placeholder.png'"
              />
            </div>
            <div class="col-md-8">
              <table class="table table-bordered table-sm">
                <tr><th width="35%">Name</th><td>{{ selectedProduct.name }}</td></tr>
                <tr><th>Seller</th><td>{{ selectedProduct.company ? selectedProduct.company.name : '-' }}</td></tr>
                <tr><th>Category</th><td>{{ selectedProduct.category ? selectedProduct.category.name : '-' }}</td></tr>
                <tr><th>Price</th><td>₹{{ getPrice(selectedProduct) }}</td></tr>
                <tr><th>MRP</th><td>₹{{ getMrp(selectedProduct) }}</td></tr>
                <tr><th>Description</th><td>{{ selectedProduct.small_description || selectedProduct.description || '-' }}</td></tr>
                <tr><th>HSN Code</th><td>{{ selectedProduct.hsn_code || '-' }}</td></tr>
                <tr><th>Status</th><td><span class="badge" :class="statusBadge(selectedProduct.approval_status)">{{ selectedProduct.approval_status || 'pending' }}</span></td></tr>
                <tr v-if="selectedProduct.rejection_reason"><th>Rejection Reason</th><td class="text-danger">{{ selectedProduct.rejection_reason }}</td></tr>
                <tr><th>Active</th><td>{{ selectedProduct.is_active ? 'Yes' : 'No' }}</td></tr>
                <tr><th>Added On</th><td>{{ formatDate(selectedProduct.created_at) }}</td></tr>
              </table>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showDetailModal = false">Close</v-btn>
          <v-btn v-if="selectedProduct && selectedProduct.approval_status !== 'approved'" color="success" @click="approveProduct(selectedProduct); showDetailModal = false">Approve</v-btn>
          <v-btn v-if="selectedProduct && selectedProduct.approval_status !== 'rejected'" color="error" @click="openRejectModal(selectedProduct); showDetailModal = false">Reject</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject Modal -->
    <v-dialog v-model="showRejectModal" max-width="450">
      <v-card>
        <v-card-title class="headline">Reject Product</v-card-title>
        <v-card-text>
          <p v-if="rejectingProduct">Reject <strong>{{ rejectingProduct.name }}</strong>?</p>
          <v-textarea v-model="rejectionReason" label="Rejection Reason" rows="3" outline></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showRejectModal = false">Cancel</v-btn>
          <v-btn color="error" :loading="actionLoading" @click="confirmReject">Reject</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import moment from "moment";
import BackButton from "~/components/BackButton";

export default {
  components: { BackButton },
  data() {
    return {
      products: [],
      sellers: [],
      categories: [],
      loading: false,
      actionLoading: false,
      selectedProducts: [],
      selectAll: false,
      filters: {
        search: "",
        company_id: "",
        approval_status: "",
        category_id: "",
      },
      pagination: { current_page: 1, last_page: 1, total: 0 },
      statusCounts: { total: 0, pending: 0, approved: 0, rejected: 0 },
      showDetailModal: false,
      showRejectModal: false,
      selectedProduct: null,
      rejectingProduct: null,
      rejectionReason: "",
      searchTimeout: null,
      mediaUrl: "",
    };
  },
  computed: {
    paginationPages() {
      let pages = [];
      let start = Math.max(1, this.pagination.current_page - 2);
      let end = Math.min(this.pagination.last_page, start + 4);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  mounted() {
    this.mediaUrl = this.$axios.defaults.baseURL
      ? this.$axios.defaults.baseURL.replace("/api", "/media/")
      : "/media/";
    this.fetchSellers();
    this.fetchCategories();
    this.fetchProducts();
    this.fetchStatusCounts();
  },
  methods: {
    async fetchSellers() {
      try {
        const res = await this.$axios.get("companies");
        this.sellers = res.data.data || res.data.companies || [];
      } catch (e) { this.sellers = []; }
    },
    async fetchCategories() {
      try {
        const res = await this.$axios.get("categories");
        this.categories = res.data.data || res.data.categories || [];
      } catch (e) { this.categories = []; }
    },
    async fetchProducts(page) {
      this.loading = true;
      try {
        let params = { page: page || 1 };
        if (this.filters.search) params.search = this.filters.search;
        if (this.filters.company_id) params.company_id = this.filters.company_id;
        if (this.filters.approval_status) params.approval_status = this.filters.approval_status;
        if (this.filters.category_id) params.category_id = this.filters.category_id;

        const res = await this.$axios.get("seller_products", { params });
        const data = res.data;
        this.products = data.data || [];
        this.pagination = {
          current_page: data.current_page || 1,
          last_page: data.last_page || 1,
          total: data.total || 0,
        };
      } catch (e) {
        this.products = [];
      }
      this.loading = false;
    },
    async fetchStatusCounts() {
      try {
        const res = await this.$axios.get("seller_products/status_counts");
        this.statusCounts = res.data;
      } catch (e) {}
    },
    setFilter(status) {
      this.filters.approval_status = status === 'all' ? '' : status;
      this.fetchProducts();
    },
    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.fetchProducts(), 400);
    },
    changePage(p) {
      if (p < 1 || p > this.pagination.last_page) return;
      this.fetchProducts(p);
    },
    toggleSelectAll() {
      this.selectedProducts = this.selectAll ? this.products.map((p) => p.id) : [];
    },
    getProductImage(product) {
      if (product.product_images && product.product_images.length > 0) {
        return this.mediaUrl + product.product_images[0].imagepath;
      }
      if (product.imagepath1) return this.mediaUrl + product.imagepath1;
      return this.mediaUrl + "defaults/placeholder.png";
    },
    getPrice(product) {
      if (product.product_prices && product.product_prices.length > 0) {
        return parseFloat(product.product_prices[0].offer_price || product.product_prices[0].price || 0).toFixed(2);
      }
      return "0.00";
    },
    getMrp(product) {
      if (product.product_prices && product.product_prices.length > 0) {
        return parseFloat(product.product_prices[0].price || 0).toFixed(2);
      }
      return "0.00";
    },
    viewProduct(product) {
      this.selectedProduct = product;
      this.showDetailModal = true;
    },
    async approveProduct(product) {
      if (!confirm("Approve this product?")) return;
      try {
        await this.$axios.post(`seller_products/${product.id}/approve`);
        this.$toast.success("Product approved");
        this.fetchProducts(this.pagination.current_page);
        this.fetchStatusCounts();
      } catch (e) {
        this.$toast.error("Failed to approve product");
      }
    },
    openRejectModal(product) {
      this.rejectingProduct = product;
      this.rejectionReason = "";
      this.showRejectModal = true;
    },
    async confirmReject() {
      this.actionLoading = true;
      try {
        await this.$axios.post(`seller_products/${this.rejectingProduct.id}/reject`, {
          rejection_reason: this.rejectionReason,
        });
        this.$toast.success("Product rejected");
        this.showRejectModal = false;
        this.fetchProducts(this.pagination.current_page);
        this.fetchStatusCounts();
      } catch (e) {
        this.$toast.error("Failed to reject product");
      }
      this.actionLoading = false;
    },
    async bulkApprove() {
      if (!confirm(`Approve ${this.selectedProducts.length} products?`)) return;
      try {
        await this.$axios.post("seller_products/bulk_approve", {
          product_ids: this.selectedProducts,
        });
        this.$toast.success("Products approved");
        this.selectedProducts = [];
        this.selectAll = false;
        this.fetchProducts(this.pagination.current_page);
        this.fetchStatusCounts();
      } catch (e) {
        this.$toast.error("Failed to approve products");
      }
    },
    async bulkReject() {
      if (!confirm(`Reject ${this.selectedProducts.length} products?`)) return;
      try {
        await this.$axios.post("seller_products/bulk_reject", {
          product_ids: this.selectedProducts,
          rejection_reason: "Rejected by admin (bulk action)",
        });
        this.$toast.success("Products rejected");
        this.selectedProducts = [];
        this.selectAll = false;
        this.fetchProducts(this.pagination.current_page);
        this.fetchStatusCounts();
      } catch (e) {
        this.$toast.error("Failed to reject products");
      }
    },
    statusBadge(status) {
      const map = { pending: "badge-warning", approved: "badge-success", rejected: "badge-danger" };
      return map[status] || "badge-secondary";
    },
    formatDate(d) {
      return d ? moment(d).format("DD MMM YYYY") : "-";
    },
  },
};
</script>

<style scoped>
.small-box .icon i { font-size: 50px; opacity: 0.3; }
.badge { text-transform: capitalize; font-size: 12px; padding: 4px 8px; }
</style>
