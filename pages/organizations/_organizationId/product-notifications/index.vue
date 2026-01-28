<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <back-button />
            <h1 class="m-0 text-dark">Product Notifications</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <nuxt-link to="/">Home</nuxt-link>
              </li>
              <li class="breadcrumb-item active">Product Notifications</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">All Notifications</h3>
            <div class="card-tools">
              <form class="form-inline" @submit.prevent="getNotifications(1)">
                <div class="input-group input-group-sm mr-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Product Name"
                    v-model="filters.product"
                  />
                </div>
                <div class="input-group input-group-sm mr-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Pack"
                    v-model="filters.pack"
                  />
                </div>
                <div
                  class="input-group input-group-sm mr-2"
                  style="width: 80px"
                >
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Qty"
                    v-model="filters.qty"
                  />
                </div>
                <button type="submit" class="btn btn-primary btn-sm">
                  <i class="fas fa-search"></i> Search
                </button>
              </form>
            </div>
          </div>
          <div class="card-body p-0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Actions</th>
                  <th>Product</th>
                  <th>Pack</th>
                  <th>User</th>
                  <th>Quantity</th>
                  <th>Created At</th>
                  <!-- <th>Actions</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in notifications" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.product ? item.product.name : "N/A" }}</td>
                  <td>
                    {{
                      item.product_pack
                        ? item.product_pack.size || item.product_pack.name
                        : "N/A"
                    }}
                  </td>
                  <td>{{ item.user ? item.user.name : "N/A" }}</td>
                  <td>{{ item.qty }}</td>
                  <td>
                    {{ $moment(item.created_at).format("DD MMM YYYY, h:mm a") }}
                  </td>
                  <!-- <td>
                    <button class="btn btn-danger btn-sm" @click="deleteItem(item.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td> -->
                  <td>
                    <nuxt-link title="Delete Notification" class="icon" to="">
                      <span @click="deleteItem(item.id)">
                        <i class="fa fa-trash"></i>
                      </span>
                    </nuxt-link>
                  </td>
                </tr>
                <tr v-if="notifications.length === 0">
                  <td colspan="7" class="text-center">
                    No notifications found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer clearfix">
            <pagination
              v-if="pagination.total"
              :total-items="pagination.total"
              :per-page="pagination.per_page"
              :current-page="pagination.current_page"
              @page-changed="getNotifications"
            ></pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  layout: "default",
  components: {
    BackButton,
    Pagination,
  },
  data() {
    return {
      notifications: [],
      pagination: {},
      loading: false,
      filters: {
        product: "",
        pack: "",
        qty: "",
      },
    };
  },
  mounted() {
    this.getNotifications();
  },
  methods: {
    async getNotifications(page = 1) {
      this.loading = true;
      try {
        const response = await this.$axios.get(`/product_notifications`, {
          params: {
            page: page,
            ...this.filters,
          },
        });
        this.notifications = response.data.data;
        this.pagination = response.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        this.$toast.error("Failed to load notifications");
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(id) {
      if (
        await this.$root.confirm(
          "Are you sure you want to delete this notification?"
        )
      ) {
        try {
          await this.$axios.delete(`/product_notifications/${id}`);
          this.$toast.success("Notification deleted successfully");
          this.getNotifications(this.pagination.current_page);
        } catch (error) {
          console.error("Error deleting notification:", error);
          this.$toast.error("Failed to delete notification");
        }
      }
    },
  },
};
</script>
