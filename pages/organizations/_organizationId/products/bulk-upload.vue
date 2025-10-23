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

              <h1 class="m-0 text-dark">Bulk Product Upload</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Bulk Product Upload</li>
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
          <div class="card">
            <div class="col-md-12" style="padding: 10px">
              <input
                type="file"
                id="file"
                name="file"
                ref="file"
                accept="application/ms-excel"
                @input="handleFileUpload()"
              />
            </div>
            <div class="col-md-12" style="padding: 10px">
              <button
                class="btn btn-primary"
                :disabled="isProcessing"
                @click="processFile"
              >
                Process File
              </button>
              <button
                class="btn btn-danger"
                :disabled="isProcessing"
                @click="truncateProducts"
              >
                Truncate Products
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <!-- <input type="text" class="form-control" v-model="searchData" @keydown.enter="search" placeholder="Search by product name">
              <a class="refresh" href="#" @click="getData">Refresh</a> -->
              <br />
              <div class="card">
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>App Display Name</th>
                        <th>Product Name</th>
                        <th>Points</th>
                        <th>Main Category</th>
                        <th>Second Category</th>
                        <th>Third Category</th>
                        <th>Colour</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>UOM</th>
                        <th>Is Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="isLoading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr
                        v-for="(product, i) in crude_products"
                        :key="`product${i}`"
                      >
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          {{ product.product_name }}
                        </td>
                        <!-- <td>{{ product.position }}</td> -->
                        <td>
                          {{ product.product_tally_name }}
                        </td>
                        <td>{{ product.points }}</td>
                        <td>
                          {{ product.main_category }}
                        </td>
                        <td>
                          {{ product.second_category }}
                        </td>
                        <td>
                          {{ product.third_category }}
                        </td>
                        <td>
                          {{ product.color }}
                        </td>
                        <td>
                          {{ product.size }}
                        </td>
                        <td>{{ product.price }}</td>
                        <td>{{ product.qty }}</td>
                        <td>{{ product.uom }}</td>
                        <td>{{ product.is_active }}</td>
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

<script>
// import axios from "axios";

