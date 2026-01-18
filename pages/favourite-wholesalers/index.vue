<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Favourite Wholesalers</h1>
            </div>
            <div class="col-sm-6">
              <button class="btn btn-primary float-right" @click="openAddModal">
                <i class="fa fa-plus"></i> Add Favourite
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">List of Favourite Wholesalers</h3>
                </div>
                <div class="card-body table-responsive p-0">
                  <table class="table table-hover table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Business Name</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="5">Loading...</td>
                      </tr>
                      <tr
                        v-for="wholesaler in wholesalers"
                        :key="wholesaler.id"
                      >
                        <td>{{ wholesaler.id }}</td>
                        <td>{{ wholesaler.business_name }}</td>
                        <td>
                          {{ wholesaler.first_name }} {{ wholesaler.last_name }}
                        </td>
                        <td>{{ wholesaler.email }}</td>
                        <td>
                          <nuxt-link
                            :to="`/favourite-wholesalers/${wholesaler.id}/discounts`"
                            class="btn btn-sm btn-info"
                            title="Manage Discounts"
                          >
                            <i class="fa fa-tags"></i> Discounts
                          </nuxt-link>
                          <button
                            class="btn btn-sm btn-danger"
                            @click="removeFavourite(wholesaler)"
                            title="Remove from Favourites"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="!loading && wholesalers.length === 0">
                        <td colspan="5" class="text-center">
                          No favourite wholesalers found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- Pagination could go here if needed -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Add Favourite Modal -->
      <div
        class="modal fade"
        id="addFavouriteModal"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Favourite Wholesaler</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="searchQuery"
                  @keyup.enter="searchWholesalers"
                  placeholder="Search by name, email, or business name"
                />
              </div>
              <button class="btn btn-primary mb-3" @click="searchWholesalers">
                Search
              </button>

              <table class="table table-sm" v-if="searchResults.length > 0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Business</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in searchResults" :key="user.id">
                    <td>{{ user.first_name }} {{ user.last_name }}</td>
                    <td>{{ user.business_name }}</td>
                    <td>
                      <button
                        class="btn btn-sm btn-success"
                        @click="addToFavourites(user)"
                        v-if="!user.is_favourite"
                      >
                        Add
                      </button>
                      <span v-else class="badge badge-success"
                        >Already Added</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  name: "FavouriteWholesalersIndex",
  components: { BackButton },
  data() {
    return {
      wholesalers: [],
      loading: false,
      searchQuery: "",
      searchResults: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      try {
        const response = await this.$axios.get("/favourite-wholesalers");
        this.wholesalers = response.data.data.data; // Paginated response
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      this.loading = false;
    },
    async removeFavourite(wholesaler) {
      if (
        await this.$root.confirm(
          `Remove ${wholesaler.business_name} from favourites?`
        )
      ) {
        try {
          await this.$axios.post(`/users/${wholesaler.id}/favourite`, {
            is_favourite: false,
          });
          this.getData();
        } catch (error) {
          await this.$root.alert("Failed to remove.");
        }
      }
    },
    openAddModal() {
      this.searchQuery = "";
      this.searchResults = [];
      if (typeof $ !== "undefined") $("#addFavouriteModal").modal("show");
    },
    async searchWholesalers() {
      if (!this.searchQuery) return;
      try {
        const response = await this.$axios.get(
          `/users?role_id=3&search=${this.searchQuery}`
        );
        this.searchResults = response.data.data;
      } catch (error) {
        console.error("Search error:", error);
      }
    },
    async addToFavourites(user) {
      try {
        await this.$axios.post(`/users/${user.id}/favourite`, {
          is_favourite: true,
        });
        user.is_favourite = true; // Update local state in modal
        this.getData(); // Refresh main list
      } catch (error) {
        await this.$root.alert("Failed to add.");
      }
    },
  },
};
</script>
