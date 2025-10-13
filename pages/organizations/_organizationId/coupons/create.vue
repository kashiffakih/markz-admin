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

              <h1 class="m-0 text-dark">Coupon</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link
                    :to="`/organizations/${this.organization.value}/coupons`"
                    >Coupons</nuxt-link
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
          <div class="row justify-content-center">
            <!-- left column -->
            <div class="col-md-6">
              <!-- jquery validation -->
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Create Coupon</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Coupon Name</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Enter coupon name"
                      v-model="form.name"
                    />
                    <span class="help-block" v-if="errors.name">{{
                      errors.name[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label"
                      >Start Date [{{ form.start_date }}]</label
                    >
                    <date-picker
                      placeholder="DD-MM-YYYY"
                      :format="customStartDateFormatter"
                      value="form.start_date"
                    />
                    <span class="help-block" v-if="errors.start_date">{{
                      errors.start_date[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label"
                      >End Date [{{ form.end_date }}]</label
                    >
                    <date-picker
                      placeholder="DD-MM-YYYY"
                      :format="customEndDateFormatter"
                      value="form.end_date"
                    />
                    <span class="help-block" v-if="errors.end_date">{{
                      errors.end_date[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Coupon Type</label>
                    <select class="form-control" v-model="form.type">
                      <option value="">Select coupon type</option>
                      <option value="Flat">Flat</option>
                      <option value="Percent">Percent</option>
                    </select>
                    <span class="help-block" v-if="errors.type">{{
                      errors.type[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Coupon Value</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Enter coupon value"
                      v-model="form.value"
                    />
                    <span class="help-block" v-if="errors.value">{{
                      errors.value[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label"
                      >No of times a Users can use Coupon</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Enter no"
                      v-model="form.no_per_user"
                    />
                    <span class="help-block" v-if="errors.no_per_user">{{
                      errors.no_per_user[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Min. order value</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Enter min. order value"
                      v-model="form.min_order_value"
                    />
                    <span class="help-block" v-if="errors.min_order_value">{{
                      errors.min_order_value[0]
                    }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block" @click="store">
                      {{ loading ? "Saving..." : "Create Coupon" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- /.card -->
            </div>
            <!--/.col (left) -->
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
import moment from "moment";

export default {
  name: "CreateUnit",
  components: {
    BackButton
  },
  data: () => ({
    form: {
      divide_by: 1,
      start_date: "",
      end_date: "",
      type: "",
    },
    loading: false,
  }),
  mounted() {},
  
  methods: {
    customStartDateFormatter(date) {
      this.form.start_date = moment(date).format("DD-MM-YYYY");
      return moment(date).format("DD-MM-YYYY");
    },
    customEndDateFormatter(date) {
      this.form.end_date = moment(date).format("DD-MM-YYYY");
      return moment(date).format("DD-MM-YYYY");
    },
    async store() {
      this.loading = true;
      try {
        let admin = await this.$axios.post(`/company_coupons`, this.form);
        this.$router.push(`/organizations/${this.organization.value}/coupons`);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>
