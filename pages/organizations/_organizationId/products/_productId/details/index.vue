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
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Details</li>
              </ol>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Images -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Add Images for {{ product.name }}</h3>
                  &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br />
                    <div class="card">
                      <div class="card-header">
                        <div class="row">
                          <div class="col-md-12">
                            <select
                              v-model="unit_id"
                              class="form-group form-control"
                              style="width: 200px"
                            >
                              <option
                                v-for="(unit, u) in units"
                                :key="`unit${u}`"
                                :value="unit.code"
                              >
                                {{ unit.label }}
                              </option>
                            </select>
                          </div>
                          <br />
                          <div class="col-md-6">
                            <div class="form-group">
                              <label class="form-label"
                                >Image 1 (Primary Images) - Select multiple
                                files</label
                              >
                              <br />
                              <input
                                type="file"
                                id="imagepath"
                                name="imagepath"
                                ref="imagepath"
                                accept="image/*"
                                multiple
                                class="form-control-file"
                                @change="updateFileCount()"
                              />
                              <small class="form-text text-muted"
                                >You can select multiple images at once</small
                              >
                              <div v-if="fileCount.imagepath > 0" class="mt-1">
                                <small class="text-success"
                                  >✓ {{ fileCount.imagepath }} file(s)
                                  selected</small
                                >
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label class="form-label"
                                >Image 2 (Secondary Images) - Select
                                files</label
                              >
                              <br />
                              <input
                                type="file"
                                id="imagepath2"
                                name="imagepath2"
                                ref="imagepath2"
                                accept="image/*"
                                multiple
                                class="form-control-file"
                                @change="updateFileCount()"
                              />
                              <small class="form-text text-muted"
                                >You can select multiple images at once</small
                              >
                              <div v-if="fileCount.imagepath2 > 0" class="mt-1">
                                <small class="text-success"
                                  >✓ {{ fileCount.imagepath2 }} file(s)
                                  selected</small
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label class="form-label"
                                >Image 3 (Detail Images) - Select multiple
                                files</label
                              >
                              <br />
                              <input
                                type="file"
                                id="imagepath3"
                                name="imagepath3"
                                ref="imagepath3"
                                accept="image/*"
                                multiple
                                class="form-control-file"
                                @change="updateFileCount()"
                              />
                              <small class="form-text text-muted"
                                >You can select multiple images at once</small
                              >
                              <div v-if="fileCount.imagepath3 > 0" class="mt-1">
                                <small class="text-success"
                                  >✓ {{ fileCount.imagepath3 }} file(s)
                                  selected</small
                                >
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label class="form-label"
                                >Image 4 (Extra Images) - Select multiple
                                files</label
                              >
                              <br />
                              <input
                                type="file"
                                id="imagepath4"
                                name="imagepath4"
                                ref="imagepath4"
                                accept="image/*"
                                multiple
                                class="form-control-file"
                                @change="updateFileCount()"
                              />
                              <small class="form-text text-muted"
                                >You can select multiple images at once</small
                              >
                              <div v-if="fileCount.imagepath4 > 0" class="mt-1">
                                <small class="text-success"
                                  >✓ {{ fileCount.imagepath4 }} file(s)
                                  selected</small
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          class="btn btn-primary"
                          @click="handleFileUpload()"
                          :disabled="loading || !unit_id"
                        >
                          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                          {{ loading ? "Uploading..." : "Upload Images" }}
                        </button>
                        <div v-if="!unit_id" class="mt-2">
                          <small class="text-warning"
                            >⚠️ Please select a unit first</small
                          >
                        </div>
                      </div>
                      <br />
                      <!-- <div class="row">
                        <div class="card">
                          <div class="card-body table-responsive p-0"> -->
                      <table class="table table-head-fixed table-striped">
                        <thead>
                          <tr>
                            <th>Sr. No.</th>
                            <th>Unit</th>
                            <th>Image 1</th>
                            <th>Image 2</th>
                            <th>Image 3</th>
                            <th>Image 4</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="loading">
                            <td colspan="6">Loading...</td>
                          </tr>
                          <tr
                            v-for="(image, i) in product.product_images"
                            :key="`image${i}`"
                          >
                            <td>{{ i + 1 }}</td>

                            <td>{{ image.unit.name }}</td>
                            <td>
                              <img
                                :src="
                                  image.imagepath
                                    ? mediaUrl + image.imagepath
                                    : '/product-vector.png'
                                "
                                style="width: 70px; height: 70px; opacity: 0.8"
                                class="brand-image img-circle elevation-3"
                              />
                            </td>
                            <td>
                              <img
                                :src="
                                  image.imagepath2
                                    ? mediaUrl + image.imagepath2
                                    : '/product-vector.png'
                                "
                                style="width: 70px; height: 70px; opacity: 0.8"
                                class="brand-image img-circle elevation-3"
                              />
                            </td>
                            <td>
                              <img
                                :src="
                                  image.imagepath3
                                    ? mediaUrl + image.imagepath3
                                    : '/product-vector.png'
                                "
                                style="width: 70px; height: 70px; opacity: 0.8"
                                class="brand-image img-circle elevation-3"
                              />
                            </td>
                            <td>
                              <img
                                :src="
                                  image.imagepath4
                                    ? mediaUrl + image.imagepath4
                                    : '/product-vector.png'
                                "
                                style="width: 70px; height: 70px; opacity: 0.8"
                                class="brand-image img-circle elevation-3"
                              />
                            </td>
                            <td>
                              <i
                                class="fa fa-trash"
                                style="color: red"
                                @click="deleteImage(image.id)"
                              ></i>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- </div>
                        </div>
                      </div> -->
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
                  <h3 class="card-title">Add Tags for {{ product.name }}</h3>
                  &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br />
                    <div class="card">
                      <div class="card-header">
                        <div class="row">
                          <div
                            class="col-md-3"
                            v-for="(tag, t) in tags"
                            :key="`tag${t}`"
                          >
                            <div class="form-group">
                              <input
                                type="checkbox"
                                v-model="tagIds"
                                :value="tag.id"
                                @change="updateTags"
                              />&nbsp;&nbsp;{{ tag.name }}
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

      <!-- Update Button -->
      <section class="content">
        <div class="container-fluid">
          <button class="btn btn-primary btn-block" @click="update">
            {{ loading ? "Saving..." : "Update Details" }}
          </button>
        </div>
      </section>

      <br />
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import ProductPack from "./pack.vue";

