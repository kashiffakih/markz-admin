<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">NDR Management</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">NDR Management</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Update NDR Action</h3>
                </div>
                <div class="card-body">
                  <p class="text-muted">
                    Submit actions for orders that failed to deliver (Non-Delivery Report). 
                    You can request a re-attempt or reschedule the pickup.
                  </p>
                  <form @submit.prevent="updateNdr">
                    <div class="form-group">
                      <label>Waybills (Comma separated)</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="waybills" 
                        placeholder="e.g. 13163116xxxx, 13163116yyyy"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label>Action</label>
                      <select class="form-control" v-model="action" required>
                        <option value="RE-ATTEMPT">Re-Attempt Delivery</option>
                        <option value="PICKUP_RESCHEDULE">Reschedule Pickup</option>
                      </select>
                    </div>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                      {{ loading ? 'Updating...' : 'Update NDR' }}
                    </button>
                  </form>
                </div>
              </div>

              <!-- Status Result -->
              <div class="card mt-4" v-if="request_id">
                <div class="card-header">
                  <h3 class="card-title">NDR Update Request Status</h3>
                  <button class="btn btn-sm btn-info float-right" @click="checkStatus" :disabled="statusLoading">
                    {{ statusLoading ? 'Checking...' : 'Refresh Status' }}
                  </button>
                </div>
                <div class="card-body">
                  <p><strong>Request ID (UPL):</strong> {{ request_id }}</p>
                  <div v-if="statusResult">
                    <p><strong>Status:</strong> {{ statusResult.status }}</p>
                    <p><strong>Remark:</strong> {{ statusResult.remark }}</p>
                    
                    <h5 class="mt-3 text-success" v-if="statusResult.success_wbns && statusResult.success_wbns.length">Success:</h5>
                    <ul class="text-success">
                      <li v-for="(wb, idx) in statusResult.success_wbns" :key="'s'+idx">
                        Waybill: {{ wb.waybill }} - Action: {{ wb.action }}
                      </li>
                    </ul>

                    <h5 class="mt-3 text-danger" v-if="statusResult.failed_wbns && statusResult.failed_wbns.length">Failed:</h5>
                    <ul class="text-danger">
                      <li v-for="(wb, idx) in statusResult.failed_wbns" :key="'f'+idx">
                        Waybill: {{ wb.waybill }} - Reason: {{ wb.message }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  name: "NdrManagement",
  components: {
    BackButton,
  },
  data() {
    return {
      waybills: "",
      action: "RE-ATTEMPT",
      loading: false,
      statusLoading: false,
      request_id: null,
      statusResult: null,
    };
  },
  methods: {
    async updateNdr() {
      this.loading = true;
      this.statusResult = null;
      try {
        let response = await this.$axios.post('/delhivery/ndr/update', {
          waybills: this.waybills,
          action: this.action
        });
        
        if (response.data && response.data.request_id) {
          this.request_id = response.data.request_id;
          alert('NDR Update request submitted successfully. Request ID: ' + this.request_id);
          this.checkStatus();
        } else {
          alert('Failed to submit NDR update. See console.');
          console.error(response.data);
        }
      } catch (error) {
        alert('Error updating NDR');
        console.error(error);
      }
      this.loading = false;
    },
    
    async checkStatus() {
      if (!this.request_id) return;
      this.statusLoading = true;
      try {
        let response = await this.$axios.get(`/delhivery/ndr/status?request_id=${this.request_id}`);
        this.statusResult = response.data;
      } catch (error) {
        alert('Error checking status');
        console.error(error);
      }
      this.statusLoading = false;
    }
  }
};
</script>
