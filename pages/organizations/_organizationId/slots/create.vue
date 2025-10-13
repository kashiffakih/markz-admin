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

              <h1 class="m-0 text-dark">
                
                Delivery Time Slots</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/slots`">Delivery Time Slots</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Create</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
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
                  <h3 class="card-title">Create Delivery Time Slots</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Slot</label>
                    <input type="text" class="form-control" placeholder="Enter slot"
                      v-model="form.time_slot"
                    >
                    <span class="help-block" 
                      v-if="errors.time_slot"
                    >{{ errors.time_slot[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">No of orders</label>
                    <input type="number" class="form-control" placeholder="Enter no of orders"
                      v-model="form.no_of_orders"
                    >
                    <span class="help-block" 
                      v-if="errors.no_of_orders"
                    >{{ errors.no_of_orders[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-control" v-model="form.status">
                      <option value="">Select Status</option>
                      <option value="0">In Active</option>
                      <option value="1">Active</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.no_of_orders"
                    >{{ errors.no_of_orders[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Create Slot' }}</button>
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
export default {
  name: 'CreateTag',
  components: {
    BackButton
  },
  data: () => ({
    form: {
      status: ''
    },
    tagid: '',
    loading: false
  }),
  mounted() {
  },
  
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/delivery_time_slots`, this.form)
        this.$router.push(`/organizations/${this.organization.value}/slots`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>