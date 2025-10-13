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

              <h1 class="m-0 text-dark">Customer Addresses</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link to="/customers">Customers</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Addresses</li>
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
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Customer Addresses</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Pincode</th>
                        <th>Phone</th>
                        <!-- <th>Actions</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="8">Loading...</td>
                      </tr>
                      <tr
                        v-for="(address, i) in addresses"
                        :key="`address${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td>{{ address.label || "N/A" }}</td>
                        <td>
                          {{
                            [
                              address.add_1,
                              address.add_2,
                              address.add_3,
                              address.landmark,
                            ]
                              .filter(Boolean)
                              .join(", ") || "N/A"
                          }}
                        </td>
                        <td>{{ address.city || "N/A" }}</td>
                        <td>{{ address.state || "N/A" }}</td>
                        <td>{{ address.pincode || "N/A" }}</td>
                        <td>{{ address.phone || "N/A" }}</td>
                        <!-- <td>
                          <nuxt-link
                            title="Edit Address"
                            class="icon"
                            :to="`/customers/${$route.params.id}/addresses/${address.id}/edit`"
                          >
                            <i class="fa fa-edit"></i>
                          </nuxt-link>
                        </td> -->
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
  name: "CustomerAddresses",
  components: {
    BackButton,
  },
  data: () => ({
    addresses: [],
    loading: true,
  }),
  async mounted() {
    await this.getAddresses();
  },
  methods: {
    async getAddresses() {
      try {
        this.loading = true;
        // Get customer ID from route parameters
        const customerId = this.$route.params.id;

        // Fetch user addresses from the API
        const response = await this.$axios.get(
          `/user_addresses?userId=${customerId}`
        );
        this.addresses = response.data.data || [];
      } catch (error) {
        console.error("Error fetching customer addresses:", error);
        this.addresses = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
