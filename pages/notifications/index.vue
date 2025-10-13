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

              <h1 class="m-0 text-dark">Notifications</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Notifications</li>
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
            <div class="col-12">
              <input type="text" class="form-control" v-model="searchData" @keydown.enter="search" placeholder="Search by notification name">
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Notifications</h3> &nbsp;
                  <nuxt-link class="btn btn-sm btn-info float-sm-right" :to="`/notifications/create`">Add New</nuxt-link>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <th>Title</th>
                        <th>Text</th>
                        <th>To</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-if="loading"
                      > 
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(notification, i) in items"
                        :key="`notification${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <!-- <nuxt-link title="Edit Details" class="icon" :to="`/notifications/${notification.id}`">
                            <i class="fa fa-edit"></i>
                          </nuxt-link>&nbsp;&nbsp; -->
                          <nuxt-link title="Delete Inspector" class="icon" to="">
                            <span @click="del(notification.id)">
                              <i class="fa fa-trash"></i>
                            </span>
                          </nuxt-link>
                        </td>
                        <td>{{ notification.title }}</td>
                        <td>{{ notification.text }}</td>
                        <td>{{ notification.to }}</td>
                        <td>
                          {{ notification.s_all == 1 ? 'All Stores | ' : '' }}
                          {{ notification.s_approved == 1 ? 'Approved Stores | ' : '' }}
                          {{ notification.s_enabled == 1 ? 'Enabled Stores | ' : '' }}
                          {{ notification.u_all == 1 ? 'All Users | ' : '' }}
                          {{ notification.u_delivery == 1 ? 'Delivery Rider | ' : '' }}
                          {{ notification.v_a == 1 ? 'Available Delivery Rider | ' : '' }}
                          {{ notification.v_na == 1 ? 'Not Available Delivery Rider | ' : '' }}
                          {{ notification.u_customer == 1 ? 'Customer | '  : ''}}
                          {{ notification.s_approved == 1 ? 'Approved Stores | ' : '' }}
                          {{ notification.u_active == 1 ? 'Active Customer | ' : '' }} 
                          {{ notification.u_inactive == 1 ? 'InActive Customer | ' : '' }} 
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
import BackButton from "@/components/BackButton.vue";
export default {
  name: 'Managenotifications',
  components: {
    BackButton
  },
  data:() =>  ({
    searchData: '',
    items: [],
    loading: true,
  }),
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.items = []
      this.loading = true
      let items = await this.$axios.get(`/notifications`)
      this.items = items.data.data
      this.loading = false
    },
    async search() {
      if(this.searchData != "")
      {
        this.loading = true
        let items = await this.$axios.get(`/notifications?search=${this.searchData}`);
        this.items = items.data.data
        this.loading = false
      }
    },
    async del(id) {
      let r = confirm('Are you sure you want to delete the data?')
      if(r == true)
        await this.$axios.delete(`/notifications/${id}`)
      this.getData()
    },
  },
}
</script>