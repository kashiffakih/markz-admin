<template>
  <!-- Prices -->
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Add Packs of {{ product.name }}</h3> &nbsp;
            </div>
            <!-- /.card-header -->
            <div class="card-body table-responsive p-0">
              <div class="container">
                <br>
                <input type="number" v-model="form.value" placeholder="Enter  value">&nbsp;&nbsp;
                <select v-model="form.unit_id">
                  <option
                    v-for="(unit, u) in units"
                    :key="`unit${u}`"
                    :value="unit.code"
                  >
                    {{ unit.label }}
                  </option>
                </select>&nbsp;&nbsp;
                of {{ product.name }}
                <br>
                <span class="help-block" 
                  v-if="errors.value"
                >{{ errors.value[0] }}</span>
                <span class="help-block" 
                  v-if="errors.unit_id"
                ><br>{{ errors.unit_id[0] }}</span>
                <br>
                <button class="btn btn-primary"
                  @click="update"
                  v-if="form.id"
                >{{ loading ? 'Saving...' : 'Update Conversion' }}</button>
                <button class="btn btn-primary"
                  @click="store"
                  v-else
                >{{ loading ? 'Saving...' : 'Add Conversion' }}</button>
              </div>
              <br>
            </div>
            <!-- /.card-body -->

            <div class="card-header">
              <h3 class="card-title">Packs</h3> &nbsp;
            </div>
            <!-- /.card-header -->
            <div class="card-body table-responsive p-0">
              <table class="table table-head-fixed table-striped">
                <tbody>
                  <tr
                    v-if="loading"
                  > 
                    <td colspan="13">Loading...</td>
                  </tr>
                  <tr v-for="(pack, i) in packs"
                    :key="`pack${i}`"
                  >
                    <div class="container">
                      <br>
                      <div class="card">
                        <div class="card-header">
                          <h6>
                            {{ pack.value }} {{ pack.unit.name }} of {{ product.name }}.
                            <nuxt-link title="Delete pack" class="icon" to="">
                              <span @click="edit(pack.id)">
                                <i class="fa fa-edit"></i>
                              </span>
                            </nuxt-link>&nbsp;&nbsp;
                            <nuxt-link title="Delete pack" class="icon" to="">
                              <span @click="del(pack.id)">
                                <i class="fa fa-trash"></i>
                              </span>
                            </nuxt-link>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </tr>
                </tbody>
              </table>
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
</template>

<script type="text/javascript">
export default {
  name: 'ProductPack',
  data: () => ({
    packs: [],
    form: {
      unit_id: '',
      is_default: false
    },
    loading: false,
  }),
  props: ['product', 'units'],
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.items = []
      this.loading = true
      let packs = await this.$axios.get(`/products/${this.$route.params.productId}/product_packs`)
      this.packs = packs.data.data
      this.loading = false
      this.$emit('updatePacks', this.packs)
    },
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/products/${this.product.id}/product_packs`, this.form)
        this.loading = false
        this.emptyForm()
        this.getData()

      }
      catch(e) {
        this.loading = false
      }
    },
    async edit(id) {
      let form = await this.$axios.get(`/products/${this.product.id}/product_packs/${id}`)
      this.form = form.data.data
    },
    async update() {
      this.loading = true
      try {
        let admin = await this.$axios.patch(`/products/${this.product.id}/product_packs/${this.form.id}`, this.form)
        this.loading = false
        this.emptyForm()
        this.getData()
      }
      catch(e) {
        this.loading = false
      }
    },
    async del(id) {
      let r = confirm('Are you sure you want to delete the data?')
      if(r == true)
        await this.$axios.delete(`/products/${this.product.id}/product_packs/${id}`)
      this.getData()
    },
    emptyForm() {
      this.form = {
        unit_id: '',
        is_default: false
      }
    }
  },
} 
</script>