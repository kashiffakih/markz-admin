<template>
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Add Packs of {{ product.name }}</h3>
            </div>

            <div class="card-body table-responsive p-3">
              <div class="container">
                <div class="row g-3 align-items-end">
                  <div class="col-md-3">
                    <label for="size-input" class="form-label">Size</label>
                    <input
                      id="size-input"
                      type="text"
                      class="form-control"
                      v-model="form.value"
                      placeholder="Enter size"
                      :class="{ 'is-invalid': errors.value }"
                    />
                    <div class="invalid-feedback" v-if="errors.value">
                      {{ errors.value[0] }}
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label for="points-input" class="form-label">Points</label>
                    <input
                      id="points-input"
                      type="number"
                      class="form-control"
                      v-model="form.points"
                      placeholder="Enter points"
                      :class="{ 'is-invalid': errors.points }"
                    />
                    <div class="invalid-feedback" v-if="errors.points">
                      {{ errors.points[0] }}
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label for="unit-select" class="form-label">Unit</label>
                    <select
                      id="unit-select"
                      class="form-select form-control"
                      v-model="form.unit_id"
                      :class="{ 'is-invalid': errors.unit_id }"
                    >
                      <option value="" disabled>Select unit</option>
                      <option
                        v-for="(unit, index) in units"
                        :key="`unit${index}`"
                        :value="unit.code"
                      >
                        {{ unit.label }}
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.unit_id">
                      {{ errors.unit_id[0] }}
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label for="customer-price" class="form-label"
                      >Customer Price</label
                    >
                    <input
                      id="customer-price"
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="form.product_prices[0]['price']"
                      placeholder="Enter customer price"
                      :class="{
                        'is-invalid': errors.product_prices?.[0]?.price?.length,
                      }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="errors.product_prices?.[0]?.price?.length"
                    >
                      {{ errors.product_prices[0].price[0] }}
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label for="customer-offer-price" class="form-label"
                      >Customer Offer Price</label
                    >
                    <input
                      id="customer-offer-price"
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="form.product_prices[0].offer_price"
                      placeholder="Enter customer offer price"
                      :class="{
                        'is-invalid':
                          errors.product_prices?.[0]?.offer_price?.length,
                      }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="errors.product_prices?.[0]?.offer_price?.length"
                    >
                      {{ errors.product_prices[0].offer_price[0] }}
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label for="vendor-price" class="form-label"
                      >Vendor Price</label
                    >
                    <input
                      id="vendor-price"
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="form.product_prices[0].distributor_price"
                      placeholder="Enter vendor price"
                      :class="{
                        'is-invalid':
                          errors.product_prices?.[0]?.distributor_price?.length,
                      }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="
                        errors.product_prices?.[0]?.distributor_price?.length
                      "
                    >
                      {{ errors.product_prices[0].distributor_price[0] }}
                    </div>
                  </div>

                  <div class="col-md-3">
                    <label for="vendor-offer-price" class="form-label"
                      >Vendor Offer Price</label
                    >
                    <input
                      id="vendor-offer-price"
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="form.product_prices[0].distributor_offer_price"
                      placeholder="Enter vendor offer price"
                      :class="{
                        'is-invalid':
                          errors.product_prices?.[0]?.distributor_offer_price
                            ?.length,
                      }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="
                        errors.product_prices?.[0]?.distributor_offer_price
                          ?.length
                      "
                    >
                      {{ errors.product_prices[0].distributor_offer_price[0] }}
                    </div>
                  </div>

                  <div class="col-12 mt-3">
                    <button
                      class="btn btn-primary"
                      @click="update"
                      v-if="form.id"
                    >
                      {{ loading ? "Saving..." : "Update Conversion" }}
                    </button>
                    <button class="btn btn-primary" @click="store" v-else>
                      {{ loading ? "Saving..." : "Add Conversion" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-header">
              <h3 class="card-title">Packs & Prices</h3>
            </div>

            <div class="card-body table-responsive p-3">
              <table class="table table-head-fixed table-striped">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Size</th>
                    <th>Unit</th>
                    <th>Product</th>
                    <th>Points</th>
                    <th>Customer Price</th>
                    <th>Customer Offer Price</th>
                    <th>Vendor Price</th>
                    <th>Vendor Offer Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="10" class="text-center">Loading...</td>
                  </tr>
                  <tr v-else-if="!filteredPacks.length">
                    <td colspan="10" class="text-center">
                      No packs available for selected unit
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="(pack, i) in filteredPacks"
                    :key="`pack${i}`"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>{{ pack.value }}</td>
                    <td>{{ pack.unit.name }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ pack.points }}</td>
                    <td>
                      {{
                        pack.product_prices?.length &&
                        pack.product_prices[0]?.price
                          ? pack.product_prices[0].price.toFixed(2)
                          : "N/A"
                      }}
                    </td>
                    <td>
                      {{
                        pack.product_prices?.length &&
                        pack.product_prices[0]?.offer_price
                          ? pack.product_prices[0].offer_price.toFixed(2)
                          : "N/A"
                      }}
                    </td>
                    <td>
                      {{
                        pack.product_prices?.length &&
                        pack.product_prices[0]?.distributor_price
                          ? pack.product_prices[0].distributor_price.toFixed(2)
                          : "N/A"
                      }}
                    </td>
                    <td>
                      {{
                        pack.product_prices?.length &&
                        pack.product_prices[0]?.distributor_offer_price
                          ? pack.product_prices[0].distributor_offer_price.toFixed(
                              2
                            )
                          : "N/A"
                      }}
                    </td>
                    <td>
                      <nuxt-link
                        title="Edit pack"
                        class="btn btn-sm btn-outline-primary me-2"
                        to=""
                      >
                        <span @click="edit(pack.id)">
                          <i class="fa fa-edit"></i> Edit
                        </span>
                      </nuxt-link>
                      <nuxt-link
                        title="Delete pack"
                        class="btn btn-sm btn-outline-danger"
                        to=""
                      >
                        <span @click="del(pack.id)">
                          <i class="fa fa-trash"></i> Delete
                        </span>
                      </nuxt-link>
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
</template>

<script type="text/javascript">
export default {
  name: "ProductPack",
  data: () => ({
    packs: [],
    form: {
      unit_id: "",
      is_default: false,
      value: "",
      points: "",
      product_prices: [
        {
          price: null,
          offer_price: null,
          distributor_price: null,
          distributor_offer_price: null,
        },
      ],
    },
    errors: {}, // Added to handle validation errors
    loading: false,
  }),
  props: ["product", "units"],
  computed: {
    filteredPacks() {
      // Filter packs based on selected unit_id
      if (!this.form.unit_id) {
        return this.packs; // Show all packs if no unit is selected
      }
      return this.packs.filter((pack) => pack.unit_id === this.form.unit_id);
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.packs = [];
      this.loading = true;
      try {
        let response = await this.$axios.get(
          `/products/${this.$route.params.productId}/product_packs`
        );
        this.packs = response.data.data;
        this.loading = false;
        this.$emit("updatePacks", this.packs);
      } catch (e) {
        this.loading = false;
        console.error("Error fetching packs:", e);
      }
    },
    async store() {
      this.loading = true;
      this.errors = {};
      try {
        await this.$axios.post(
          `/products/${this.product.id}/product_packs`,
          this.form
        );
        this.loading = false;
        this.emptyForm();
        this.getData();
      } catch (e) {
        this.loading = false;
        this.errors = e.response?.data?.errors || {};
        console.error("Error storing pack:", e);
      }
    },
    async edit(id) {
      try {
        let response = await this.$axios.get(
          `/products/${this.product.id}/product_packs/${id}`
        );
        this.form = {
          ...response.data.data,
          product_prices: response.data.data.product_prices.length
            ? response.data.data.product_prices
            : [
                {
                  price: null,
                  offer_price: null,
                  distributor_price: null,
                  distributor_offer_price: null,
                },
              ],
        };
      } catch (e) {
        console.error("Error editing pack:", e);
      }
    },
    async update() {
      this.loading = true;
      this.errors = {};
      try {
        await this.$axios.patch(
          `/products/${this.product.id}/product_packs/${this.form.id}`,
          this.form
        );
        this.loading = false;
        this.emptyForm();
        this.getData();
      } catch (e) {
        this.loading = false;
        this.errors = e.response?.data?.errors || {};
        console.error("Error updating pack:", e);
      }
    },
    async del(id) {
      let r = confirm("Are you sure you want to delete the data?");
      if (r) {
        try {
          await this.$axios.delete(
            `/products/${this.product.id}/product_packs/${id}`
          );
          this.getData();
        } catch (e) {
          console.error("Error deleting pack:", e);
        }
      }
    },
    emptyForm() {
      this.form = {
        unit_id: "",
        is_default: false,
        value: "",
        points: "",
        product_prices: [
          {
            price: null,
            offer_price: null,
            distributor_price: null,
            distributor_offer_price: null,
          },
        ],
      };
      this.errors = {};
    },
  },
};
</script>
