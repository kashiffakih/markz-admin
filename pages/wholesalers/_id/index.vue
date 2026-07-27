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
              <h1 class="m-0 text-dark">Wholesaler Details</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item">
                  <nuxt-link to="/wholesalers">Wholesalers</nuxt-link>
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

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div v-if="loading" class="text-center py-5">
            <p>Loading...</p>
          </div>

          <div v-else-if="wholesaler">
            <!-- Status and Actions Card -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">Status & Actions</h3>
              </div>
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-md-6">
                    <h4>
                      Current Status:
                      <span
                        v-if="wholesaler.is_blocked"
                        class="badge badge-danger"
                        >Blocked</span
                      >
                      <span
                        v-else-if="wholesaler.is_rejected"
                        class="badge badge-danger"
                        >Rejected</span
                      >
                      <span
                        v-else-if="wholesaler.is_approved"
                        class="badge badge-success"
                        >Approved</span
                      >
                      <span v-else class="badge badge-warning"
                        >Pending Approval</span
                      >
                    </h4>
                    <p
                      v-if="wholesaler.is_blocked && wholesaler.blocked_reason"
                      class="text-danger mt-2"
                    >
                      Blocked Reason: {{ wholesaler.blocked_reason }}
                    </p>
                    <p
                      v-if="
                        wholesaler.is_rejected && wholesaler.rejection_reason
                      "
                      class="text-danger mt-2"
                    >
                      Rejection Reason: {{ wholesaler.rejection_reason }}
                    </p>
                  </div>
                  <div class="col-md-6 text-right">
                    <button
                      v-if="!wholesaler.is_approved && !wholesaler.is_rejected"
                      class="btn btn-outline-danger"
                      @click="reject"
                    >
                      <i class="fa fa-times"></i> Reject Wholesaler
                    </button>
                    &nbsp;
                    <button
                      v-if="!wholesaler.is_approved"
                      class="btn btn-success"
                      @click="approve"
                    >
                      <i class="fa fa-check"></i> Approve Wholesaler
                    </button>
                    &nbsp;
                    <button
                      v-if="!wholesaler.is_blocked"
                      class="btn btn-danger"
                      @click="block"
                    >
                      <i class="fa fa-ban"></i> Block Wholesaler
                    </button>
                    <button v-else class="btn btn-warning" @click="unblock">
                      <i class="fa fa-unlock"></i> Unblock Wholesaler
                    </button>
                    &nbsp;
                    <button class="btn btn-outline-danger" @click="del">
                      <i class="fa fa-trash"></i> Delete Wholesaler
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <!-- Business Information -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-primary">
                    <h3 class="card-title text-white">Business Information</h3>
                  </div>
                  <div class="card-body">
                    <table class="table table-bordered">
                      <tr>
                        <th width="40%">Business Name</th>
                        <td>{{ wholesaler.business_name || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Trade Name</th>
                        <td>{{ wholesaler.trade_name || "-" }}</td>
                      </tr>
                      <tr>
                        <th>GST Number</th>
                        <td>{{ wholesaler.gst_number || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Business Address</th>
                        <td>{{ wholesaler.address || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Pincode</th>
                        <td>{{ wholesaler.pincode_business || "-" }}</td>
                      </tr>
                      <tr>
                        <th>State</th>
                        <td>{{ wholesaler.state_business || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Registration Date</th>
                        <td>{{ wholesaler.registration_date || "-" }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-info">
                    <h3 class="card-title text-white">Personal Information</h3>
                  </div>
                  <div class="card-body">
                    <table class="table table-bordered">
                      <tr>
                        <th width="40%">Name</th>
                        <td>
                          {{ wholesaler.first_name || "" }}
                          {{ wholesaler.last_name || "" }}
                        </td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{{ wholesaler.email || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{{ wholesaler.phone || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Account Created</th>
                        <td>{{ formatDate(wholesaler.created_at) }}</td>
                      </tr>
                      <tr>
                        <th>Referral Code</th>
                        <td>{{ wholesaler.referral_code || "-" }}</td>
                      </tr>
                      <tr>
                        <th>Referred By</th>
                        <td>{{ wholesaler.refered_by_id || "-" }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documents Section -->
            <div class="card mt-4">
              <div class="card-header bg-secondary">
                <h3 class="card-title text-white">Uploaded Documents</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <!-- Visiting Card -->
                  <div class="col-md-6">
                    <h5>Visiting Card</h5>
                    <div
                      v-if="wholesaler.visiting_card_path"
                      class="document-preview"
                    >
                      <img
                        :src="mediaUrl + wholesaler.visiting_card_path"
                        alt="Visiting Card"
                        class="img-fluid img-thumbnail"
                        style="max-height: 300px; cursor: pointer"
                        @click="
                          openImageModal(
                            mediaUrl + wholesaler.visiting_card_path,
                            'Visiting Card'
                          )
                        "
                      />
                      <br />
                      <a
                        :href="mediaUrl + wholesaler.visiting_card_path"
                        target="_blank"
                        class="btn btn-sm btn-outline-primary mt-2"
                      >
                        <i class="fa fa-external-link-alt"></i> Open in New Tab
                      </a>
                    </div>
                    <div v-else class="text-muted">
                      <i class="fa fa-image fa-3x"></i>
                      <p>No visiting card uploaded</p>
                    </div>
                  </div>

                  <!-- Shop Image -->
                  <div class="col-md-6">
                    <h5>Shop Image</h5>
                    <div
                      v-if="wholesaler.shop_image_path"
                      class="document-preview"
                    >
                      <img
                        :src="mediaUrl + wholesaler.shop_image_path"
                        alt="Shop Image"
                        class="img-fluid img-thumbnail"
                        style="max-height: 300px; cursor: pointer"
                        @click="
                          openImageModal(
                            mediaUrl + wholesaler.shop_image_path,
                            'Shop Image'
                          )
                        "
                      />
                      <br />
                      <a
                        :href="mediaUrl + wholesaler.shop_image_path"
                        target="_blank"
                        class="btn btn-sm btn-outline-primary mt-2"
                      >
                        <i class="fa fa-external-link-alt"></i> Open in New Tab
                      </a>
                    </div>
                    <div v-else class="text-muted">
                      <i class="fa fa-image fa-3x"></i>
                      <p>No shop image uploaded</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="alert alert-danger">Wholesaler not found.</div>
        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!-- Image Modal -->
    <div
      class="modal fade"
      id="imageModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="imageModalLabel"
      aria-hidden="true"
      ref="imageModal"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="imageModalLabel">{{ modalTitle }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center">
            <img :src="modalImage" alt="Preview" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>

    <!-- Reason Modal -->
    <div
      class="modal fade"
      id="reasonModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="reasonModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reasonModalLabel">
              {{
                reasonAction === "block"
                  ? "Block Wholesaler"
                  : "Reject Wholesaler"
              }}
            </h5>
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
              <label>
                {{
                  reasonAction === "block"
                    ? "Reason for Blocking"
                    : "Reason for Rejection"
                }}
              </label>
              <textarea
                v-model="reasonText"
                class="form-control"
                rows="3"
                placeholder="Enter reason here..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="confirmReasonAction"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";

export default {
  name: "WholesalerDetails",
  components: {
    BackButton,
  },
  data: () => ({
    wholesaler: null,
    loading: true,
    modalImage: "",
    modalTitle: "",
    reasonText: "",
    reasonAction: "", // 'block' or 'reject'
  }),
  mounted() {
    this.getData();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    async getData() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        let response = await this.$axios.get(`/users/${id}`);
        this.wholesaler = response.data.data;
      } catch (error) {
        console.error("Error fetching wholesaler:", error);
        this.wholesaler = null;
      }
      this.loading = false;
    },
    async approve() {
      console.log("Approve clicked for", this.wholesaler.id);
      try {
        const confirmed = await this.$root.confirm(
          "Are you sure you want to approve this wholesaler?"
        );
        console.log("Confirmation result:", confirmed);

        if (confirmed) {
          console.log("Sending approval request...");
          await this.$axios.post(`/users/${this.wholesaler.id}/approve`);
          console.log("Approval successful");
          this.getData();
        }
      } catch (error) {
        console.error("Approval error:", error);
        const msg =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Failed to approve wholesaler";
        await this.$root.alert(msg);
      }
    },
    async block() {
      this.reasonAction = "block";
      this.reasonText = "";
      if (typeof $ !== "undefined") {
        $("#reasonModal").modal("show");
      }
    },
    async reject() {
      this.reasonAction = "reject";
      this.reasonText = "";
      if (typeof $ !== "undefined") {
        $("#reasonModal").modal("show");
      }
    },
    async confirmReasonAction() {
      if (!this.reasonText) {
        await this.$root.alert("Please enter a reason.");
        return;
      }

      if (typeof $ !== "undefined") {
        $("#reasonModal").modal("hide");
      }

      try {
        if (this.reasonAction === "block") {
          await this.$axios.post(`/users/${this.wholesaler.id}/block`, {
            blocked_reason: this.reasonText,
          });
        } else if (this.reasonAction === "reject") {
          await this.$axios.post(`/users/${this.wholesaler.id}/reject`, {
            rejection_reason: this.reasonText,
          });
        }
        this.getData();
      } catch (error) {
        await this.$root.alert(`Failed to ${this.reasonAction} wholesaler`);
      }
    },
    async unblock() {
      if (
        await this.$root.confirm(
          "Are you sure you want to unblock this wholesaler?"
        )
      ) {
        try {
          await this.$axios.post(`/users/${this.wholesaler.id}/unblock`);
          this.getData();
        } catch (error) {
          await this.$root.alert("Failed to unblock wholesaler");
        }
      }
    },
    openImageModal(imageSrc, title) {
      this.modalImage = imageSrc;
      this.modalTitle = title;
      // Using Bootstrap's modal via jQuery (if available)
      if (typeof $ !== "undefined") {
        $("#imageModal").modal("show");
      }
    },
    async del() {
      if (
        await this.$root.confirm(
          "Are you sure you want to delete this wholesaler?"
        )
      ) {
        try {
          await this.$axios.delete(`/users/${this.$route.params.id}`);
          this.$router.push("/wholesalers");
        } catch (error) {
          console.error("Delete wholesaler error:", error);
          await this.$root.alert("Failed to delete wholesaler.");
        }
      }
    },
  },
};
</script>

<style scoped>
.document-preview {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.text-muted {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
}

.table th {
  background-color: #f4f6f9;
}
</style>
