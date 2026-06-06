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

              <h1 class="m-0 text-dark">Order Status of {{ order.name }}</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Categories</li>
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
            <div class="col-12">
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Sub Categories</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/organizations/${organization.value}/orders/${order.id}/order-statuses/create`"
                    >Add New</nuxt-link
                  >
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <th>Image</th>
                        <th>order</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr
                        v-for="(sub_order, i) in order.sub_categories"
                        :key="`sub_order${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/organizations/${organization.value}/categories/${order.id}/sub-categories/${sub_order.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            title="Delete Inspector"
                            class="icon"
                            to=""
                          >
                            <span @click="del(sub_order.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>
                          <img
                            style="width: 50px; height: 50px"
                            :src="
                              sub_order.imagepath
                                ? mediaUrl + sub_order.imagepath
                                : '/product-vector.png'
                            "
                          />
                        </td>
                        <td>{{ sub_order.name }}</td>
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
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
export default {
  name: "ManageOrderStatus",
  components: {
    BackButton,
  },
  data: () => ({
    order: {},
    loading: true,
  }),
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.order = {};
      this.loading = true;
      let order = await this.$axios.get(
        `/orders/${this.$route.params.orderId}`
      );
      this.order = order.data.data;
      this.loading = false;
    },

    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(
          `/orders/${this.order.id}/order_details/${id}`
        );
        this.getData();
      }
    },
  },
};
</script>
