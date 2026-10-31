<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>{{ isSuper ? "Category Requests" : "Request a New Category" }}</h2>
              <p v-if="isSuper">Sellers ko jo category list me nahi mili, unki requests. Approve karne par category sab sellers ke liye ban jaati hai.</p>
              <p v-else>Aapke product ki category list me nahi hai? Yahan request bhejiye. Admin approve karega to wo category sabhi ko dikhegi.</p>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- ===== seller: new request form ===== -->
          <div class="card" v-if="!isSuper">
            <div class="card-header"><h3 class="card-title">New request</h3></div>
            <div class="card-body">
              <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
              <div v-if="formOk" class="alert alert-success">{{ formOk }}</div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label>Category name *</label>
                  <input class="form-control" v-model.trim="form.name" maxlength="120" placeholder="e.g. Kurta Sets" />
                </div>
                <div class="col-md-4 mb-3">
                  <label>Inside which category? <span class="text-muted">(optional)</span></label>
                  <select class="form-control custom-select" v-model="form.parent_category_id">
                    <option value="">Main category (top level)</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">Sub-category of: {{ c.name }}</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label>Note for admin <span class="text-muted">(optional)</span></label>
                  <input class="form-control" v-model.trim="form.note" maxlength="500" placeholder="Kis tarah ke products aayenge" />
                </div>
              </div>
              <button class="btn btn-primary" :disabled="saving || !form.name" @click="submit">
                <i class="fas fa-paper-plane mr-1"></i> Send request
              </button>
              <span class="text-muted ml-2" style="font-size:12.5px">Pehle dekh lijiye ki category already list me to nahi hai ({{ categories.length }} categories available).</span>
            </div>
          </div>

          <!-- ===== admin: review panel ===== -->
          <div class="card pn-review" v-if="isSuper && reviewing">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3 class="card-title">Review: {{ reviewing.name }}</h3>
              <button class="btn btn-sm btn-default" @click="reviewing = null">Close</button>
            </div>
            <div class="card-body">
              <p class="mb-2">
                <b>{{ reviewing.company ? reviewing.company.name : "Seller" }}</b> ne maanga hai:
                <span v-if="reviewing.parent_category">sub-category inside <b>{{ reviewing.parent_category.name }}</b></span>
                <span v-else>naya <b>main category</b></span>
              </p>
              <p v-if="reviewing.note" class="text-muted">Note: {{ reviewing.note }}</p>
              <div v-if="actionError" class="alert alert-danger">{{ actionError }}</div>
              <div class="row">
                <div class="col-md-5 mb-3">
                  <label>Final name (spelling theek kar sakte ho)</label>
                  <input class="form-control" v-model.trim="decision.name" />
                </div>
                <div class="col-md-7 mb-3">
                  <label>Message to seller <span class="text-muted">(reject karne par zaroori)</span></label>
                  <input class="form-control" v-model.trim="decision.admin_note" placeholder="Reason / instruction" />
                </div>
              </div>
              <button class="btn btn-success mr-2" :disabled="saving" @click="approve"><i class="fas fa-check mr-1"></i> Approve &amp; create</button>
              <button class="btn btn-outline-danger" :disabled="saving" @click="reject"><i class="fas fa-times mr-1"></i> Reject</button>
            </div>
          </div>

          <!-- ===== list ===== -->
          <div class="card">
            <div class="card-header d-flex flex-wrap align-items-center justify-content-between" style="gap:10px">
              <div class="pn-seg">
                <button v-for="s in tabs" :key="s.v" :class="{ on: status === s.v }" @click="setStatus(s.v)">
                  {{ s.t }}<span v-if="s.v && counts[s.v]"> ({{ counts[s.v] }})</span>
                </button>
              </div>
            </div>
            <div class="card-body p-0 table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th><th>Requested name</th><th>Where</th><th v-if="isSuper">Seller</th><th>Status</th><th>Admin message</th><th>Date</th><th v-if="isSuper"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in rows" :key="r.id">
                    <td>{{ r.id }}</td>
                    <td><strong>{{ r.name }}</strong><div class="text-muted" style="font-size:12px" v-if="r.note">{{ r.note }}</div></td>
                    <td>{{ r.parent_category ? "Sub of " + r.parent_category.name : "Main category" }}</td>
                    <td v-if="isSuper">{{ r.company ? r.company.name : "-" }}</td>
                    <td><span class="pn-pill" :class="'pn-pill--' + r.status">{{ r.status }}</span></td>
                    <td style="white-space:normal;max-width:260px">{{ r.admin_note || "-" }}</td>
                    <td>{{ fmt(r.created_at) }}</td>
                    <td v-if="isSuper">
                      <button v-if="r.status === 'pending'" class="btn btn-sm btn-primary" @click="openReview(r)">Review</button>
                    </td>
                  </tr>
                  <tr v-if="!rows.length && !loading">
                    <td :colspan="isSuper ? 8 : 6"><div class="pn-empty"><i class="fas fa-lightbulb"></i>Koi request nahi</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center" v-if="lastPage > 1">
              <button class="btn btn-sm btn-default" :disabled="page <= 1" @click="go(page - 1)">Prev</button>
              <span class="text-muted">Page {{ page }} / {{ lastPage }}</span>
              <button class="btn btn-sm btn-default" :disabled="page >= lastPage" @click="go(page + 1)">Next</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import moment from "moment";

