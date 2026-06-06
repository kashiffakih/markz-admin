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

              <h1 class="m-0 text-dark">User Documents</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">User Documents</li>
              </ol>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Documents</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info"
                    :to="`/delivery-users/${$route.params.userId}/documents/create`"
                    >Add New</nuxt-link
                  >

                </div>
                <!-- /.card-header -->
                <div
                  class="card-body table-responsive p-0"
                  style="height: 300px"
                >
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Document</th>
                        <th>Doc Type</th>
                        <th>Doc No.</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="doc in items" :key="doc.id">
                        <td>{{ doc.id }}</td>
                        <td>
                          <a
                            target="_blank"
                            :href="
                              doc.imagepath ? mediaUrl + doc.imagepath : ''
                            "
                            >{{ doc.imagepath }}</a
                          >
                        </td>

                        <td>
                          {{ doc.type }}
                        </td>
                        <td>{{ doc.value }}</td>
                        <td class="w-1">
                          <nuxt-link
                            class="icon"
                            :to="`/delivery-users/${$route.params.userId}/documents/${doc.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link title="Delete" class="icon" to="">
                            <span @click="del(doc.id)">
                              <i class="fa fa-trash"></i>
                            </span>
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
import BackButton from "@/components/BackButton.vue";
export default {
  name: "ManageUsers",
  components: {
    BackButton,
  },
  data: () => ({
    headers: [
      { text: "Sr No", value: "sr_no" },
      {
        text: "User Name",
        align: "left",
        sortable: false,
        value: "name",
      },
      { text: "Admin Details", value: "admin_details" },
      { text: "Action", value: "" },
    ],
    loading: true,
    items: [],
  }),
  mounted() {
    this.loading = false;
    this.getData();
  },
  methods: {
    async getData() {
      let documents = await this.$axios.get(
        `/user_documents?userId=${this.$route.params.userId}`
      );
      this.items = documents.data.data;
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(`/user_documents/${id}`);
      }
      this.getData();
    },
  },
};
</script>
