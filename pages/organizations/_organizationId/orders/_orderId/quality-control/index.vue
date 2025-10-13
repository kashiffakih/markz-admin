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
                
                Order Details</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/orders`">Orders</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Update</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Update Order Details</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Update Quality</label>
                        <v-select 
                          v-model="form.quality" 
                          :reduce="quality => quality.code" 
                          :options="qualities"
                        ></v-select>
                        <span class="help-block" 
                          v-if="errors.quality"
                        >{{ errors.quality[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Reason</label>
                        <input class="form-control" type="text" placeholder="Enter reason" v-model="form.quality_details">
                        <span class="help-block" 
                          v-if="errors.quality"
                        >{{ errors.quality[0] }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- End row -->
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                      :disabled="loading"
                    >
                      {{ loading ? 'Saving...': 'Update Quality' }}
                    </button>
                  </div>
                </div>
                <!-- end form start -->
              </div>
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
import 'vue-select/dist/vue-select.css';
import moment from 'moment'

export default {
  name: 'UpdateOrder',
  components: {
    BackButton
  },
  async asyncData({$axios, params}) {
    let order = await $axios.get(`/orders/${params.orderId}`)
    order = order.data.data
    order.order_details.forEach((detail, d) => {
      detail.position = d
      detail.product_id = parseInt(detail.product_id)
      detail.unit = detail.unit.name
    })
    return {
      form:order,
    }
  },
  data: () => ({
    loading: false,
    qualities: [
      {label: 'Update quality status' , code: ''}, 
      {label : 'Checked Ok', code: 'Checked Ok'}, 
      {label: 'Checked Rejected', code: 'Checked Rejected'}
    ]
  }),
  
  computed: {
    cost() {
      let cost = 0
      this.form.order_details.forEach(detail =>  {
        cost += parseInt(detail.order_detail_cost)
      })
      return cost
    }
  },
  mounted() {
    this.form.user_id = parseInt(this.form.user_id)
    this.form.quality = this.form.quality ? this.form.quality : ''
  },
  methods: {
    addOrderDetail() {
      this.form.order_details.push({
        position: this.form.order_details.length,
        product_id: '',
        quantity: '',
        unit_id: '',
        unit: '',
        order_detail_cost: 0,
      })
    },
    removeOrderDetail(position) {
      this.form.order_details = this.form.order_details.filter(detail => detail.position != position)
    },  
    selectOrderDetailUnit(position, productId, quantity) {
      let product = this.products.find(i => i.code == productId)
      if(product && product.code != '') {
        this.form.order_details[position].unit_id = product.unit_id
        this.form.order_details[position].unit = product.unit
        this.getOrderDetailAmount(position, productId, quantity)
      }
    },
    getOrderDetailAmount(position, productId, quantity) {
      let product = this.products.find(i => i.code == productId)
      if(product && product.code != '' && quantity) {
        this.form.order_details[position].order_detail_cost = parseFloat(product.price) * parseFloat(quantity)
      }
    },
    assignCost() {
      this.form.order_cost = this.cost
    },
    async store() {
      this.assignCost()
      this.loading = true
      try {
        await this.$axios.post(`/orders`, this.form)
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