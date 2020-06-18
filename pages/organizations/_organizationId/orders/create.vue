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
                  <b>Address</b>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Villa no / Flat no</label>
                        <input type="text" class="form-control" placeholder="Enter Villa no / Flat no"
                          v-model="user.flat_no"
                        >
                        <span class="help-block" 
                          v-if="errors.flat_no"
                        >{{ errors.flat_no[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Building name / community name</label>
                        <input type="text" class="form-control" placeholder="Enter building name / community name (required)"
                          v-model="user.building_name"
                        >
                        <span class="help-block" 
                          v-if="errors.building_name"
                        >{{ errors.building_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Select Emirate</label>
                        <select class="form-control" v-model="form.state">
                          <option value="">Select Your Emirate (required)</option>
                          <option value="DUBAI">DUBAI</option>
                        </select>
                        <span style="color: red;" 
                          v-if="errors.city"
                        >The emirate field is required</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label"><span style="color: red;">*</span>Select Area</label>
                        <select class="form-control" v-model="form.city">
                          <option value="">Select Your Area (required)</option>
                          <option value="ACADEMIC CITY">ACADEMIC CITY</option><option value="AIRPORT ROAD DUBAI">AIRPORT ROAD DUBAI</option><option value="AL AWIR">AL AWIR</option><option value="AL BADAA">AL BADAA</option><option value="AL BARARI DUBAI">AL BARARI DUBAI</option><option value="AL BARSHA">AL BARSHA</option><option value="AL BARSHA HEIGHTS">AL BARSHA HEIGHTS</option><option value="AL FURJAN">AL FURJAN</option><option value="AL GARHOUD">AL GARHOUD</option><option value="AL GARHOUD">AL GARHOUD</option><option value="AL HUDAIBA">AL HUDAIBA</option><option value="AL JADDAF">AL JADDAF</option><option value="AL KHAWANEEJ">AL KHAWANEEJ</option><option value="AL MIZHAR">AL MIZHAR</option><option value="AL NABAT">AL NABAT</option><option value="Al NAHDA">Al NAHDA</option><option value="AL QUDRA">AL QUDRA</option><option value="AL QUOZ">AL QUOZ</option><option value="AL QUSAIS">AL QUSAIS</option><option value="AL RASHIDIYA">AL RASHIDIYA</option><option value="AL SAFA">AL SAFA</option><option value="AL SUFOUH">AL SUFOUH</option><option value="AL TAWAR">AL TAWAR</option><option value="AL WAHA">AL WAHA</option><option value="AL WARQA">AL WARQA</option><option value="Al Warsan">Al Warsan</option><option value="AL WASL">AL WASL</option><option value="ARABIAN RANCHES">ARABIAN RANCHES</option><option value="BUR DUBAI">BUR DUBAI</option><option value="BUSINESS BAY">BUSINESS BAY</option><option value="CITY OF ARABIA">CITY OF ARABIA</option><option value="CITY WALK">CITY WALK</option><option value="DAFZA">DAFZA</option><option value="DEIRA">DEIRA</option><option value="DESERT PALM POLO CLUB">DESERT PALM POLO CLUB</option><option value="DIFC">DIFC</option><option value="DISCOVERY GARDEN">DISCOVERY GARDEN</option><option value="DOWNTOWN DUBAI">DOWNTOWN DUBAI</option><option value="DUBAI CREEK">DUBAI CREEK</option><option value="DUBAI INTERNET CITY">DUBAI INTERNET CITY</option><option value="DUBAI INVESTMENT PARK">DUBAI INVESTMENT PARK</option><option value="DUBAI LIFESTYLE CITY">DUBAI LIFESTYLE CITY</option><option value="DUBAI MALL">DUBAI MALL</option><option value="DUBAI MARINA">DUBAI MARINA</option><option value="DUBAI OUTLET MALL">DUBAI OUTLET MALL</option><option value="DUBAI PRODUCTION CITY">DUBAI PRODUCTION CITY</option><option value="DUBAI SILICON OASIS">DUBAI SILICON OASIS</option><option value="DUBAI SPORT CITY">DUBAI SPORT CITY</option><option value="DUBAI SPORTS CITY">DUBAI SPORTS CITY</option><option value="DUBAI STUDIO CITY">DUBAI STUDIO CITY</option><option value="DUBAILAND">DUBAILAND</option><option value="EMIRATES HILLS">EMIRATES HILLS</option><option value="ESTATES">ESTATES</option><option value="FALCON CITY">FALCON CITY</option><option value="FESTIVAL CITY">FESTIVAL CITY</option><option value="GREEN COMMUNITY MOTOR CITY">GREEN COMMUNITY MOTOR CITY</option><option value="HATTA">HATTA</option><option value="HOR AL ANZ">HOR AL ANZ</option><option value="HUMANITARIAN CITY">HUMANITARIAN CITY</option><option value="IMPZ">IMPZ</option><option value="INTERNATIONAL CITY">INTERNATIONAL CITY</option><option value="JAFFLIYA">JAFFLIYA</option><option value="JBR">JBR</option><option value="JEBEL ALI FREEZONE">JEBEL ALI FREEZONE</option><option value="JEBEL ALI INDUSTRIAL AREA">JEBEL ALI INDUSTRIAL AREA</option><option value="JEBEL ALI RACE COURSE">JEBEL ALI RACE COURSE</option><option value="JEBEL ALI VILLAGE">JEBEL ALI VILLAGE</option><option value="JUMEIRAH">JUMEIRAH</option><option value="JUMEIRAH GOLF ESTATES">JUMEIRAH GOLF ESTATES</option><option value="JUMEIRAH ISLANDS">JUMEIRAH ISLANDS</option><option value="JUMEIRAH LAKE TOWERS">JUMEIRAH LAKE TOWERS</option><option value="JUMEIRAH PARK">JUMEIRAH PARK</option><option value="JUMEIRAH VILLAGE CIRCLE">JUMEIRAH VILLAGE CIRCLE</option><option value="JUMEIRAH VILLAGE TRIANGLE">JUMEIRAH VILLAGE TRIANGLE</option><option value="KARAMA">KARAMA</option><option value="KNOWLEDGE VILLAGE">KNOWLEDGE VILLAGE</option><option value="LAYAN">LAYAN</option><option value="LIWAN">LIWAN</option><option value="MAJAN">MAJAN</option><option value="MEADOWS">MEADOWS</option><option value="MEDIAWAVE APRICOT TOWER">MEDIAWAVE APRICOT TOWER</option><option value="MEYDAN">MEYDAN</option><option value="MIRA">MIRA</option><option value="MIRDIF">MIRDIF</option><option value="Mohammed Bin Rashid City">Mohammed Bin Rashid City</option><option value="MOTOR CITY">MOTOR CITY</option><option value="MOTOR CITY">MOTOR CITY</option><option value="MUDON">MUDON</option><option value="MUHAISNAH 1">MUHAISNAH 1</option><option value="MUHAISNAH 2">MUHAISNAH 2</option><option value="NAD AL SHIBA">NAD AL SHIBA</option><option value="NADD AL HAMMAR">NADD AL HAMMAR</option><option value="NADD AL HAMMAR">NADD AL HAMMAR</option><option value="OUD AL MUTEENA">OUD AL MUTEENA</option><option value="OUD METHA">OUD METHA</option><option value="PALM JEBEL ALI">PALM JEBEL ALI</option><option value="PALM JUMEIRAH">PALM JUMEIRAH</option><option value="PALMER">PALMER</option><option value="PORT SAEED">PORT SAEED</option><option value="RAS AL KHOR">RAS AL KHOR</option><option value="REMRAAM">REMRAAM</option><option value="SAHARA MEADOWS">SAHARA MEADOWS</option><option value="SATWA">SATWA</option><option value="SHEIKH ZAYED ROAD">SHEIKH ZAYED ROAD</option><option value="SPRING">SPRING</option><option value="TECOM">TECOM</option><option value="THE GARDEN">THE GARDEN</option><option value="THE GREEN">THE GREEN</option><option value="THE LAKES">THE LAKES</option><option value="THE MEADOWS">THE MEADOWS</option><option value="THE SUSTAINABLE">THE SUSTAINABLE</option><option value="THE VILLA">THE VILLA</option><option value="TRADE CENTRE">TRADE CENTRE</option><option value="UMM RAMOOL">UMM RAMOOL</option><option value="UMM SUQEIM">UMM SUQEIM</option><option value="VILLAGE CIRCLE">VILLAGE CIRCLE</option><option value="WADI AL AMARDHI">WADI AL AMARDHI</option><option value="WASL GATE">WASL GATE</option><option value="ZABEEL">ZABEEL</option><option value="ZAYED UNIVERSITY">ZAYED UNIVERSITY</option>
                        </select>
                        <span style="color: red;" 
                          v-if="errors.city"
                        >The area field is required</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Street name</label>
                        <input type="text" class="form-control" placeholder="Enter street name"
                          v-model="user.street_name"
                        >
                        <span class="help-block" 
                          v-if="errors.street_name"
                        >{{ errors.street_name[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Landmark</label>
                        <input type="text" class="form-control" placeholder="Enter landmark"
                          v-model="user.address"
                        >
                        <span class="help-block" 
                          v-if="errors.address"
                        >{{ errors.address[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Additional details</label>
                        <input type="text" class="form-control" placeholder="Enter additional details"
                          v-model="user.other_details"
                        >
                        <span class="help-block" 
                          v-if="errors.other_details"
                        >{{ errors.other_details[0] }}</span>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="form-label">Nationality</label>
                        <countries 
                          :option.sync="form.nationality"
                        ></countries>
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
                        <label class="form-label">Delivery message</label>
                        <input type="text" class="form-control" placeholder="Enter delivery message"
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
import Countries from '@/components/countries.vue'

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
          label: product.name + '(' + product.location + ')',
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
      state: '',
      city: '',
      nationality: '',
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
  components: {
    Countries
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