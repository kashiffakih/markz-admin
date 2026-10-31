<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Home Banners</h2>
              <p>Website aur app ke home page par sabse upar dikhne wale bade banners. Koi banner active na ho to Markz ka default hero dikhta hai.</p>
            </div>
            <button class="btn btn-primary" v-if="!formOpen" @click="openNew"><i class="fas fa-plus mr-1"></i> Add banner</button>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div v-if="!isSuper" class="alert alert-warning">Sirf Super Admin banners manage kar sakta hai.</div>

          <!-- ================= add / edit form ================= -->
          <div class="card pn-review" v-if="isSuper && formOpen">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3 class="card-title">{{ editingId ? "Edit banner" : "New banner" }}</h3>
              <button class="btn btn-sm btn-default" @click="closeForm">Close</button>
            </div>
            <div class="card-body">
              <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
              <div class="row">
                <div class="col-lg-5 mb-3">
                  <label>Banner image {{ editingId ? "(naya chunoge to purana badal jayega)" : "*" }}</label>
                  <div class="bn-drop" @click="$refs.file.click()">
                    <img v-if="previewUrl" :src="previewUrl" alt="preview" />
                    <div v-else class="text-muted"><i class="fas fa-image fa-2x d-block mb-2"></i>Image chunne ke liye click karo</div>
                  </div>
                  <input ref="file" type="file" accept="image/png,image/jpeg,image/webp" class="d-none" @change="onFile" />
                  <small class="text-muted">Best size: <b>1600 x 720 px</b> (20:9). JPG / PNG / WebP, 4 MB tak. Text banner ke beech me rakho, kinaare mobile par kat sakte hain.</small>
                </div>
                <div class="col-lg-7">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label>Title <span class="text-muted">(sirf aapke liye)</span></label>
                      <input class="form-control" v-model.trim="form.title" maxlength="120" placeholder="e.g. Diwali Sale" />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label>Click par kahan jaye?</label>
                      <select class="form-control custom-select" v-model="form.link_type" @change="form.link_value = ''">
                        <option value="none">Kahin nahi (sirf image)</option>
                        <option value="category">Ek category</option>
                        <option value="seller">Ek seller ki dukaan</option>
                        <option value="product">Ek product</option>
                        <option value="url">Koi link (URL)</option>
                      </select>
                    </div>
                  </div>
                  <div class="mb-3" v-if="form.link_type === 'category'">
                    <label>Category</label>
                    <select class="form-control custom-select" v-model="form.link_value">
                      <option value="">Chuno...</option>
                      <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
                    </select>
                  </div>
                  <div class="mb-3" v-if="form.link_type === 'seller'">
                    <label>Seller</label>
                    <select class="form-control custom-select" v-model="form.link_value">
                      <option value="">Chuno...</option>
                      <option v-for="s in sellers" :key="s.id" :value="String(s.id)">{{ s.name }}</option>
                    </select>
                  </div>
                  <div class="mb-3" v-if="form.link_type === 'product'">
                    <label>Product ID</label>
                    <input class="form-control" type="number" min="1" v-model="form.link_value" placeholder="e.g. 12" />
                  </div>
                  <div class="mb-3" v-if="form.link_type === 'url'">
                    <label>Link</label>
                    <input class="form-control" v-model.trim="form.link_value" placeholder="https://...  ya  /shop?search=kurta" />
                  </div>
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label>Order (chhota pehle)</label>
                      <input class="form-control" type="number" min="0" v-model="form.position" />
                    </div>
                    <div class="col-md-4 mb-3">
                      <label>Kab se <span class="text-muted">(optional)</span></label>
                      <input class="form-control" type="datetime-local" v-model="form.starts_at" />
                    </div>
                    <div class="col-md-4 mb-3">
                      <label>Kab tak <span class="text-muted">(optional)</span></label>
                      <input class="form-control" type="datetime-local" v-model="form.ends_at" />
                    </div>
                  </div>
                  <div class="custom-control custom-switch mb-3">
                    <input type="checkbox" class="custom-control-input" id="bn-active" v-model="form.is_active" />
                    <label class="custom-control-label" for="bn-active">Active (home page par dikhao)</label>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary mr-2" :disabled="saving" @click="save">
                <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-check'"></i> {{ editingId ? "Save changes" : "Upload banner" }}
              </button>
              <button class="btn btn-default" @click="closeForm">Cancel</button>
            </div>
          </div>

          <!-- ================= list ================= -->
          <div class="card" v-if="isSuper">
            <div class="card-header"><h3 class="card-title">All banners ({{ banners.length }})</h3></div>
            <div class="card-body p-0 table-responsive">
              <table class="table">
                <thead><tr><th style="width:70px">Order</th><th>Banner</th><th>Click par</th><th>Status</th><th class="text-right">Actions</th></tr></thead>
                <tbody>
                  <tr v-for="(b, i) in banners" :key="b.id">
                    <td>
                      <button class="btn btn-sm btn-default" :disabled="i === 0" @click="move(i, -1)" title="Upar"><i class="fas fa-arrow-up"></i></button>
                      <button class="btn btn-sm btn-default" :disabled="i === banners.length - 1" @click="move(i, 1)" title="Neeche"><i class="fas fa-arrow-down"></i></button>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <img :src="mediaUrl + b.image_path" class="bn-thumb" alt="" />
                        <div class="ml-3"><strong>{{ b.title || "(no title)" }}</strong><div class="text-muted" style="font-size:12px">#{{ b.id }}</div></div>
                      </div>
                    </td>
                    <td>{{ linkText(b) }}</td>
                    <td><span class="pn-pill" :class="'pn-pill--' + state(b).cls">{{ state(b).text }}</span></td>
                    <td class="text-right">
                      <button class="btn btn-sm btn-outline-primary mr-1" @click="toggle(b)">{{ b.is_active ? "Hide" : "Show" }}</button>
                      <button class="btn btn-sm btn-primary mr-1" @click="openEdit(b)">Edit</button>
                      <button class="btn btn-sm btn-outline-danger" @click="remove(b)"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr v-if="!banners.length && !loading">
                    <td colspan="5"><div class="pn-empty"><i class="fas fa-images"></i>Abhi koi banner nahi. "Add banner" se pehla banner daalo.</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
