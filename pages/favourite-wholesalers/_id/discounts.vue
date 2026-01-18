<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Manage Discounts</h1>
              <p v-if="wholesaler" class="text-muted">
                For: {{ wholesaler.business_name }} ({{
                  wholesaler.first_name
                }}
                {{ wholesaler.last_name }})
              </p>
            </div>
            <div class="col-sm-6">
              <button class="btn btn-primary float-right" @click="openAddModal">
                <i class="fa fa-plus"></i> Add Product Discount
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Product Discounts</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-hover table-striped">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Discount (%)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="4">Loading...</td>
                      </tr>
                      <tr v-for="item in discounts" :key="item.id">
                        <td>
                          {{ item.product ? item.product.name : "Unknown" }}
                        </td>
                        <td>
                          {{
                            item.product && item.product.category
                              ? item.product.category.name
                              : "-"
                          }}
                        </td>
                        <td>{{ item.discount }}%</td>
                        <td>
                          <button
                            class="btn btn-sm btn-danger"
                            @click="deleteDiscount(item.id)"
                            title="Remove Discount"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="!loading && discounts.length === 0">
                        <td colspan="4" class="text-center">
                          No discounts found.
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

      <!-- Add Discount Modal -->
      <div
        class="modal fade"
        id="addDiscountModal"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Product Discount</h5>
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
              <div class="form-group">
                <label>Search Product</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="productSearch"
                  @keyup.enter="searchProducts"
                  placeholder="Enter product name..."
                />
                <button
                  class="btn btn-secondary mt-2 btn-sm"
                  @click="searchProducts"
                >
                  Search
                </button>
              </div>

              <div
                class="list-group mb-3"
                style="max-height: 200px; overflow-y: auto"
                v-if="productResults && productResults.length > 0"
              >
                <a
                  href="#"
                  class="list-group-item list-group-item-action"
                  v-for="prod in productResults"
                  :key="prod.id"
                  @click.prevent="toggleProductSelection(prod)"
                  :class="{
                    active: selectedProducts.find((p) => p.id === prod.id),
                  }"
                >
                  {{ prod.name }} ({{
                    prod.category ? prod.category.name : ""
                  }})
                </a>
              </div>

              <div class="mb-3" v-if="selectedProducts.length > 0">
                <label>Selected Products:</label>
                <div>
                  <span
                    v-for="p in selectedProducts"
                    :key="p.id"
                    class="badge badge-info mr-1"
                  >
                    {{ p.name }}
                    <i
                      class="fa fa-times"
                      @click="toggleProductSelection(p)"
                      style="cursor: pointer"
                    ></i>
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label>Discount Percentage (%)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="discountValue"
                  min="0"
                  max="100"
                  placeholder="e.g. 10"
                />
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
              <button
                type="button"
                class="btn btn-primary"
                @click="saveDiscounts"
                :disabled="selectedProducts.length === 0 || !discountValue"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  name: "WholesalerDiscounts",
  components: { BackButton },
  data() {
    return {
      wholesaler: null,
      discounts: [],
      loading: false,
      productSearch: "",
      productResults: [],
      selectedProducts: [],
      discountValue: 0,
    };
  },
  async mounted() {
    await this.getWholesaler();
    this.getData();
  },
  methods: {
    async getWholesaler() {
      try {
        const id = this.$route.params.id;
        const response = await this.$axios.get(`/users/${id}`);
        this.wholesaler = response.data.data;
      } catch (error) {
        console.error("Error fetching wholesaler:", error);
      }
    },
    async getData() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const response = await this.$axios.get(`/users/${id}/discounts`);
        this.discounts = response.data.data;
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
      this.loading = false;
    },
    async deleteDiscount(id) {
      if (
        await this.$root.confirm(
          "Are you sure you want to remove this discount?"
        )
      ) {
        try {
          await this.$axios.delete(`/discounts/${id}`);
          this.getData();
        } catch (error) {
          await this.$root.alert("Failed to delete discount.");
        }
      }
    },
    openAddModal() {
      this.productSearch = "";
      this.productResults = [];
      this.selectedProducts = [];
      this.discountValue = 0;
      if (typeof $ !== "undefined") $("#addDiscountModal").modal("show");
    },
    async searchProducts() {
      if (!this.productSearch) return;
      try {
        const response = await this.$axios.get(
          `/products?search=${this.productSearch}`
        );
        // Handle pagination or direct array
        let results = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          // Direct array or paginated data
          results = response.data.data;
        } else if (
          response.data.data &&
          response.data.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          // Paginated response structure: { data: { data: [...] } }
          results = response.data.data.data;
        } else if (Array.isArray(response.data)) {
          results = response.data;
        }

        this.productResults = results || [];
      } catch (error) {
        console.error("Product search error:", error);
        this.productResults = [];
      }
    },
    toggleProductSelection(product) {
      const index = this.selectedProducts.findIndex((p) => p.id === product.id);
      if (index === -1) {
        this.selectedProducts.push(product);
      } else {
        this.selectedProducts.splice(index, 1);
      }
    },
    async saveDiscounts() {
      if (this.selectedProducts.length === 0 || !this.discountValue) return;
      const userId = this.$route.params.id;

      try {
        // Sequentially save discounts for selected products
        for (const product of this.selectedProducts) {
          console.log(`Saving discount for product ${product.id}`);
          await this.$axios.post(`/users/${userId}/discounts`, {
            product_id: product.id,
            discount: this.discountValue,
          });
        }

        const $ =
          window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
        if ($) $("#addDiscountModal").modal("hide");

        await this.$root.alert("Discounts saved successfully!", "Success");
        this.getData();

        // Reset
        this.selectedProducts = [];
        this.discountValue = 0;
        this.productSearch = "";
        this.productResults = [];
      } catch (error) {
        console.error("Save error:", error);
        let msg = "Failed to save discounts.";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            msg = error.response.data.message;
          }
          if (error.response.data.errors) {
            // specific validation errors
            const errors = error.response.data.errors;
            msg += " " + Object.values(errors).flat().join(", ");
          }
        }
        await this.$root.alert(msg, "Error");
      }
    },
  },
};
</script>
