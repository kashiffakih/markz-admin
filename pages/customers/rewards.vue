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

              <h1 class="m-0 text-dark">Customer Rewards</h1>
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
                <li class="breadcrumb-item active">Rewards</li>
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
                  <h3 class="card-title">Customer Rewards</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Reward Name</th>
                        <th>Points</th>
                        <th>Value</th>
                        <th>Date Earned</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="7">Loading...</td>
                      </tr>
                      <tr v-for="(reward, i) in rewards" :key="`reward${i}`">
                        <td>{{ i + 1 }}</td>
                        <td>{{ reward.name || "N/A" }}</td>
                        <td>{{ reward.points || 0 }}</td>
                        <td>{{ reward.value || 0 }}</td>
                        <td>{{ reward.date_earned || "N/A" }}</td>
                        <td>{{ reward.expiry_date || "N/A" }}</td>
                        <td>
                          <span
                            :class="
                              reward.status === 'active'
                                ? 'badge badge-success'
                                : 'badge badge-danger'
                            "
                            >{{ reward.status || "N/A" }}</span
                          >
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
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";

export default {
  name: "CustomerRewards",
  components: {
    BackButton,
  },
  data: () => ({
    rewards: [],
    loading: true,
  }),
  async mounted() {
    await this.getRewards();
  },
  methods: {
    async getRewards() {
      try {
        this.loading = true;
        // Get customer ID from route parameters
        const customerId = this.$route.params.id;

        // Fetch customer rewards - this API endpoint needs to be implemented in the backend
        const response = await this.$axios.get(
          `/user_wallets?userId=${customerId}`
        );
        this.rewards = response.data.data || [];
      } catch (error) {
        console.error("Error fetching customer rewards:", error);
        this.rewards = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
