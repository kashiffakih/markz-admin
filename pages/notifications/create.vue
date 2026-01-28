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

              <h1 class="m-0 text-dark">Notification</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link :to="`/notifications`">Notifications</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Create</li>
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
          <div class="row justify-content-center">
            <!-- left column -->
            <div class="col-md-6">
              <!-- jquery validation -->
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Create Notification</h3>
                </div>
                <!-- /.card-header -->
                <!-- form start -->
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Notification Title</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Enter notification title"
                      v-model="form.title"
                    />
                    <span class="help-block" v-if="errors.title">{{
                      errors.title[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Notification Message</label>
                    <textarea
                      class="form-control"
                      placeholder="Enter notification message"
                      v-model="form.body"
                      rows="3"
                    ></textarea>
                    <span class="help-block" v-if="errors.body">{{
                      errors.body[0]
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Send To</label>
                    <select class="form-control" v-model="form.type">
                      <option value="">Select Target Audience</option>
                      <option value="all">All (Users & Distributors)</option>
                      <option value="users">Users Only</option>
                      <option value="distributors">Distributors Only</option>
                    </select>
                    <span class="help-block" v-if="errors.type">{{
                      errors.type[0]
                    }}</span>
                  </div>
                  <div class="form-footer">
                    <button
                      class="btn btn-primary btn-block"
                      @click="store"
                      :disabled="loading || !form.type"
                    >
                      {{ loading ? "Sending..." : "Send Notification" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- /.card -->
            </div>
            <!--/.col (left) -->
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
  name: "CreateNotification",
  components: {
    BackButton,
  },
  data: () => ({
    form: {
      title: "",
      body: "",
      type: "",
    },
    errors: {},
    loading: false,
  }),
  mounted() {},

  methods: {
    async store() {
      // Validate form
      this.errors = {};
      if (!this.form.title) {
        this.errors.title = ["Title is required"];
        return;
      }
      if (!this.form.body) {
        this.errors.body = ["Message is required"];
        return;
      }
      if (!this.form.type) {
        this.errors.type = ["Please select target audience"];
        return;
      }

      if (
        await this.$root.confirm(
          "Please recheck. Notifications once sent can't be undone. Send to " +
            this.getTargetLabel() +
            "?"
        )
      ) {
        this.loading = true;
        try {
          await this.$axios.post(`/notifications/send`, this.form);
          this.$router.push(`/notifications`);
        } catch (e) {
          console.error("Notification error:", e);
          if (e.response && e.response.data && e.response.data.errors) {
            this.errors = e.response.data.errors;
          } else if (e.response && e.response.data && e.response.data.message) {
            alert(e.response.data.message);
          } else {
            alert("Failed to send notification. Please try again.");
          }
        } finally {
          this.loading = false;
        }
      }
    },
    getTargetLabel() {
      const labels = {
        all: "All Users & Distributors",
        users: "Users Only",
        distributors: "Distributors Only",
      };
      return labels[this.form.type] || "selected users";
    },
  },
};
</script>
