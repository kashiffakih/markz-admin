<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Products</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Products</li>
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
              <div class="row">
                <div class="col-sm-3">
                  <v-select
                    v-model="category_id"
                    :reduce="(category) => category.code"
                    :options="categories"
                    @input="getSubCategories(category_id)"
                  ></v-select>
                </div>
                <div class="col-sm-3">
                  <v-select
                    v-model="sub_category_id"
                    :reduce="(sub_category) => sub_category.code"
                    :options="sub_categories"
                    @input="getSub2Categories(category_id, sub_category_id)"
                  ></v-select>
                </div>
                <div class="col-sm-3">
                  <v-select
                    v-model="sub_2_category_id"
                    :reduce="(sub_2_category) => sub_2_category.code"
                    :options="sub_2_categories"
                    @input="
                      getSub3Categories(
                        category_id,
                        sub_category_id,
                        sub_2_category_id
                      )
                    "
                  ></v-select>
                </div>
                <div class="col-sm-3">
                  <v-select
                    v-model="sub_3_category_id"
                    :reduce="(sub_3_category) => sub_3_category.code"
                    :options="sub_3_categories"
                    @input="filterProducts"
                  ></v-select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <!-- <input type="text" class="form-control" v-model="searchData" @keydown.enter="search" placeholder="Search by product name">
              <a class="refresh" href="#" @click="getData">Refresh</a> -->
              <br />
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Products</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right"
                    :to="`/organizations/${organization.value}/products/create`"
                    >Add New</nuxt-link
                  >
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Actions</th>
                        <!-- <th>Position</th> -->
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Inventory</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Sub 2 Category</th>
                        <th>Sub 3 Category</th>
                        <th>Veg / Non Veg</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr v-for="(product, i) in items" :key="`product${i}`">
                        <td>{{ i + 1 }}</td>
                        <td class="w-1">
                          <nuxt-link
                            title="Edit Details"
                            class="icon"
                            :to="`/organizations/${organization.value}/products/${product.id}`"
                          >
                            <i class="fa fa-edit"></i> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            title="Delete Inspector"
                            class="icon"
                            to=""
                          >
                            <span @click="del(product.id)">
                              <i class="fa fa-trash"></i>
                            </span> </nuxt-link
                          >&nbsp;&nbsp;
                          <nuxt-link
                            class="btn btn-sm btn-info"
                            :to="`/organizations/${organization.value}/products/${product.id}/details`"
                            >Add More Details</nuxt-link
                          >
                        </td>
                        <!-- <td>{{ product.position }}</td> -->
                        <td>
                          <img
                            :src="
                              product.imagepath1
                                ? mediaUrl + product.imagepath1
                                : '/product-vector.png'
                            "
                            style="width: 50px; height: 50px; opacity: 0.8"
                            class="brand-image img-circle elevation-3"
                          />
                        </td>
                        <td>{{ product.name }}</td>
                        <td>
                          {{ product.inventory ? product.inventory.name : "" }}
                        </td>
                        <td>
                          {{ product.category ? product.category.name : "" }}
                        </td>
                        <td>
                          {{
                            product.sub_category
                              ? product.sub_category.name
                              : ""
                          }}
                        </td>
                        <td>
                          {{
                            product.sub_2_category
                              ? product.sub_2_category.name
                              : ""
                          }}
                        </td>
                        <td>
                          {{
                            product.sub_3_category
                              ? product.sub_3_category.name
                              : ""
                          }}
                        </td>
                        <td>{{ product.veg_nonveg }}</td>
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
import "vue-select/dist/vue-select.css";

