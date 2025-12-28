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

              <h1 class="m-0 text-dark">Purchase Details</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link
                    :to="`/organizations/${this.organization.value}/purchases`"
                    >Purchases</nuxt-link
                  >
                </li>
                <li class="breadcrumb-item active">Create</li>
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
            <div class="col-md-12">
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Add Purchase Details</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Select Vendor</label>
                        <v-select
                          v-model="form.vendor_id"
                          :reduce="(vendor) => vendor.code"
                          :options="vendors"
                        ></v-select>
                        <span class="help-block" v-if="errors.vendor_id">{{
                          errors.vendor_id[0]
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Invoice No</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Enter invoice no"
                          v-model="form.invoice_no"
                        />
                        <span class="help-block" v-if="errors.invoice_no">{{
                          errors.invoice_no[0]
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Total</label>
                        <br />
                        {{ cost }} Rupees
                      </div>
                    </div>
                  </div>
                  <label class="form-label">Purchase Details</label>
                  <button
                    class="btn btn-primary btn-sm"
                    @click="addPurchaseDetail"
                  >
                    Add
                  </button>
                  <br /><br />
                  <div class="row" v-for="(detail, d) in form.purchase_details">
                    <div class="col-md-1">
                      <label class="form-label">{{ d + 1 }}.</label>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <v-select
                          v-model="detail.inventory_id"
                          :reduce="(inventory) => inventory.code"
                          :options="inventories"
                          @input="
                            selectPurchaseDetailUnit(
                              detail.position,
                              detail.inventory_id
                            )
                          "
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <div class="input-group mb-3">
                          <input
                            type="number"
                            class="form-control"
                            placeholder="Enter quantity"
                            v-model="detail.quantity"
                          />
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">{{
                              detail.unit
                            }}</span>
                          </div>
                        </div>
                        <span class="help-block" v-if="errors.quantity">{{
                          errors.quantity[0]
                        }}</span>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <div class="input-group mb-3">
                          <input
                            type="number"
                            class="form-control"
                            placeholder="Enter amount"
                            v-model="detail.purchase_detail_cost"
                          />
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"
                              >₹</span
                            >
                          </div>
                        </div>
                        <span
                          class="help-block"
                          v-if="errors.purchase_detail_cost"
                          >{{ errors.purchase_detail_cost[0] }}</span
                        >
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="form-group">
                        <button
                          class="btn btn-primary btn-small"
                          @click="removePurchaseDetail(detail.position)"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- End row -->
                  <div class="form-footer">
                    <button
                      class="btn btn-primary btn-block"
                      @click="store"
                      :disabled="loading"
                    >
                      {{ loading ? "Saving..." : "Add Purchase" }}
                    </button>
                  </div>
                </div>
                <!-- end form start -->
              </div>
            </div>
          </div>
          <!-- /.row -->
        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
import "vue-select/dist/vue-select.css";
import moment from "moment";

export default {
  name: "CreatePurchase",
  components: {
    BackButton,
  },
  async asyncData({ $axios, params }) {
    let u = await $axios.get(`/users?role_id=7`);
    u = u.data.data;
    let users = [];
    users.push({
      label: "Select Vendor",
      code: "",
    });
    u.forEach((user) => {
      users.push({
        label: user.name,
        code: user.id,
      });
    });
    let i = await $axios.get(`/inventories`);
    i = i.data.data;
    let inventories = [];
    inventories.push({
      label: "Select Inventory",
      code: "",
    });
    i.forEach((inventory) => {
      inventories.push({
        code: inventory.id,
        label: inventory.name,
        unit_id: inventory.unit_id,
        unit: inventory.unit.name,
      });
    });
    return {
      vendors: users,
      inventories: inventories,
    };
  },
  data: () => ({
    form: {
      vendor_id: "",
      invoice_no: "",
      purchase_cost: 0,
      purchase_details: [],
    },
    userid: "",
    loading: false,
  }),

  computed: {
    cost() {
      let cost = 0;
      this.form.purchase_details.forEach((detail) => {
        cost += parseInt(detail.purchase_detail_cost);
      });
      return cost;
    },
  },
  mounted() {
    this.addPurchaseDetail();
  },
  methods: {
    addPurchaseDetail() {
      this.form.purchase_details.push({
        position: this.form.purchase_details.length,
        inventory_id: "",
        quantity: "",
        unit_id: "",
        unit: "",
        purchase_detail_cost: 0,
      });
    },
    removePurchaseDetail(position) {
      this.form.purchase_details = this.form.purchase_details.filter(
        (detail) => detail.position != position
      );
    },
    selectPurchaseDetailUnit(position, inventoryId) {
      let inventory = this.inventories.find((i) => i.code == inventoryId);
      console.log(this.form.purchase_details[0]);
      if (inventory) {
        this.form.purchase_details[position].unit_id = inventory.unit_id;
        this.form.purchase_details[position].unit = inventory.unit;
      }
    },
    assignCost() {
      this.form.purchase_cost = this.cost;
    },
    async store() {
      this.assignCost();
      this.loading = true;
      try {
        await this.$axios.post(`/purchases`, this.form);
        this.$router.push(
          `/organizations/${this.organization.value}/purchases`
        );
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>
