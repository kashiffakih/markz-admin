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
                  <h3 class="card-title">Update Delivery Time Slots</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Time Slot</label>
                    <select class="form-control" v-model="form.delivery_time_slot_id">
                      <option
                        v-for="(slot, s) in slots"
                        :key="`slot${s}`"
                        :value="slot.id"
                      >
                        {{ slot.time_slot }}
                      </option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.delivery_time_slot_id"
                    >{{ errors.delivery_time_slot_id[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Date</label>
                    {{ form.date }}
                    <client-only>
                      <date-picker
                        placeholder="DD-MM-YYYY"
                        :format="customFormatter"
                      />
                    </client-only>
                    <span class="help-block" 
                      v-if="errors.date"
                    >{{ errors.date[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-control" v-model="form.status">
                      <option value="">Select Status</option>
                      <option value="0">In Active</option>
                      <option value="1">Active</option>
                    </select>
                    <span class="help-block" 
                      v-if="errors.status"
                    >{{ errors.status[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Update Slot' }}</button>
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
import moment from 'moment'

export default {
  name: 'UpdateTag',
  components: {
    BackButton
  },
  async asyncData({$axios, params, query}) {
    let slots = await $axios.get(`/delivery_time_slots`)
    let slot_date = await $axios.get(`/delivery_time_slots/${query.slot}/delivery_time_slot_dates/${params.id}`)
    return {
      form: slot_date.data.data,
      slots: slots.data.data
    }
  },
  data: () => ({
    loading: false
  }),
  mounted() {
  },
  
  methods: {
    customFormatter(date) {
      this.form.date = moment(date).format('DD-MM-YYYY');
      return moment(date).format('DD-MM-YYYY');
    },
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.patch(`/delivery_time_slots/${this.form.delivery_time_slot_id}/delivery_time_slot_dates/${this.form.id}`, this.form)
        this.$router.push(`/organizations/${this.organization.value}/slot-dates`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>