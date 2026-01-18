<template>
  <div
    class="modal fade"
    id="globalConfirmModal"
    tabindex="-1"
    role="dialog"
    data-backdrop="static"
    data-keyboard="false"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button
            v-if="showCancelButton"
            type="button"
            class="btn btn-secondary"
            @click="cancel"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Confirm",
      message: "Are you sure?",
      showCancelButton: true,
      resolve: null,
      reject: null,
    };
  },
  methods: {
    show(options = {}) {
      this.title = options.title || "Confirm";
      this.message = options.message || "Are you sure?";
      this.showCancelButton = options.showCancelButton !== false;

      const $ =
        window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#globalConfirmModal").modal("show");
      } else {
        console.error(
          "jQuery not found. Modal cannot be shown. Please ensure jQuery is loaded."
        );
        // Fallback or just return (promise hangs, but at least we log error)
        // If we want to fallback to native confirm?
        // if (confirm(this.message)) return Promise.resolve(true); else return Promise.resolve(false);
      }

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      const $ =
        window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#globalConfirmModal").modal("hide");
      }
      if (this.resolve) {
        this.resolve(true);
      }
    },
    cancel() {
      const $ =
        window.jQuery || window.$ || (typeof $ !== "undefined" ? $ : null);
      if ($) {
        $("#globalConfirmModal").modal("hide");
      }
      if (this.resolve) {
        this.resolve(false);
      }
    },
  },
};
</script>
