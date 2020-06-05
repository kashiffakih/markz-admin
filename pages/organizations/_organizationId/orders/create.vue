<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">
                <back-button
                  :link="`/organizations/${organization.value}/orders`"
                  title="Hi"
                >
                </back-button>
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
                          :reduce="vendor => vendor.code" 
                          :options="vendors"
                        ></v-select>
                        <span class="help-block" 
                          v-if="errors.user_id"
                        >{{ errors.user_id[0] }}</span>
                      </div>
                    </div>
                  </div>
                  <b>or Create a new User</b>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">First Name</label>
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
                        <label class="form-label">Last Name</label>
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
                        <label class="form-label">Email</label>
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
                        <label class="form-label">Phone</label>
                        <input type="text" class="form-control" placeholder="Enter phone"
                          v-model="user.phone"
                        >
                        <span class="help-block" 
                          v-if="errors.phone"
                        >{{ errors.phone[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="form-group">
                        <label class="form-label">Address</label>
                        <input type="text" class="form-control" placeholder="Enter address"
                          v-model="user.address"
                        >
                        <span class="help-block" 
                          v-if="errors.address"
                        >{{ errors.address[0] }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Source</label>
                        <select class="form-control" v-model="form.source">
                          <option value="">Select Source</option>
                          <option value="Website">Website</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="WalkIn">WalkIn</option>
                        </select>
                        <span class="help-block" 
                          v-if="errors.user_id"
                        >{{ errors.user_id[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Order Details</label>
                        <input type="text" class="form-control" placeholder="Enter order details"
                          v-model="form.details"
                        >
                        <span class="help-block" 
                          v-if="errors.details"
                        >{{ errors.details[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Total</label>
                        <br>
                        {{ cost }} AED
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
                            <span class="input-group-text" id="basic-addon1">AED</span>
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
                      {{ loading ? 'Saving...': 'Add Order' }}
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
import BackButton from '@/components/back-button.vue'
import 'vue-select/dist/vue-select.css';
import moment from 'moment'

export default {
  name: 'CreateOrder',
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
          label: product.name,
          unit_id: price.unit_id,
          unit: price.unit.name,
          price: price.price,
        })
    })
    return {
      vendors: users,
      products: products,
    }
  },
  data: () => ({
    form: {
      user_id: '',
      details: '',
      order_cost: 0,
      source: '',
      order_details: []
    },
    user: {

    },
    userid: '',
    loading: false
  }),
  components: {
    BackButton,
  },
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
    this.addOrderDetail()
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
        this.user.is_billing_same = true
        this.user.password = 123456
        let user = await this.$axios.post('register-user', this.user)
        user = user.data.data
        // Assign Role
        let role_payload = {
          user_id: user.id,
          role_id: 6
        }
        await this.$axios.post('/role_user', role_payload)
        // Assign Organization
        let organization_payload = {
          user_id: user.id,
          company_id: 1
        }
        await this.$axios.post('/company_user', organization_payload)
        await this.$axios.get(`/emails/register/users/${user.id}/${123456}`)

        this.form.user_id = user.id
        let o = await this.$axios.post(`/orders`, this.form)
        o = o.data.data
        await this.$axios.get(`emails/invoice/orders/${o.id}`)
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