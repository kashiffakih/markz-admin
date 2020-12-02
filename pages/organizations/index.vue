<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Organizations</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Organizations</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <input type="text" class="form-control" v-model="searchData" @keydown.enter="search" placeholder="Search by organization name">
          <br>
          <div class="card">
            <div class="col-md-12" style="padding: 10px;">
              <div class="row">
                <div class="col-sm-3">
                  <v-select 
                    v-model="category_id" 
                    :reduce="category => category.code" 
                    :options="categories"
                    @input="filter"
                  ></v-select>
                </div>
                <div class="col-sm-3">
                  <input @change="filter" type="checkbox" v-model="checkApproved"> Only Approved
                </div>
                <div class="col-sm-3">
                  <input @change="filter" type="checkbox" v-model="checkEnabled"> Only Enabled
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Organizations</h3> &nbsp;
                  <nuxt-link class="btn btn-sm btn-info" to="/organizations/create">Add New</nuxt-link>
                  <!-- <div class="card-tools">
                    <div class="input-group input-group-sm" style="width: 150px;">
                      <input type="text" name="table_search" class="form-control float-right" placeholder="Search">

                      <div class="input-group-append">
                        <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
                      </div>
                    </div>
                  </div> -->
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Logo</th>
                        <th>Position</th>
                        <th>Store</th>
                        <th>Store Type</th>
                        <th>Admin Details</th>
                        <th>Is Approved</th>
                        <th>Is Enabled</th>
                        <th>Is Available</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="(org, i) in items"
                        :key="`org1${i}`"
                      >
                        <td>{{ org.id }}</td>
                        <td>
                          <img :src="org.logo_path ? (mediaUrl + org.logo_path) : mediaUrl + 'company.png'"
                           style="width: 70px; height: 70px;opacity: .8;"
                           class="brand-image img-circle elevation-3"
                          >
                        </td>
                        <td>
                          {{ org.position }}
                        </td>
                        <td>
                          {{ org.name }}<br>
                          City: {{ org.location ? org.location.name : '' }}
                        </td>
                        <td>
                          {{ org.category ? org.category.name : '' }}
                        </td>
                        <td v-if="org.users.length == 0">
                          <nuxt-link class="btn btn-primary btn-sm" :to="`/organizations/${org.organizationId}/admins/create`">
                            Add Admin Details
                          </nuxt-link>
                        </td>
                        <td v-else>
                          <nuxt-link class="btn btn-primary btn-sm" :to="`/organizations/${org.organizationId}/admins/${org.users[0].id}`">
                            Edit Admin Details
                          </nuxt-link>
                          <br>
                          Name: {{ org.users[0].name }} <br>
                          Email: {{ org.users[0].email }} <br>
                          Phone: {{ org.users[0].phone }} <br>
                        </td>
                        <td>{{ org.is_approved == 1 ? 'Approved' : 'Not Approved' }}</td>
                        <td>{{ org.is_enabled == 1 ? 'Enabled' : 'Not Enabled' }}</td>
                        <td>{{ org.is_available == 1 ? 'Available' : 'Not Available' }}</td>
                        <td class="w-1">
                          <nuxt-link class="icon" :to="`/organizations/${org.organizationId}`">
                            <i class="fa fa-edit"></i>
                          </nuxt-link>&nbsp;&nbsp;
                          <nuxt-link class="btn btn-primary btn-sm" :to="`/organizations/${org.organizationId}/documents`">
                            Documents
                          </nuxt-link>
                        </td>
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
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageOrganizations',
  async asyncData({$axios, params}) {
    let c = await $axios.get(`/categories`)
    c = c.data.data
    let categories = []
    categories.push({
      label: 'Select Category',
      code: '',
      sub_categories: [],
    })
    c.forEach((cat) => {
      categories.push({
        label: cat.name,
        code: cat.id,
        sub_categories: cat.sub_categories,
      })
    })
    return {
      categories: categories,
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Organization Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Admin Details', value: 'admin_details' },
      { text: 'Action', value: '' }
    ],
    items: [],
    allItems: [],
    loading: true,
    category_id: '',
    checkApproved: '',
    checkEnabled: '',
    searchData: ''
  }),
  async mounted()  {
    let organizations = await this.$axios.get(`/companies?cityId=${this.city.id}`);
    this.organizations = organizations.data.data
    this.setItems()
  },
  methods: {
    setItems() {
      let items = []
      this.organizations.forEach((org, i) => {
        org.users = org.users.filter(u => u.roles[0].name == 'Admin');
        items.push({
          id: i + 1,
          organizationId: org.id,
          name: org.name,
          users: org.users,
          address: org.address,
          logo_path: org.logo_path,
          location: org.location,
          category_id: org.category_id,
          category: org.category,
          is_approved: org.is_approved,
          is_enabled: org.is_enabled,
          is_available: org.is_available,
          position: org.position,
        })
      })
      this.items = items
      this.allItems = items
      this.loading = false
    },
    filter() {
      if(this.category_id)
        this.items = this.allItems.filter(item => item.category_id == this.category_id)
      else
        this.items = this.allItems
      if(this.checkApproved)
        this.items = this.items.filter(item => item.is_approved == 1)
      if(this.checkEnabled)
        this.items = this.items.filter(item => item.is_enabled == 1)
      if(!this.category_id && !this.checkApproved && !this.checkEnabled) 
        this.items = this.allItems
    },
    async search() {
      if(this.searchData != "")
      {
        this.loading = true
        let organizations = await this.$axios.get(`/companies?search=${this.searchData}`);
        this.organizations = organizations.data.data
        this.setItems()
      }
    }
  }
}
</script>