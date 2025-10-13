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
                  <nuxt-link :to="`/orders`">Orders</nuxt-link>
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
                  <h3 class="card-title">Add Order Details</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Select user</label>
                        <v-select 
                          v-model="form.user_id" 
                          :reduce="user => user.code" 
                          :options="users"
                        ></v-select>
                        <span class="help-block" 
                          v-if="errors.user_id"
                        >{{ errors.user_id[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Order Details</label>
                        <input type="text" class="form-control" placeholder="Enter order details"
                          v-model="form.details"
                        >
                        <span class="help-block" 
                          v-if="errors.details"
                        >{{ errors.details[0] }}</span>
                      </div>
                    </div>
                  </div>
                  <b>or Create a new User</b>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>First Name</label>
                        <input type="text" class="form-control" placeholder="Enter first name"
                          v-model="user.first_name"
                        >
                        <span class="help-block" 
                          v-if="errors.first_name"
                        >{{ errors.first_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Last Name</label>
                        <input type="text" class="form-control" placeholder="Enter last name"
                          v-model="user.last_name"
                        >
                        <span class="help-block" 
                          v-if="errors.last_name"
                        >{{ errors.last_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Email</label>
                        <input type="text" class="form-control" placeholder="Enter email"
                          v-model="user.email"
                        >
                        <span class="help-block" 
                          v-if="errors.email"
                        >{{ errors.email[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Phone</label>
                        <input type="text" class="form-control" placeholder="Enter phone"
                          v-model="user.phone"
                        >
                        <span class="help-block" 
                          v-if="errors.phone"
                        >{{ errors.phone[0] }}</span>
                      </div>
                    </div>
                  </div>
                  <label class="form-label">Order Details</label>
                  <button class="btn btn-primary btn-sm"
                    @click="addOrderDetail"
                  >Add</button>
                  <br><br>
                  <div class="row"
                    v-for="(detail, d) in form.order_details"
                  >
                    <div class="col-md-1">
                      <label class="form-label">{{ d + 1 }}.</label>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <v-select 
                          v-model="detail.product_id" 
                          :reduce="product => product.code" 
                          :options="products"
                          @input="selectOrderDetailUnit(detail.position, detail.product_id, detail.quantity)"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <div class="input-group mb-3">
                          <input type="number" class="form-control" placeholder="Enter quantity"
                            v-model="detail.quantity"
                            @input="getOrderDetailAmount(detail.position, detail.product_id, detail.quantity)"
                          >
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">{{ detail.unit }}</span>
                          </div>
                        </div>
                        <span class="help-block" 
                          v-if="errors.quantity"
                        >{{ errors.quantity[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <div class="input-group mb-3">
                          <input type="number" class="form-control" placeholder="Enter amount"
                            v-model="detail.order_detail_cost"
                          >
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">INR</span>
                          </div>
                        </div>
                        <span class="help-block" 
                          v-if="errors.order_detail_cost"
                        >{{ errors.order_detail_cost[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="form-group">
                        <button class="btn btn-primary btn-small"
                          @click="removeOrderDetail(detail.position)"
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                  <!-- End row -->
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                      :disabled="loading"
                    >
                      {{ loading ? 'Saving...': 'Update Order' }}
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
    let u = await $axios.get(`/users?role_id=6`)
    u = u.data.data
    let users = []
    users.push({
      label: 'Select User',
      code: '',
    })
    u.forEach((user) => {
      users.push({
        label: user.name,
        code: user.id,
      })
    })
    let p = await $axios.get(`/products`)
    p = p.data.data
    let products = []
    products.push({
      label: 'Select Product',
      code: '',
    })
    p.forEach((product) => {
      let price = product.product_prices.find(price => price.is_default  == true)
      if(price)
        products.push({
          code: product.id,
          label: product.name + '(' + price.product_pack.value + ' ' + price.product_pack.unit.name + ')',
          price: price.offer_price || price.price,
          unit: price.product_pack.unit.name,
          unit_id: price.product_pack.unit.id,
          product_pack: price.product_pack.value + ' ' + price.product_pack.unit.name
        })
    })
    let order = await $axios.get(`/orders/${params.id}`)
    order = order.data.data
    order.order_details.forEach((detail, d) => {
      detail.position = d
      detail.product_id = parseInt(detail.product_id)
      // detail.unit = detail.unit.name
    })
    return {
      users: users,
      products: products,
      form:order,
    }
  },
  data: () => ({
    loading: false
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
        this.form.order_details[position].product_pack = product.product_pack
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
        this.$router.push(`/orders`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>