function emptyForm() {
  return { title: "", link_type: "none", link_value: "", position: "", starts_at: "", ends_at: "", is_active: true };
}
// "2026-10-29 14:30:00" <-> "2026-10-29T14:30" (datetime-local)
const toLocal = (v) => (v ? String(v).replace(" ", "T").slice(0, 16) : "");
const toApi = (v) => (v ? String(v).replace("T", " ") + ":00" : "");

export default {
  name: "HomeBanners",
  data() {
    return {
      banners: [],
      categories: [],
      sellers: [],
      loading: false,
      saving: false,
      formOpen: false,
      editingId: null,
      form: emptyForm(),
      file: null,
      previewUrl: "",
      formError: "",
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
    this.$axios.get("categories").then((r) => (this.categories = r.data.data || [])).catch(() => {});
    this.$axios.get("companies", { params: { rowsPerPage: 200 } }).then((r) => (this.sellers = r.data.data || [])).catch(() => {});
  },
  methods: {
    msg(e, fb) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fb;
    },
    async load() {
      this.loading = true;
      try {
        const r = await this.$axios.get("home_banners");
        this.banners = r.data.data || [];
      } catch (e) {
        this.banners = [];
      } finally {
        this.loading = false;
      }
    },
    state(b) {
      const now = Date.now();
      const t = (v) => new Date(String(v).replace(" ", "T")).getTime();
      if (!b.is_active) return { text: "Hidden", cls: "rejected" };
      if (b.starts_at && t(b.starts_at) > now) return { text: "Scheduled", cls: "pending" };
      if (b.ends_at && t(b.ends_at) < now) return { text: "Expired", cls: "rejected" };
      return { text: "Live", cls: "approved" };
    },
    linkText(b) {
      if (b.link_type === "category") {
        const c = this.categories.find((x) => String(x.id) === String(b.link_value));
        return "Category: " + (c ? c.name : "#" + b.link_value);
      }
      if (b.link_type === "seller") {
        const s = this.sellers.find((x) => String(x.id) === String(b.link_value));
        return "Seller: " + (s ? s.name : "#" + b.link_value);
      }
      if (b.link_type === "product") return "Product #" + b.link_value;
      if (b.link_type === "url") return b.link_value;
      return "-";
    },
    openNew() {
      this.editingId = null;
      this.form = emptyForm();
      this.form.position = this.banners.length + 1;
      this.file = null;
      this.previewUrl = "";
      this.formError = "";
      this.formOpen = true;
    },
    openEdit(b) {
      this.editingId = b.id;
      this.form = {
        title: b.title || "",
        link_type: b.link_type || "none",
        link_value: b.link_value ? String(b.link_value) : "",
        position: b.position,
        starts_at: toLocal(b.starts_at),
        ends_at: toLocal(b.ends_at),
        is_active: !!b.is_active,
      };
      this.file = null;
      this.previewUrl = this.mediaUrl + b.image_path;
      this.formError = "";
      this.formOpen = true;
      if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    closeForm() {
      this.formOpen = false;
      this.editingId = null;
    },
    onFile(e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      if (f.size > 4 * 1024 * 1024) {
        this.formError = "Image 4 MB se badi hai. Chhoti image chuno.";
        return;
      }
      this.formError = "";
      this.file = f;
      this.previewUrl = URL.createObjectURL(f);
    },
    async save() {
      this.formError = "";
      if (!this.editingId && !this.file) {
        this.formError = "Pehle banner ki image chuno.";
        return;
      }
      const fd = new FormData();
      if (this.file) fd.append("image", this.file);
      fd.append("title", this.form.title || "");
      fd.append("link_type", this.form.link_type);
      fd.append("link_value", this.form.link_type === "none" ? "" : this.form.link_value || "");
      if (this.form.position !== "" && this.form.position !== null) fd.append("position", this.form.position);
      fd.append("starts_at", toApi(this.form.starts_at));
      fd.append("ends_at", toApi(this.form.ends_at));
      fd.append("is_active", this.form.is_active ? "1" : "0");
      this.saving = true;
      try {
        const url = this.editingId ? `home_banners/${this.editingId}` : "home_banners";
        await this.$axios.post(url, fd, { headers: { "Content-Type": "multipart/form-data" } });
        this.closeForm();
        await this.load();
      } catch (e) {
        this.formError = this.msg(e, "Save nahi ho saka.");
      } finally {
        this.saving = false;
      }
    },
    async toggle(b) {
      const fd = new FormData();
      fd.append("is_active", b.is_active ? "0" : "1");
      try {
        await this.$axios.post(`home_banners/${b.id}`, fd);
        this.load();
      } catch (e) {
        this.$root.alert(this.msg(e, "Badal nahi saka."));
      }
    },
    async move(i, dir) {
      const arr = this.banners.slice();
      const j = i + dir;
      if (j < 0 || j >= arr.length) return;
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
      this.banners = arr;
      try {
        await this.$axios.post("home_banners/reorder", { ids: arr.map((x) => x.id) });
      } catch (e) {
        this.load();
      }
    },
    async remove(b) {
      const ok = await this.$root.confirm(`"${b.title || "Banner #" + b.id}" delete kar dein?`, "Delete banner");
      if (!ok) return;
      try {
        await this.$axios.delete(`home_banners/${b.id}`);
        this.load();
      } catch (e) {
        this.$root.alert(this.msg(e, "Delete nahi ho saka."));
      }
    },
  },
};
</script>

<style scoped>
.bn-drop {
  border: 2px dashed #c9d6cf; border-radius: 14px; background: #fafcfb; min-height: 150px; display: flex; align-items: center; justify-content: center;
  text-align: center; cursor: pointer; overflow: hidden; margin-bottom: 6px;
}
.bn-drop:hover { border-color: #0b5d3b; }
.bn-drop img { width: 100%; display: block; }
.bn-thumb { width: 160px; height: 72px; object-fit: cover; border-radius: 10px; border: 1px solid #e4ebe7; background: #f3f6f4; }
</style>