export default {
  name: "Manageproducts",
  async asyncData({ $axios, params }) {
    let c = await $axios.get(`/categories`);
    c = c.data.data;
    let categories = [];
    categories.push({
      label: "Select Category",
      code: "",
      sub_categories: [],
    });
    c.forEach((cat) => {
      categories.push({
        label: cat.name,
        code: cat.id,
        sub_categories: cat.sub_categories,
      });
    });
    return {
      categories: categories,
    };
  },
  data: () => ({
    searchData: "",
    items: [],
    loading: true,
    category_id: "",
    sub_category_id: "",
    sub_2_category_id: "",
    sub_3_category_id: "",
    sub_categories: [
      {
        label: "Select Sub Category",
        code: "",
      },
    ],
    sub_2_categories: [
      {
        label: "Select Sub 2 Category",
        code: "",
      },
    ],
    sub_3_categories: [
      {
        label: "Select Sub 3 Category",
        code: "",
      },
    ],
    allItems: [],
  }),
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      let items = await this.$axios.get(`/products`);
      this.items = items.data.data;
      this.allItems = this.items;
      this.loading = false;
    },
    async search() {
      if (this.searchData != "") {
        this.loading = true;
        let items = await this.$axios.get(
          `/products?search=${this.searchData}`
        );
        this.items = items.data.data;
        this.allItems = this.items;
        this.loading = false;
      }
    },
    async del(id) {
      let r = confirm("Are you sure you want to delete the data?");
      if (r == true) await this.$axios.delete(`/products/${id}`);
      this.getData();
    },
    getSubCategories(categoryId) {
      this.sub_category_id = "";
      this.sub_2_category_id = "";
      this.sub_3_category_id = "";
      this.filterProducts();
      this.sub_categories = [];
      this.sub_categories.push({
        label: "Select Sub Category",
        code: "",
      });
      let category = this.categories.find((cat) => cat.code == categoryId);
      category.sub_categories.forEach((sub_category) => {
        this.sub_categories.push({
          label: sub_category.name,
          code: sub_category.id,
        });
      });
    },
    getSub2Categories(categoryId, subCategoryId) {
      this.sub_2_category_id = "";
      this.sub_3_category_id = "";
      this.filterProducts();
      this.sub_2_categories = [];
      this.sub_2_categories.push({
        label: "Select Sub 2 Category",
        code: "",
      });
      let category = this.categories.find((cat) => cat.code == categoryId);
      let sub_category = category.sub_categories.find(
        (sub_cat) => sub_cat.id == subCategoryId
      );
      sub_category.sub_2_categories.forEach((sub_2_category) => {
        this.sub_2_categories.push({
          label: sub_2_category.name,
          code: sub_2_category.id,
        });
      });
    },
    getSub3Categories(categoryId, subCategoryId, sub2CategoryId) {
      this.sub_3_category_id = "";
      this.filterProducts();
      this.sub_3_categories = [];
      this.sub_3_categories.push({
        label: "Select Sub 3 Category",
        code: "",
      });
      let category = this.categories.find((cat) => cat.code == categoryId);
      let sub_category = category.sub_categories.find(
        (sub_cat) => sub_cat.id == subCategoryId
      );
      let sub_2_category = sub_category.sub_2_categories.find(
        (sub_2_cat) => sub_2_cat.id == sub2CategoryId
      );
      sub_2_category.sub_3_categories.forEach((sub_3_category) => {
        this.sub_3_categories.push({
          label: sub_3_category.name,
          code: sub_3_category.id,
        });
      });
    },
    filterProducts() {
      if (this.category_id)
        this.items = this.allItems.filter(
          (item) => item.category_id == this.category_id
        );
      else this.items = this.allItems;
      if (this.sub_category_id != "")
        this.items = this.items.filter(
          (item) => item.sub_category_id == this.sub_category_id
        );
      if (this.sub_2_category_id != "")
        this.items = this.items.filter(
          (item) => item.sub_2_category_id == this.sub_2_category_id
        );
      if (this.sub_3_category_id != "")
        this.items = this.items.filter(
          (item) => item.sub_3_category_id == this.sub_3_category_id
        );
      if (
        !this.category_id &&
        !this.sub_category_id &&
        !this.sub_2_category_id &&
        !this.sub_3_category_id
      )
        this.items = this.allItems;
    },
  },
};
</script>
