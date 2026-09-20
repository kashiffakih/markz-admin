<template>
  <div class="modal fade" id="createReturnModal" tabindex="-1" role="dialog" aria-labelledby="createReturnModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createReturnModalLabel">Schedule Delhivery Return (RVP)</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form @submit.prevent="submitReturn">
          <div class="modal-body">
            <p><strong>Order ID:</strong> {{ order.id }}</p>
            <p><strong>Waybill:</strong> {{ order.delhivery_waybill }}</p>

            <div class="form-group">
              <label>Select Items to Return</label>
              <div v-for="item in order.order_details" :key="item.id" class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" :id="'item-'+item.id" :value="item" v-model="selectedItems">
                <label class="custom-control-label" :for="'item-'+item.id">
                  {{ item.product ? item.product.name : 'Unknown Product' }} 
                  (Qty: {{ item.quantity }})
                </label>
              </div>
            </div>

            <hr>
            <h6>Quality Check (QC) Settings</h6>
            <div class="form-group">
              <label>QC Required</label>
              <select class="form-control" v-model="qcRequired">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            
            <div class="form-group" v-if="qcRequired === 'Yes'">
              <label>QC Instructions (Comma separated)</label>
              <input type="text" class="form-control" v-model="qcInstructions" placeholder="e.g. Item should be sealed, IMEI must match">
            </div>

            <div class="form-group" v-if="qcRequired === 'Yes'">
              <label>Action on QC Fail</label>
              <select class="form-control" v-model="qcFailAction">
                <option value="Return to Customer">Return to Customer</option>
                <option value="Return to Origin">Return to Origin Anyway</option>
              </select>
            </div>
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" :disabled="loading || selectedItems.length === 0">
              {{ loading ? 'Scheduling...' : 'Schedule Return' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateReturnModal",
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedItems: [],
      qcRequired: 'No',
      qcInstructions: '',
      qcFailAction: 'Return to Customer',
      loading: false
    };
  },
  methods: {
    async submitReturn() {
      this.loading = true;
      try {
        let customQc = [];
        if (this.qcRequired === 'Yes') {
          customQc = [
            {
              "qc_instructions": this.qcInstructions,
              "action_on_fail": this.qcFailAction,
              "items": this.selectedItems.map(i => ({
                "item_name": i.product ? i.product.name : 'Unknown',
                "quantity": i.quantity
              }))
            }
          ];
        }

        let response = await this.$axios.post('/delhivery/rvp/create', {
          order_id: this.order.id,
          custom_qc: customQc
        });

        if (response.data && response.data.waybill) {
          alert('Return Pickup scheduled successfully! Waybill: ' + response.data.waybill);
          $('#createReturnModal').modal('hide');
          this.$emit('return-scheduled', response.data);
        } else {
          alert('Failed to schedule return. Please check console.');
          console.error(response.data);
        }
      } catch (error) {
        alert('An error occurred while scheduling return.');
        console.error(error);
      }
      this.loading = false;
    }
  }
}
</script>