export default {
  name: "CategoryRequests",
  data() {
    return {
      rows: [],
      counts: {},
      categories: [],
      status: "",
      page: 1,
      lastPage: 1,
      loading: false,
      saving: false,
      form: { name: "", parent_category_id: "", note: "" },
      formError: "",
      formOk: "",
      reviewing: null,
      decision: { name: "", admin_note: "" },
      actionError: "",
      tabs: [
        { v: "", t: "All" },
        { v: "pending", t: "Pending" },
        { v: "approved", t: "Approved" },
        { v: "rejected", t: "Rejected" },
      ],
    };
  },
  computed: {
    isSuper() {
      const u = this.$auth.user;
      return !!(u && u.roles && u.roles.some((r) => r.id === 1));
    },
  },
  mounted() {
    this.load();
    this.loadCategories();
  },
  methods: {
    fmt(d) {
      return d ? moment(d).format("DD MMM YYYY") : "";
    },
    msg(e, fallback) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fallback;
    },
    async loadCategories() {
      try {
        const r = await this.$axios.get("categories");
        this.categories = r.data.data || [];
      } catch (e) {}
    },
    async load() {
      this.loading = true;
      try {
        const r = await this.$axios.get("category_requests", { params: { status: this.status, page: this.page, rowsPerPage: 15 } });
        this.rows = r.data.data || [];
        this.counts = r.data.status_counts || {};
        this.lastPage = r.data.last_page || 1;
      } catch (e) {
        this.rows = [];
      } finally {
        this.loading = false;
      }
    },
    setStatus(v) {
      this.status = v;
      this.page = 1;
      this.load();
    },
    go(p) {
      this.page = p;
      this.load();
    },
    async submit() {
      this.formError = "";
      this.formOk = "";
      this.saving = true;
      try {
        await this.$axios.post("category_requests", {
          name: this.form.name,
          parent_category_id: this.form.parent_category_id || null,
          note: this.form.note || null,
        });
        this.formOk = "Request bhej di gayi. Approval ke baad category list me aa jayegi.";
        this.form = { name: "", parent_category_id: "", note: "" };
        this.page = 1;
        this.load();
      } catch (e) {
        this.formError = this.msg(e, "Request nahi ja saki.");
      } finally {
        this.saving = false;
      }
    },
    openReview(r) {
      this.reviewing = r;
      this.decision = { name: r.name, admin_note: "" };
      this.actionError = "";
      if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async approve() {
      this.saving = true;
      this.actionError = "";
      try {
        await this.$axios.post(`category_requests/${this.reviewing.id}/approve`, { name: this.decision.name, admin_note: this.decision.admin_note || null });
        this.reviewing = null;
        this.load();
        this.loadCategories();
      } catch (e) {
        this.actionError = this.msg(e, "Approve nahi ho saka.");
      } finally {
        this.saving = false;
      }
    },
    async reject() {
      if (!this.decision.admin_note) {
        this.actionError = "Reject karne ke liye seller ko message likhna zaroori hai.";
        return;
      }
      this.saving = true;
      this.actionError = "";
      try {
        await this.$axios.post(`category_requests/${this.reviewing.id}/reject`, { admin_note: this.decision.admin_note });
        this.reviewing = null;
        this.load();
      } catch (e) {
        this.actionError = this.msg(e, "Reject nahi ho saka.");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