export default {
  name: "BulkProductUpload",
  metaInfo: {
    title: "Upload Product Excel",
  },
  data() {
    return {
      crude_products: [],
      isLoading: false,
      is_mail_sent: false,
      isUploading: false,
      is_Uploaded: false,
      isProcessing: false,
      is_Processed: false,
      is_Truncated: false,
      isError: false,
      error_msg: "",
      path: "",
      selectedFile: null,
      uploadProgress: 0,
      isDraggingOver: false,
      headers: [
        { text: "Sr. No.", value: "sr_no", sortable: false },
        { text: "Photo", value: "imagepath1", sortable: false },
        { text: "Name", value: "name" },
        { text: "Inventory", value: "inventory.name" },
        { text: "Category", value: "category.name" },
        { text: "Sub Category", value: "sub_category.name" },
        { text: "Sub 2 Category", value: "sub_2_category.name" },
        { text: "Sub 3 Category", value: "sub_3_category.name" },
        { text: "Veg / Non Veg", value: "veg_nonveg" },
      ],
    };
  },
  computed: {
    crudeProductsList() {
      return this.crude_products || [];
    },
  },
  mounted() {
    this.getData();
    this.path = this.mediaUrl;
    console.log(this.path);
  },
  // methods: {
  //   async getData(page = 1) {
  // this.isLoading = true;
  // let crude_products = await axios.get(`/bulk_products`);
  // this.crude_products = crude_products.data.data;
  // this.count = crude_products.data.count;
  // this.serialNoStarting = (page - 1) * this.rowsPerPage;
  // this.isLoading = false;
  //   },
  //   async handleFileUpload() {
  //     this.isUploading = true;
  //     this.isUploadingError = false;
  //     this.error_msg = "";
  //     this.selectedFile = this.$refs.file.files[0];

  //     if (!this.selectedFile) return;

  //     let formData = new FormData();
  //     formData.append("products", this.selectedFile);

  //     // Simulate upload progress
  //     this.uploadProgress = 0;
  //     const interval = setInterval(() => {
  //       if (this.uploadProgress < 95) {
  //         this.uploadProgress += 5;
  //       }
  //     }, 200);

  //     await axios
  //       .post(`/bulk_product_upload`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         clearInterval(interval);
  //         this.uploadProgress = 100;

  //         if (response.data.data) this.crude_products = response.data.data;
  //         this.is_Uploaded = true;

  //         setTimeout(() => {
  //           this.uploadProgress = 0;
  //         }, 1000);
  //       })
  //       .catch((error) => {
  //         clearInterval(interval);
  //         this.uploadProgress = 0;
  //         this.isError = true;
  //         this.error_msg =
  //           error.response?.data?.message ||
  //           "Looks like system faced an error while uploading the File. Kindly check the file before uploading ...";
  //       })
  //       .finally(() => {
  //         this.isUploading = false;
  //       });
  //   },
  //   onDrop(e) {
  //     this.isDraggingOver = false;
  //     const files = e.dataTransfer.files;
  //     if (files.length) {
  //       const file = files[0];
  //       if (
  //         file.type === "application/vnd.ms-excel" ||
  //         file.type ===
  //           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
  //         file.name.endsWith(".csv")
  //       ) {
  //         this.$refs.file.files = files;
  //         this.handleFileUpload();
  //       } else {
  //         this.isError = true;
  //         this.error_msg = "Please upload a valid Excel or CSV file.";
  //       }
  //     }
  //   },
  //   async processFile() {
  //     try {
  //       this.isProcessing = true;
  //       await axios
  //         .get(
  //           `/organizations/${this.$route.params.organizationId}/process_product`
  //         )
  //         .catch((error) => {
  //           this.isError = true;
  //           this.error_msg =
  //             error.response?.data?.message ||
  //             "Looks like system faced an error while processing the File. Kindly check the file before processing ...";
  //         });
  //       await axios.get(
  //         `/organizations/${this.$route.params.organizationId}/truncate_products`
  //       );
  //       this.crude_products = [];
  //       this.isProcessing = false;
  //       this.is_Processed = true;
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   },
  //   async truncatePendingDocuments() {
  //     await axios.get(
  //       `/organizations/${this.$route.params.organizationId}/truncate_products`
  //     );
  //     this.is_Truncated = true;
  //     this.crude_products = [];
  //     this.selectedFile = null;
  //   },
  // },

  methods: {
    async getData() {
      this.isLoading = true;
      let crude_products = await this.$axios.get(`/bulk_products`);
      this.crude_products = crude_products.data.data;
      // this.count = crude_products.data.count;
      // this.serialNoStarting = (page - 1) * this.rowsPerPage;
      this.isLoading = false;
    },
    async handleFileUpload() {
      console.log("Yes");

      this.isUploading = true;
      this.isUploadingError = false;
      this.error_msg = "";
      this.products = this.$refs.file.files[0];
      let formData = new FormData();
      formData.append("products", this.products);
      this.changeValue = 100;
      await this.$axios
        .post("bulk_product_upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.data) this.crude_products = response.data.data;
          this.is_Uploaded = true;
        })
        .catch(() => {
          this.isError = true;
          this.error_msg =
            "Looks like system faced an error while uploading the File. Kindly check the file before uploading ...";
        });
    },
    async processFile() {
      try {
        this.isProcessing = true;
        await this.$axios.get(`bulk_product_upload/process`).catch(() => {
          this.isError = true;
          this.error_msg =
            "Looks like system faced an error while processing the File. Kindly check the file before processing ...";
        });
        await this.truncateProducts();
        this.crude_products = [];
        this.isProcessing = false;
        this.is_Processed = true;
        alert("Processed Successfully");
      } catch (e) {
        console.log(e);
      }
    },
    async truncateProducts() {
      await this.$axios.get("bulk_product/clear");
      this.is_Truncated = true;

      alert("Truncated Successfully");
      this.getData();
      this.crude_products = [];
    },
  },
};
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #bdbdbd;
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.03);
}

.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
td {
  min-width: 130px !important;
}

.primary {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
}

.secondary {
  background-color: #424242 !important;
  border-color: #424242 !important;
}
</style>
