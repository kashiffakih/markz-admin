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
                  :link="`/organizations/${organization.value}/inventories`"
                >
                </back-button>
                Inventory</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/organizations/${this.organization.value}/inventories`">Inventories</nuxt-link>
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
                  <h3 class="card-title">Create Inventory</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Inventory Name</label>
                    <input type="text" class="form-control" placeholder="Enter inventory name"
                      v-model="form.name"
                    >
                    <span class="help-block" 
                      v-if="errors.name"
                    >{{ errors.name[0] }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Purchased Unit</label>
                    <v-select 
                      v-model="form.unit_id" 
                      :reduce="unit => unit.code" 
                      :options="units"
                    ></v-select>
                    <span class="help-block" 
                      v-if="errors.unit_id"
                    >{{ errors.unit_id[0] }}</span>
                  </div>
                  <div class="form-footer">
                    <button class="btn btn-primary btn-block"
                      @click="store"
                    >{{ loading ? 'Saving...' : 'Create Inventory' }}</button>
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

export default {
  name: 'CreateInventory',
  async asyncData({$axios, params}) {
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
      units: units
    }
  },
  data: () => ({
    form: {
      unit_id: ''
    },
    loading: false
  }),
  mounted() {
  },
  components: {
    BackButton,
  },
  methods: {
    async store() {
      this.loading = true
      try {
        let admin = await this.$axios.post(`/inventories`, this.form)
        this.$router.push(`/organizations/${this.organization.value}/inventories`)
        this.loading = false
      }
      catch(e) {
        this.loading = false
      }
    },
  }
}
</script>