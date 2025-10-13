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
                  <h3 class="card-title">Customer Rewards Summary</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-info"
                          ><i class="fas fa-star"></i
                        ></span>
                        <div class="info-box-content">
                          <span class="info-box-text">Total Earned Points</span>
                          <span class="info-box-number">{{
                            summary.total_earn_points || 0
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-danger"
                          ><i class="fas fa-minus-circle"></i
                        ></span>
                        <div class="info-box-content">
                          <span class="info-box-text">Total Used Points</span>
                          <span class="info-box-number">{{
                            summary.total_used_points || 0
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-success"
                          ><i class="fas fa-gift"></i
                        ></span>
                        <div class="info-box-content">
                          <span class="info-box-text">Available Points</span>
                          <span class="info-box-number">{{
                            summary.remaining_points || 0
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="col-md-3 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-warning"
                          ><i class="fas fa-wallet"></i
                        ></span>
                        <div class="info-box-content">
                          <span class="info-box-text">Total Points</span>
                          <span class="info-box-number">{{
                            summary.total_points || 0
                          }}</span>
                        </div>
                      </div>
                    </div> -->
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Reward Transaction History</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Source</th>
                        <th>Amount</th>
                        <!-- <th>Order ID</th> -->
                        <!-- <th>Company Name</th> -->
                        <th>Date</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="7">Loading...</td>
                      </tr>
                      <tr v-for="(reward, i) in rewards" :key="`reward${i}`">
                        <td>{{ i + 1 }}</td>
                        <td>{{ reward.source || "N/A" }}</td>
                        <td>{{ reward.amount || 0 }}</td>
                        <!-- <td>{{ reward.order ? reward.order.id : "N/A" }}</td> -->
                        <!-- <td>{{ reward.order && reward.order.company ? reward.order.company.name : "N/A" }}</td> -->
                        <td>{{ reward.created_at || "N/A" }}</td>
                        <td>
                          <span
                            :class="
                              reward.source.includes('Earn')
                                ? 'badge badge-success'
                                : 'badge badge-danger'
                            "
                          >
                            {{
                              reward.source.includes("Earn") ? "Earned" : "Used"
                            }}
                          </span>
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
    summary: {},
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

        // Fetch customer rewards - using the correct API endpoint based on response structure
        const response = await this.$axios.get(
          `/user_wallets?userId=${customerId}`
        );

        // Extract reward transaction data and summary from response
        this.rewards = response.data.data || [];
        this.summary = {
          total_earn_points: response.data.total_earn_points,
          total_used_points: response.data.total_used_points,
          total_points: response.data.total_points,
          remaining_points: response.data.remaining_points,
        };
      } catch (error) {
        console.error("Error fetching customer rewards:", error);
        this.rewards = [];
        this.summary = {};
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
