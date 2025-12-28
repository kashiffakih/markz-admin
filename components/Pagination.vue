<template>
  <div class="pagination-wrapper">
    <div class="pagination-info">
      Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
    </div>
    <div class="pagination-controls">
      <div class="per-page-select">
        <select
          v-model="perPageValue"
          @change="onPerPageChange"
          class="form-control form-control-sm"
        >
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
          >
            {{ option }} per page
          </option>
        </select>
      </div>
      <ul class="pagination mb-0">
        <!-- First -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(1)">«</a>
        </li>
        <!-- Previous -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPage(currentPage - 1)"
            >‹</a
          >
        </li>
        <!-- Page Numbers -->
        <li
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{
            page
          }}</a>
        </li>
        <!-- Next -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPage(currentPage + 1)"
            >›</a
          >
        </li>
        <!-- Last -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(totalPages)"
            >»</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPageOptions: {
      type: Array,
      default: () => [10, 25, 50, 100],
    },
  },
  data() {
    return {
      perPageValue: this.perPage,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPageValue) || 1;
    },
    startIndex() {
      return (this.currentPage - 1) * this.perPageValue;
    },
    endIndex() {
      return Math.min(this.startIndex + this.perPageValue, this.totalItems);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    perPage(newVal) {
      this.perPageValue = newVal;
    },
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit("page-changed", page);
      }
    },
    onPerPageChange() {
      this.$emit("per-page-changed", this.perPageValue);
      this.$emit("page-changed", 1);
    },
  },
};
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(248, 250, 252, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.per-page-select select {
  min-width: 130px;
  height: 38px;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.4;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  cursor: pointer;
}

.pagination {
  margin: 0;
  gap: 4px;
}
</style>
