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
                <!-- <div class="col-sm-3">
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
                </div> -->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-body">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <input
                      type="text"
                      class="form-control w-50"
                      v-model="searchData"
                      @input="search"
                      placeholder="Search by product name"
                    />
                    <div class="d-flex align-items-center">
                      <button class="btn btn-secondary mr-3" @click="getData">
                        <i class="fas fa-sync-alt mr-1"></i> Refresh
                      </button>
                      <client-only>
                        <download-excel
                          class="btn btn-excel d-inline-block"
                          :data="excel_items"
                          :fields="excel_fields"
                          worksheet="Products"
                          name="Products.xls"
                        >
                          <i class="fas fa-file-excel mr-2"></i> Export Products
                        </download-excel>
                      </client-only>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Products</h3>
                  &nbsp;
                  <nuxt-link
                    class="btn btn-sm btn-info float-sm-right ml-2"
                    :to="`/organizations/${organization.value}/products/create`"
                    >Add New</nuxt-link
                  >
                  <button
                    v-if="selectedProducts.length > 0"
                    class="btn btn-sm btn-danger float-sm-right"
                    @click="bulkDelete"
                  >
                    <i class="fa fa-trash mr-1"></i> Delete Selected ({{ selectedProducts.length }})
                  </button>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped align-middle">
                    <thead>
                      <tr>
                        <th class="text-center align-middle" style="width: 45px">
                          <div class="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              id="selectAllCheck"
                              v-model="isAllSelected"
                            />
                            <label class="custom-control-label" for="selectAllCheck"></label>
                          </div>
                        </th>
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="14">Loading...</td>
                      </tr>
                      <tr
                        v-for="(product, i) in paginatedItems"
                        :key="`product${i}`"
                      >
                        <td class="text-center align-middle">
                          <div class="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              :id="`check_${product.id}`"
                              :value="product.id"
                              v-model="selectedProducts"
                            />
                            <label class="custom-control-label" :for="`check_${product.id}`"></label>
                          </div>
                        </td>
                        <td>{{ (Number(currentPage) - 1) * Number(perPage || 10) + i + 1 }}</td>
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
                          {{ product.qty ? product.qty : "0" }}
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
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
                <Pagination
                  v-if="totalItems > 0 || items.length > 0"
                  :total-items="isServerPaginated ? totalItems : items.length"
                  :per-page="perPage"
                  :current-page="currentPage"
                  @page-changed="onPageChanged"
                  @per-page-changed="onPerPageChanged"
                />
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
import Pagination from "@/components/Pagination.vue";
import "vue-select/dist/vue-select.css";

export default {
  name: "Manageproducts",
  components: {
    BackButton,
    Pagination,
  },
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
    searchTimeout: null,
    currentPage: 1,
    perPage: 10,
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
    sub_3_categories: [
      {
        label: "Select Sub 3 Category",
        code: "",
      },
    ],
    totalItems: 0,
    isServerPaginated: false,
    allItems: [],
    excel_fields: {
      Photo: "image",
      Name: "name",
      Inventory: "qty",
      Category: "category_name",
      "Sub Category": "sub_category_name",
    },
    excel_items: [],
    selectedProducts: [],
  }),
  mounted() {
    this.getData();
  },
  computed: {
    paginatedItems() {
      if (this.isServerPaginated) {
        return this.items;
      }
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    },
    isAllSelected: {
      get() {
        if (!this.paginatedItems.length) return false;
        return this.paginatedItems.every((item) =>
          this.selectedProducts.includes(item.id)
        );
      },
      set(value) {
        if (value) {
          const currentPageIds = this.paginatedItems.map((item) => item.id);
          this.selectedProducts = Array.from(
            new Set([...this.selectedProducts, ...currentPageIds])
          );
        } else {
          const currentPageIds = new Set(this.paginatedItems.map((item) => item.id));
          this.selectedProducts = this.selectedProducts.filter(
            (id) => !currentPageIds.has(id)
          );
        }
      },
    },
  },
  methods: {
    onPageChanged(page) {
      this.currentPage = page;
      if (this.isServerPaginated) {
        this.getData();
      }
    },
    onPerPageChanged(perPage) {
      this.perPage = perPage;
      this.currentPage = 1;
      if (this.isServerPaginated) {
        this.getData();
      }
    },
    async getData() {
      this.items = [];
      this.loading = true;
      let params = {
        page: this.currentPage,
        rowsPerPage: this.perPage,
      };
      if (this.searchData) {
        params.search = this.searchData;
      }
      if (this.category_id) {
        params.categoryId = this.category_id;
      }
      if (this.sub_category_id) {
        params.subCategoryId = this.sub_category_id;
      }
      let response = await this.$axios.get(`/products`, { params });
      if (response.data.total !== undefined) {
        this.isServerPaginated = true;
        this.items = response.data.data;
        this.totalItems = response.data.total;
      } else {
        this.isServerPaginated = false;
        this.items = response.data.data;
        this.totalItems = response.data.data.length;
      }
      this.allItems = this.items;
      this.prepareExcelData();
      this.loading = false;
    },
    prepareExcelData() {
      this.excel_items = this.items.map((item) => ({
        image: item.imagepath1 ? this.mediaUrl + item.imagepath1 : "",
        name: item.name,
        qty: item.qty || 0,
        category_name: item.category ? item.category.name : "",
        sub_category_name: item.sub_category ? item.sub_category.name : "",
      }));
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        this.currentPage = 1;
        this.getData();
      }, 300);
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(`/products/${id}`);
        this.selectedProducts = this.selectedProducts.filter(
          (selectedId) => selectedId !== id
        );
        this.getData();
      }
    },
    async bulkDelete() {
      if (!this.selectedProducts.length) return;
      if (
        await this.$root.confirm(
          `Are you sure you want to delete ${this.selectedProducts.length} selected products?`
        )
      ) {
        try {
          this.loading = true;
          await this.$axios.post("/products/bulk-delete", {
            ids: this.selectedProducts,
          });
          this.selectedProducts = [];
          await this.getData();
        } catch (error) {
          console.error("Bulk delete failed:", error);
        } finally {
          this.loading = false;
        }
      }
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

<style scoped>
.custom-control-label {
  cursor: pointer;
}
.custom-control-input:checked ~ .custom-control-label::before {
  background-color: #17a2b8;
  border-color: #17a2b8;
  box-shadow: 0 2px 4px rgba(23, 162, 184, 0.3);
}
.custom-control-label::before {
  border-radius: 4px;
  width: 1.15rem;
  height: 1.15rem;
  border: 2px solid #adb5bd;
  transition: all 0.2s ease-in-out;
}
.custom-control-label::after {
  width: 1.15rem;
  height: 1.15rem;
}
.custom-control-input:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25);
}
</style>
