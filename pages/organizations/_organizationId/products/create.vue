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
                  <h3 class="card-title">Create Product</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Inventory</label>
                    <v-select 
                      v-model="form.inventory_id" 
                      :reduce="inventory => inventory.code" 
                      :options="inventories"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.inventory_id"
                    >{{ errors.inventory_id[0] }}</span>
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
                      @input="getSubCategories(form.category_id)"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.sub_category_id"
                    >{{ errors.sub_category_id[0] }}</span>
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
                    <label class="form-label">Location</label>
                    <countries
                      :option.sync="form.location"
                    ></countries>
                    <span class="help-block" 
                      v-if="errors.location"
                    >{{ errors.location[0] }}</span>
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
  name: 'CreateProduct',
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
    return {
      inventories: inventories,
      categories: categories,
    }
  },
  data: () => ({
    form: {
      inventory_id: '',
      category_id: '',
      sub_category_id: '',
      user_id: '',
      location: '',
    },
    sub_categories: [
      {
        label: 'Select Sub Category',
        code: '',
      }
    ],
    loading: false
  }),
  mounted() {
    this.form.user_id = this.user.id
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
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/products`, this.form)
        admin = admin.data.data
        this.$router.push(`/organizations/${this.organization.value}/products/${admin.id}/details`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>