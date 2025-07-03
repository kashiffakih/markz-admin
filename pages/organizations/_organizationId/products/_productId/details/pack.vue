<template>
  <!-- Prices -->
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Add Packs of {{ product.name }}</h3>
              &nbsp;
            </div>
            <!-- /.card-header -->
            <!-- <div class="card-body table-responsive p-0">
              <div class="container">
                <br />
                <input
                  type="text"
                  v-model="form.value"
                  placeholder="Enter  size"
                />&nbsp;&nbsp;
                <input
                  type="number"
                  v-model="form.points"
                  placeholder="Enter  point"
                />&nbsp;&nbsp;
                <select v-model="form.unit_id">
                  <option
                    v-for="(unit, u) in units"
                    :key="`unit${u}`"
                    :value="unit.code"
                  >
                    {{ unit.label }}
                  </option></select
                >&nbsp;&nbsp; of {{ product.name }}
                <br />
                <span class="help-block" v-if="errors.value">{{
                  errors.value[0]
                }}</span>
                <span class="help-block" v-if="errors.unit_id"
                  ><br />{{ errors.unit_id[0] }}</span
                >
                <br />
                <button class="btn btn-primary" @click="update" v-if="form.id">
                  {{ loading ? "Saving..." : "Update Conversion" }}
                </button>
                <button class="btn btn-primary" @click="store" v-else>
                  {{ loading ? "Saving..." : "Add Conversion" }}
                </button>
              </div>
              <br />
            </div> -->

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
                    <!-- <button
                      class="btn btn-primary"
                      :disabled="loading"
                      @click="form.id ? update : store"
                    >
                      {{
                        loading
                          ? "Saving..."
                          : form.id
                          ? "Update Conversion"
                          : "Add Conversion"
                      }}
                    </button> -->
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
            <!-- /.card-body -->

            <div class="card-header">
              <h3 class="card-title">Packs & Prices</h3>
              &nbsp;
            </div>
            <!-- /.card-header -->
            <!-- <div class="card-body table-responsive p-0">
              <table class="table table-head-fixed table-striped">
                <tbody>
                  <tr v-if="loading">
                    <td colspan="13">Loading...</td>
                  </tr>
                  <tr v-for="(pack, i) in packs" :key="`pack${i}`">
                    <div class="container">
                      <br />
                      <div class="card">
                        <div class="card-header">
                          <h6>
                            {{ pack.value }} {{ pack.unit.name }} of
                            {{ product.name }}.
                            <nuxt-link title="Delete pack" class="icon" to="">
                              <span @click="edit(pack.id)">
                                <i class="fa fa-edit"></i>
                              </span> </nuxt-link
                            >&nbsp;&nbsp;
                            <nuxt-link title="Delete pack" class="icon" to="">
                              <span @click="del(pack.id)">
                                <i class="fa fa-trash"></i>
                              </span>
                            </nuxt-link>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div> -->
            <div class="card-body table-responsive p-3">
              <table class="table table-head-fixed table-striped">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Size</th>
                    <th>Unit</th>
                    <th>Product</th>
                    <th>Customer Price</th>
                    <th>Customer Offer Price</th>
                    <th>Vendor Price</th>
                    <th>Vendor Offer Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="8" class="text-center">Loading...</td>
                  </tr>
                  <tr v-else v-for="(pack, i) in packs" :key="`pack${i}`">
                    <td>{{ i + 1 }}</td>
                    <td>{{ pack.value }}</td>
                    <td>{{ pack.unit.name }}</td>
                    <td>{{ product.name }}</td>
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
            <!-- /.card-body -->
          </div>
          <!-- /.card -->
        </div>
      </div>
      <!-- /.row -->
    </div>
  </section>
  <!-- /.content -->
</template>

<script type="text/javascript">
export default {
  name: "ProductPack",
  data: () => ({
    packs: [],
    form: {
      unit_id: "",
      is_default: false,
      product_prices: [
        "price",
        "offer_price",
        "distributor_price",
        "distributor_offer_price",
      ].map((field) => ({
        [field]: null,
      })),
    },
    loading: false,
  }),
  props: ["product", "units"],
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      let packs = await this.$axios.get(
        `/products/${this.$route.params.productId}/product_packs`
      );
      this.packs = packs.data.data;
      this.loading = false;
      this.$emit("updatePacks", this.packs);
    },
    async store() {
      this.loading = true;
      try {
        let admin = await this.$axios.post(
          `/products/${this.product.id}/product_packs`,
          this.form
        );
        this.loading = false;
        this.emptyForm();
        this.getData();
      } catch (e) {
        this.loading = false;
      }
    },
    async edit(id) {
      let form = await this.$axios.get(
        `/products/${this.product.id}/product_packs/${id}`
      );
      this.form = form.data.data;
    },
    async update() {
      this.loading = true;
      try {
        let admin = await this.$axios.patch(
          `/products/${this.product.id}/product_packs/${this.form.id}`,
          this.form
        );
        this.loading = false;
        this.emptyForm();
        this.getData();
      } catch (e) {
        this.loading = false;
      }
    },
    async del(id) {
      let r = confirm("Are you sure you want to delete the data?");
      if (r == true)
        await this.$axios.delete(
          `/products/${this.product.id}/product_packs/${id}`
        );
      this.getData();
    },
    emptyForm() {
      this.form = {
        unit_id: "",
        is_default: false,
        product_prices: [
          "price",
          "offer_price",
          "distributor_price",
          "distributor_offer_price",
        ].map((field) => ({
          [field]: null,
        })),
      };
    },
  },
};
</script>
