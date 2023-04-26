<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Details</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Details</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Images -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Add Images for {{ product.name }}</h3> &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br>
                    <div class="card">
                      <div class="card-header">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <img :src="product.imagepath1 ? (mediaUrl + product.imagepath1) : '/product-vector.png'"
                               style="width: 100px; height: 100px;opacity: .8;"
                               class="brand-image img-circle elevation-3"
                              >
                              <br>
                              <br>
                              <label class="form-label">Image 1 (This will be the profile image)</label>
                              <br>
                              <input type="file" id="file" name="file" ref="imagepath1" accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf" multiple>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <img :src="product.imagepath2 ? (mediaUrl + product.imagepath2) : '/product-vector.png'"
                               style="width: 100px; height: 100px;opacity: .8;"
                               class="brand-image img-circle elevation-3"
                              >
                              <br>
                              <br>
                              <label class="form-label">Image 2</label>
                              <br>
                              <input type="file" id="file" name="file" ref="imagepath2" accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf" multiple>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <img :src="product.imagepath3 ? (mediaUrl + product.imagepath3) : '/product-vector.png'"
                               style="width: 100px; height: 100px;opacity: .8;"
                               class="brand-image img-circle elevation-3"
                              >
                              <br>
                              <br>
                              <label class="form-label">Image 3</label>
                              <br>
                              <input type="file" id="file" name="file" ref="imagepath3" accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf" multiple>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <img :src="product.imagepath4 ? (mediaUrl + product.imagepath4) : '/product-vector.png'"
                               style="width: 100px; height: 100px;opacity: .8;"
                               class="brand-image img-circle elevation-3"
                              >
                              <br>
                              <br>
                              <label class="form-label">Image 4</label>
                              <br>
                              <input type="file" id="file" name="file" ref="imagepath4" accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf" multiple>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

      <!-- Tags -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Add Tags for {{ product.name }}</h3> &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br>
                    <div class="card">
                      <div class="card-header">
                        <div class="row">
                          <div class="col-md-3"
                            v-for="(tag, t) in tags"
                            :key="`tag${t}`"
                          >
                            <div class="form-group">
                              <input type="checkbox"
                                v-model="tagIds"
                                :value="tag.id"
                                @change="updateTags"
                              >&nbsp;&nbsp;{{ tag.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

      <!-- Packs -->
      <product-pack
        :product="product"
        :units="units"
        @updatePacks="updatePacks"
      ></product-pack>

      <!-- Prices -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Add Prices for {{ product.name }}</h3> &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br>
                    <div class="card"
                      v-for="(pack, u) in product.product_packs"
                      :key="`pack${u}`"
                    >
                      <div class="card-header">
                        {{ pack.value }} {{ pack.unit.name }} of {{ product.name }} = 
                        <br>
                        Customer Price:
                        <input type="number" v-model="prices[u]" placeholder="Enter amount" @blur="updatePrice(u, prices[u], pack.id, offers[u], cashbacks[u], distributorPrices[u], distributorOfferPrices[u])"> INR | 
                        Customer Offer Price : &nbsp;
                        <input type="number" v-model="offers[u]" placeholder="Enter offer amount" @blur="updatePrice(u, prices[u], pack.id, offers[u], cashbacks[u], distributorPrices[u], distributorOfferPrices[u])"> INR 
                        <span v-if="org.is_cashback_applicable">| 
                          Cashback Amount : &nbsp;
                          <input type="number" v-model="cashbacks[u]" placeholder="Enter amount" @blur="updatePrice(u, prices[u], pack.id, offers[u], cashbacks[u], distributorPrices[u], distributorOfferPrices[u])"> INR
                        </span>
                        <br><br>
                        Distributor Price:
                        <input type="number" v-model="distributorPrices[u]" placeholder="Enter amount" @blur="updatePrice(u, prices[u], pack.id, offers[u], cashbacks[u], distributorPrices[u], distributorOfferPrices[u])"> INR | 
                        Distributor Offer Price : &nbsp;
                        <input type="number" v-model="distributorOfferPrices[u]" placeholder="Enter offer amount" @blur="updatePrice(u, prices[u], pack.id, offers[u], cashbacks[u], distributorPrices[u], distributorOfferPrices[u])"> INR 
                        <br>
                        <input type="checkbox"
                          v-if="prices[u]"
                          v-model="defaults[u]"
                          @change="updatePrice(u, prices[u], pack.id)"
                        > &nbsp; Is this default unit and price to be displayed on the website
                      </div>
                    </div>
                  </div>
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

      <!-- Update Button -->
      <section class="content">
        <div class="container-fluid">
          <button class="btn btn-primary btn-block"
            @click="update"
          >{{ loading ? 'Saving...' : 'Update Details' }}</button>
        </div>
      </section>

      <br>
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import ProductPack from './pack.vue'

export default {
  name: 'ManageDetails',
  async asyncData({$axios, params}) {
    let org = await $axios.get(`/companies/${params.organizationId}`)
    org = org.data.data
    let u = await $axios.get(`/units`)
    u = u.data.data
    let units = []
    units.push({
      label: 'Select Unit',
      code: '',
    })
    u.forEach((role) => {
      units.push({
        label: role.name,
        code: role.id,
      })
    })
    return {
      units: units,
      org: org,
    }
  },
  data:() =>  ({
    searchData: '',
    loading: false,
    form: {
    },
    tags: [],
    product: {
      inventory: {
      }
    },
    tagIds: [],
    prices: [],
    offers: [],
    cashbacks: [],
    distributorPrices: [],
    distributorOfferPrices: [],
    defaults: [],
  }),
  components: {
    ProductPack
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let tags = await this.$axios.get(`/tags`)
      let product = await this.$axios.get(`/products/${this.$route.params.productId}`)
      this.tags = tags.data.data
      this.product = product.data.data

      this.getTags()
      this.getPrices()
    },
    getTags() {
      this.product.tags.forEach(tag => {
        this.tagIds.push(tag.id)
      })
    },
    getPrices() {
      this.prices = []
      this.defaults = []
      // This is to get the prices already saved and display them
      this.product.product_packs.forEach((pack, c) => {
        let price = this.product.product_prices.find(price => price.product_pack_id == pack.id)
        if(price) {
          this.prices[c] = price.price
          this.offers[c] = price.offer_price
          this.cashbacks[c] = price.cashback_price
          this.distributorPrices[c] = price.distributor_price
          this.distributorOfferPrices[c] = price.distributor_offer_price
          this.defaults[c] = parseInt(price.is_default)
        }
      })
    },
    // async getData() {
    //   this.items = []
    //   this.loading = true
    //   let conversions = await this.$axios.get(`/inventories/${this.$route.params.productId}/inventory_unit_conversions`)
    //   this.conversions = conversions.data.data
    //   this.loading = false
    // },
    // async del(id) {
    //   let r = confirm('Are you sure you want to delete the data?')
    //   if(r == true)
    //     await this.$axios.delete(`/inventories/${this.inventory.id}/inventory_unit_conversions/${id}`)
    //   this.getData()
    // },
    async update() {
      this.loading = true
      try {
        let product = await this.$axios.patch(`/products/${this.product.id}`, this.form)
        this.handleFileUpload()
        this.loading = false
        this.$router.push(`/organizations/${this.organization.value}/products`)
        // this.getData()
      }
      catch(e) {
        this.loading = false
      }
    },
    async updateTags() {
      let payload = {
        'product_id': this.product.id,
        'tag_ids':  this.tagIds
      }
      await this.$axios.post(`/product_tag`, payload)
    },
    async updatePrice(u, price, productPackId, offerPrice, cashbackPrice, distributorPrice, distributorOfferPrice) {
      let payload = {
        product_id: this.product.id,
        price: price,
        offer_price: offerPrice,
        cashback_price: cashbackPrice,
        distributor_price: distributorPrice,
        distributor_offer_price: distributorOfferPrice,
        product_pack_id: productPackId,
        is_default: this.defaults[u],
        date: new Date()
      }
      try {
        await this.$axios.post(`/products/${this.product.id}/product_prices`, payload)
        this.getData()
      } catch(ex) {}
    },
    updatePacks(packs) {
      this.product.product_packs = packs
    },
    async handleFileUpload() {
      this.imagepath1 = this.$refs.imagepath1.files[0]
      this.imagepath2 = this.$refs.imagepath2.files[0]
      this.imagepath3 = this.$refs.imagepath3.files[0]
      this.imagepath4 = this.$refs.imagepath4.files[0]
      let formData = new FormData();
      formData.append('productid', this.product.id);
      formData.append('imagepath1', this.imagepath1);
      formData.append('imagepath2', this.imagepath2);
      formData.append('imagepath3', this.imagepath3);
      formData.append('imagepath4', this.imagepath4);
      await this.$axios.post('upload_product_attachment', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(response => {
      })
      .catch(function(){
        console.log('FAILURE!!');
      });
    },
  },
}
</script>