<template>
  <button @click="goBack" class="btn btn-secondary btn-sm" :style="buttonStyle">
    <i class="fas fa-arrow-left"></i> Back
  </button>
</template>

<script>
export default {
  name: "BackButton",
  props: {
    customRoute: {
      type: String,
      default: null,
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    buttonStyle() {
      return {
        marginRight: "10px",
        ...this.customStyle,
      };
    },
  },
  methods: {
    goBack() {
      if (this.customRoute) {
        // If a custom route is provided, navigate to it
        this.$router.push(this.customRoute);
      } else if (window.history.length > 1) {
        // Use browser's back functionality
        this.$router.back();
      } else {
        // Fallback to home page
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
  color: white;
}
</style>
