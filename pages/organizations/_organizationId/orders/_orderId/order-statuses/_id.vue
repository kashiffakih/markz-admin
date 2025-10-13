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
                
                Order Status</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/orders`">Order Statuses</nuxt-link>
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
                  <h3 class="card-title">Add Order Status of Order: {{ order.id }}</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Status</label>
                    <v-select 
                      v-model="form.status_id" 
                      :reduce="status => status.code" 
                      :options="statuses"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Update Order Status' }}</button>
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
import 'vue-select/dist/vue-select.css';

export default {
  name: 'CreateOrderStatus',
  components: {
    BackButton
  },
  async asyncData({$axios, params}) {
    let order = await $axios.get(`/orders/${params.orderId}`)
    order = order.data.data
    let order_status = order.order_statuses.find(status => status.id == params.id)
    let s = await $axios.get(`/statuses`)
    s = s.data.data
    let statuses = []
    statuses.push({
      label: 'Select Status',
      code: '',
    })
    s.forEach((status) => {
      statuses.push({
        label: status.name,
        code: status.id,
      })
    })
    return {
      order: order,
      statuses: statuses,
      form: order_status,
    }
  },
  data: () => ({
    subcategoryid: '',
    loading: false
  }),
  mounted() {
  },
  
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.patch(`/orders/${this.order.id}/order_statuses/${this.form.id}`, this.form)
        this.subcategoryid = admin.data.data.id
        this.$router.push(`/organizations/${this.organization.value}/orders`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>