<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Images</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Images</li>
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
              <input type="text" class="form-control" v-model="searchData" @keydown.enter="search" placeholder="Search by unit">
              <a class="refresh" href="#" @click="getData">Refresh</a>
              <br>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Images</h3> &nbsp;
                  <button class="btn btn-sm btn-info float-sm-right"
                    @click="handleFileUpload"
                    v-if="!loading"
                  >Update</button>
                  <button class="btn btn-sm btn-info float-sm-right" v-else
                  >Loading...</button>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Image Name</th>
                        <th>Image</th>
                        <th>Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Home Banner 1</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.home_banner_path_1}`">
                            <img style="width: 150px; height: 150px;" :src="item.home_banner_path_1 ? (mediaUrl + item.home_banner_path_1) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="home_banner_path_1" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Home Banner 2</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.home_banner_path_2}`">
                            <img style="width: 150px; height: 150px;" :src="item.home_banner_path_2 ? (mediaUrl + item.home_banner_path_2) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="home_banner_path_2" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Home Banner 3</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.home_banner_path_3}`">
                            <img style="width: 150px; height: 150px;" :src="item.home_banner_path_3 ? (mediaUrl + item.home_banner_path_3) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="home_banner_path_3" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Portrait Banner 1</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.portrait_banner_path_1}`">
                            <img style="width: 150px; height: 150px;" :src="item.portrait_banner_path_1 ? (mediaUrl + item.portrait_banner_path_1) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="portrait_banner_path_1" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>Portrait Banner 2</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.portrait_banner_path_2}`">
                            <img style="width: 150px; height: 150px;" :src="item.portrait_banner_path_2 ? (mediaUrl + item.portrait_banner_path_2) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="portrait_banner_path_2" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>Portrait Banner 3</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.portrait_banner_path_3}`">
                            <img style="width: 150px; height: 150px;" :src="item.portrait_banner_path_3 ? (mediaUrl + item.portrait_banner_path_3) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="portrait_banner_path_3" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td>Landscape Banner 1</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.landscape_banner_path_1}`">
                            <img style="width: 150px; height: 150px;" :src="item.landscape_banner_path_1 ? (mediaUrl + item.landscape_banner_path_1) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="landscape_banner_path_1" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>8</td>
                        <td>Landscape Banner 2</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.landscape_banner_path_2}`">
                            <img style="width: 150px; height: 150px;" :src="item.landscape_banner_path_2 ? (mediaUrl + item.landscape_banner_path_2) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="landscape_banner_path_2" accept="application/ms-excel" multiple>
                        </td>
                      </tr>
                      <tr>
                        <td>9</td>
                        <td>Landscape Banner 3</td>
                        <td>
                          <a target="_blank" :href="`${mediaUrl}${item.landscape_banner_path_3}`">
                            <img style="width: 150px; height: 150px;" :src="item.landscape_banner_path_3 ? (mediaUrl + item.landscape_banner_path_3) : '/dist/img/AdminLTELogo.png'">
                          </a>
                        </td>
                        <td>
                          <input type="file" id="file" name="file" ref="landscape_banner_path_3" accept="application/ms-excel" multiple>
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
  name: 'Manageimages',
  data:() =>  ({
    searchData: '',
    item: {},
    loading: true,
  }),
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.item = {}
      this.loading = true
      let item = await this.$axios.get(`/web_images/${this.organization.value}`)
      this.item = item.data.data
      this.loading = false
    },
    async del(id) {
      let r = confirm('Are you sure you want to delete the data?')
      if(r == true)
        await this.$axios.delete(`/units/${id}`)
      this.getData()
    },
    async handleFileUpload() {
      this.loading = true
      this.home_banner_path_1 = this.$refs.home_banner_path_1.files[0]
      this.home_banner_path_2 = this.$refs.home_banner_path_2.files[0]
      this.home_banner_path_3 = this.$refs.home_banner_path_3.files[0]

      this.portrait_banner_path_1 = this.$refs.portrait_banner_path_1.files[0]
      this.portrait_banner_path_2 = this.$refs.portrait_banner_path_2.files[0]
      this.portrait_banner_path_3 = this.$refs.portrait_banner_path_3.files[0]

      this.landscape_banner_path_1 = this.$refs.landscape_banner_path_1.files[0]
      this.landscape_banner_path_2 = this.$refs.landscape_banner_path_2.files[0]
      this.landscape_banner_path_3 = this.$refs.landscape_banner_path_3.files[0]

      let formData = new FormData();
      formData.append('home_banner_path_1', this.home_banner_path_1);
      formData.append('home_banner_path_2', this.home_banner_path_2);
      formData.append('home_banner_path_3', this.home_banner_path_3);

      formData.append('portrait_banner_path_1', this.portrait_banner_path_1);
      formData.append('portrait_banner_path_2', this.portrait_banner_path_2);
      formData.append('portrait_banner_path_3', this.portrait_banner_path_3);

      formData.append('landscape_banner_path_1', this.landscape_banner_path_1);
      formData.append('landscape_banner_path_2', this.landscape_banner_path_2);
      formData.append('landscape_banner_path_3', this.landscape_banner_path_3);
      await this.$axios.post('upload_web_images_photo', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(response => {
        alert('Uploaded. Please reload  the page')
        this.loading = false
      })
      .catch(function(){
        this.loading = false
        console.log('FAILURE!!');
      });
    },
  },
}
</script>