export default {
  name: "ManageDetails",
  async asyncData({ $axios, params }) {
    let org = await $axios.get(`/companies/${params.organizationId}`);
    org = org.data.data;
    let u = await $axios.get(`/units`);
    u = u.data.data;
    let units = [];
    units.push({
      label: "Select Unit",
      code: "",
    });
    u.forEach((role) => {
      units.push({
        label: role.name,
        code: role.id,
      });
    });
    return {
      units: units,
      org: org,
    };
  },
  data: () => ({
    searchData: "",
    loading: false,
    form: {},
    tags: [],
    unit_id: "",
    product: {
      inventory: {},
    },
    tagIds: [],
    prices: [],
    offers: [],
    cashbacks: [],
    distributorPrices: [],
    distributorOfferPrices: [],
    defaults: [],
    fileCount: {
      imagepath: 0,
      imagepath2: 0,
      imagepath3: 0,
      imagepath4: 0,
    },
  }),
  components: {
    ProductPack,
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let tags = await this.$axios.get(`/tags`);
      let product = await this.$axios.get(
        `/products/${this.$route.params.productId}`
      );
      this.tags = tags.data.data;
      this.product = product.data.data;

      this.getTags();
      this.getPrices();
    },
    getTags() {
      this.product.tags.forEach((tag) => {
        this.tagIds.push(tag.id);
      });
    },
    getPrices() {
      this.prices = [];
      this.defaults = [];
      // This is to get the prices already saved and display them
      this.product.product_packs.forEach((pack, c) => {
        let price = this.product.product_prices.find(
          (price) => price.product_pack_id == pack.id
        );
        if (price) {
          this.prices[c] = price.price;
          this.offers[c] = price.offer_price;
          this.cashbacks[c] = price.cashback_price;
          this.distributorPrices[c] = price.distributor_price;
          this.distributorOfferPrices[c] = price.distributor_offer_price;
          this.defaults[c] = parseInt(price.is_default);
        }
      });
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
      this.loading = true;
      try {
        await this.$axios.patch(`/products/${this.product.id}`, this.form);
        // this.handleFileUpload();
        this.loading = false;
        this.$router.push(`/organizations/${this.organization.value}/products`);
        // this.getData()
      } catch (e) {
        this.loading = false;
      }
    },
    async updateTags() {
      let payload = {
        product_id: this.product.id,
        tag_ids: this.tagIds,
      };
      await this.$axios.post(`/product_tag`, payload);
    },
    async updatePrice(
      u,
      price,
      productPackId,
      offerPrice,
      cashbackPrice,
      distributorPrice,
      distributorOfferPrice
    ) {
      let payload = {
        product_id: this.product.id,
        price: price,
        offer_price: offerPrice,
        cashback_price: cashbackPrice,
        distributor_price: distributorPrice,
        distributor_offer_price: distributorOfferPrice,
        product_pack_id: productPackId,
        is_default: this.defaults[u],
        date: new Date(),
      };
      try {
        await this.$axios.post(
          `/products/${this.product.id}/product_prices`,
          payload
        );
        this.getData();
      } catch (ex) {}
    },
    updatePacks(packs) {
      this.product.product_packs = packs;
    },
    async handleFileUpload() {
      this.loading = true;

      // Check if unit is selected
      if (!this.unit_id) {
        alert("Please select a unit before uploading images");
        this.loading = false;
        return;
      }

      // Get all files from all inputs
      const imageFiles = {
        imagepath: this.$refs.imagepath.files,
        imagepath2: this.$refs.imagepath2.files,
        imagepath3: this.$refs.imagepath3.files,
        imagepath4: this.$refs.imagepath4.files,
      };

      // Check if any files are selected
      const hasFiles = Object.values(imageFiles).some(
        (fileList) => fileList.length > 0
      );
      if (!hasFiles) {
        alert("Please select at least one image to upload");
        this.loading = false;
        return;
      }

      try {
        // Create single FormData with all images
        const formData = new FormData();
        formData.append("productid", this.product.id);
        formData.append("unitid", this.unit_id);

        // Add all files from each input to the same FormData
        for (const [fieldName, fileList] of Object.entries(imageFiles)) {
          if (fileList.length > 0) {
            // Add all files from this input
            for (let i = 0; i < fileList.length; i++) {
              formData.append(fieldName, fileList[i]);
            }
          }
        }

        // Single API call with all images
        await this.$axios.post("upload_product_attachment", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Clear file inputs after successful upload
        this.$refs.imagepath.value = "";
        this.$refs.imagepath2.value = "";
        this.$refs.imagepath3.value = "";
        this.$refs.imagepath4.value = "";

        // Reset file counts
        this.fileCount = {
          imagepath: 0,
          imagepath2: 0,
          imagepath3: 0,
          imagepath4: 0,
        };

        // Refresh data to show new images
        await this.getData();

        alert("Images uploaded successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      } finally {
        this.loading = false;
      }
    },
    deleteImage(product_image_id) {
      let r = confirm("Are you sure you want to delete the data?");
      if (r == true) this.$axios.patch(`/product_images/${product_image_id}`);
      this.getData();
    },
    updateFileCount() {
      this.fileCount.imagepath = this.$refs.imagepath?.files?.length || 0;
      this.fileCount.imagepath2 = this.$refs.imagepath2?.files?.length || 0;
      this.fileCount.imagepath3 = this.$refs.imagepath3?.files?.length || 0;
      this.fileCount.imagepath4 = this.$refs.imagepath4?.files?.length || 0;
    },
  },
};
</script>
