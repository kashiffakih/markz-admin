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
                  :link="`/organizations/${organization.value}/products`"
                >
                </back-button>
                Product</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/products`">Products</nuxt-link>
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
          <div class="row justify-content-center">
            <!-- left column -->
            <div class="col-md-6">
              <!-- jquery validation -->
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Update Product</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <!-- <div class="form-group">
                    <label class="form-label">Inventory</label>
                    <v-select 
                      v-model="form.inventory_id" 
                      :reduce="inventory => inventory.code" 
                      :options="inventories"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.inventory_id"
                    >{{ errors.inventory_id[0] }}</span>
                  </div> -->
                  <div class="form-group">
                    <label class="form-label">Is Active</label>
                    <select class="form-control" v-model="form.is_active">
                      <option value="">Select status</option>
                      <option value="1">Active</option>
                      <option value="0">In Active</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Category</label>
                    <v-select 
                      v-model="form.category_id" 
                      :reduce="category => category.code" 
                      :options="categories"
                      @input="getSubCategories(form.category_id)"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.category_id"
                    >{{ errors.category_id[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Sub Category</label>
                    <v-select 
                      v-model="form.sub_category_id" 
                      :reduce="sub_category => sub_category.code" 
                      :options="sub_categories"
                      @input="getSub2Categories(form.category_id, form.sub_category_id)"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.sub_category_id"
                    >{{ errors.sub_category_id[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Sub 2 Category</label>
                    <v-select 
                      v-model="form.sub_2_category_id" 
                      :reduce="sub_2_category => sub_2_category.code" 
                      :options="sub_2_categories"
                      @input="getSub3Categories(form.category_id, form.sub_category_id, form.sub_2_category_id)"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.sub_2_category_id"
                    >{{ errors.sub_2_category_id[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Sub 3 Category</label>
                    <v-select 
                      v-model="form.sub_3_category_id" 
                      :reduce="sub_3_category => sub_3_category.code" 
                      :options="sub_3_categories"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.sub_3_category_id"
                    >{{ errors.sub_3_category_id[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-control" placeholder="Enter Product name"
                      v-model="form.name"
                    >
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Small Description</label>
                    <input type="text" class="form-control" placeholder="Enter small description"
                      v-model="form.small_description"
                    >
                    <span class="help-block" 
                      v-if="errors.small_description"
                    >{{ errors.small_description[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Long Description</label>
                    <textarea type="text" class="form-control" placeholder="Enter long description" v-model="form.description"></textarea>
                    <span class="help-block" 
                      v-if="errors.description"
                    >{{ errors.description[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Origin</label>
                    <countries
                      :option.sync="form.location"
                    ></countries>
                    <span class="help-block" 
                      v-if="errors.location"
                    >{{ errors.location[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Position</label>
                    <input type="number" class="form-control" placeholder="Enter postion"
                      v-model="form.position"
                    >
                    <span class="help-block" 
                      v-if="errors.position"
                    >{{ errors.position[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Add More Details' }}</button>
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
import BackButton from '@/components/back-button.vue'
import 'vue-select/dist/vue-select.css';
import Countries from '@/components/countries.vue'

export default {
  name: 'UpdateProduct',
  async asyncData({$axios, params}) {
    let i = await $axios.get(`/inventories`)
    i = i.data.data
    let inventories = []
    inventories.push({
      label: 'Select Inventory',
      code: '',
    })
    i.forEach((role) => {
      inventories.push({
        label: role.name,
        code: role.id,
      })
    })
    let c = await $axios.get(`/categories`)
    c = c.data.data
    let categories = []
    categories.push({
      label: 'Select Category',
      code: '',
      sub_categories: [],
    })
    c.forEach((role) => {
      categories.push({
        label: role.name,
        code: role.id,
        sub_categories: role.sub_categories,
      })
    })
    let product = await $axios.get(`/products/${params.id}`)
    product = product.data.data
    return {
      inventories: inventories,
      categories: categories,
      form: product,
    }
  },
  data: () => ({
    sub_categories: [
      {
        label: 'Select Sub Category',
        code: '',
      }
    ],
    sub_2_categories: [
      {
        label: 'Select Sub 2 Category',
        code: '',
      }
    ],
    sub_3_categories: [
      {
        label: 'Select Sub 3 Category',
        code: '',
      }
    ],
    loading: false
  }),
  mounted() {
    this.form.inventory_id = parseInt(this.form.inventory_id)
    this.form.category_id = parseInt(this.form.category_id)
    this.form.sub_category_id = parseInt(this.form.sub_category_id)
    this.form.sub_2_category_id = parseInt(this.form.sub_2_category_id) || ''
    this.form.sub_3_category_id = parseInt(this.form.sub_3_category_id) || ''

    if(this.form.category_id)
      this.getSubCategories(this.form.category_id)
    if(this.form.sub_category_id)
      this.getSub2Categories(this.form.category_id, this.form.sub_category_id)
    if(this.form.sub_2_category_id)
      this.getSub3Categories(this.form.category_id, this.form.sub_category_id, this.form.sub_2_category_id)
  },
  components: {
    BackButton,
    Countries
  },
  methods: {
    getSubCategories(categoryId) {
      this.sub_categories = []
      this.sub_categories.push({
        label: 'Select Sub Category',
        code: '',
      })
      let category = this.categories.find(cat => cat.code == categoryId)
      category.sub_categories.forEach(sub_category => {
        this.sub_categories.push({
          label: sub_category.name,
          code: sub_category.id,
        })
      })
    },
    getSub2Categories(categoryId, subCategoryId) {
      this.sub_2_categories = []
      this.sub_2_categories.push({
        label: 'Select Sub 2 Category',
        code: '',
      })
      let category = this.categories.find(cat => cat.code == categoryId)
      let sub_category = category.sub_categories.find(sub_cat => sub_cat.id == subCategoryId)
      sub_category.sub_2_categories.forEach(sub_2_category => {
        this.sub_2_categories.push({
          label: sub_2_category.name,
          code: sub_2_category.id,
        })
      })
    },
    getSub3Categories(categoryId, subCategoryId, sub2CategoryId) {
      this.sub_3_categories = []
      this.sub_3_categories.push({
        label: 'Select Sub 3 Category',
        code: '',
      })
      let category = this.categories.find(cat => cat.code == categoryId)
      let sub_category = category.sub_categories.find(sub_cat => sub_cat.id == subCategoryId)
      let sub_2_category = sub_category.sub_2_categories.find(sub_2_cat => sub_2_cat.id == sub2CategoryId)
      sub_2_category.sub_3_categories.forEach(sub_3_category => {
        this.sub_3_categories.push({
          label: sub_3_category.name,
          code: sub_3_category.id,
        })
      })
    },
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.patch(`/products/${this.form.id}`, this.form)
        this.$router.push(`/organizations/${this.organization.value}/products/${this.form.id}/details`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>