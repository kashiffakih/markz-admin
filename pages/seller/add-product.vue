<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Add product</h2>
              <p>Ek hi page par photo, details, price aur stock bharo. Seller ke product Markz team review karti hai, approve hote hi store par dikhta hai.</p>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <!-- ===== success ===== -->
          <div v-if="done" class="card">
            <div class="card-body text-center py-5">
              <i class="fas fa-check-circle" style="font-size:54px;color:#12794a"></i>
              <h3 class="mt-3">{{ done.message }}</h3>
              <p class="text-muted mb-4">Product ID #{{ done.data.id }} &middot; Status: <b>{{ done.data.approval_status === "approved" ? "Live" : "Review pending" }}</b></p>
              <button class="btn btn-primary mr-2" @click="reset"><i class="fas fa-plus mr-1"></i> Ek aur product daalo</button>
              <nuxt-link v-if="productsLink" :to="productsLink" class="btn btn-default">My products dekho</nuxt-link>
            </div>
          </div>

          <div v-else class="row">
            <div class="col-xl-8">
              <div v-if="error" class="alert alert-danger"><i class="fas fa-exclamation-circle mr-1"></i> {{ error }}</div>

              <!-- ===== photos ===== -->
              <div class="card">
                <div class="card-header"><h3 class="card-title">1. Photos <span class="text-muted">(kam se kam 1, max {{ maxImages }})</span></h3></div>
                <div class="card-body">
                  <div class="ap-photos">
                    <div v-for="(im, i) in images" :key="im.url" class="ap-ph">
                      <img :src="im.url" alt="" />
                      <span v-if="i === 0" class="ap-cover">Cover</span>
                      <div class="ap-ph-actions">
                        <button type="button" v-if="i > 0" title="Cover banao" @click="makeCover(i)"><i class="fas fa-star"></i></button>
                        <button type="button" title="Hatao" @click="removeImage(i)"><i class="fas fa-times"></i></button>
                      </div>
                    </div>
                    <label v-if="images.length < maxImages" class="ap-add">
                      <i class="fas fa-camera"></i>
                      <span>Photo daalo</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="pickImages" />
                    </label>
                  </div>
                  <small class="text-muted d-block mt-2">JPG / PNG / WEBP, har photo 4 MB tak. Saaf roshni me, seedhi photo lo. Pehli photo cover banegi.</small>
                </div>
              </div>

              <!-- ===== basics ===== -->
              <div class="card">
                <div class="card-header"><h3 class="card-title">2. Product details</h3></div>
                <div class="card-body">
                  <div class="mb-3">
                    <label>Product ka naam *</label>
                    <input class="form-control" v-model.trim="f.name" maxlength="200" placeholder="jaise: Cotton Straight Kurta - Women" />
                  </div>
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label>Category *</label>
                      <select class="form-control custom-select" v-model="f.category_id" @change="f.sub_category_id = ''; f.sub_2_category_id = ''">
                        <option value="">Chuno</option>
                        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label>Sub category</label>
                      <select class="form-control custom-select" v-model="f.sub_category_id" :disabled="!subs.length" @change="f.sub_2_category_id = ''">
                        <option value="">{{ subs.length ? "Chuno" : "-" }}</option>
                        <option v-for="c in subs" :key="c.id" :value="c.id">{{ c.name }}</option>
                      </select>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label>Sub-sub category</label>
                      <select class="form-control custom-select" v-model="f.sub_2_category_id" :disabled="!subs2.length">
                        <option value="">{{ subs2.length ? "Chuno" : "-" }}</option>
                        <option v-for="c in subs2" :key="c.id" :value="c.id">{{ c.name }}</option>
                      </select>
                    </div>
                  </div>
                  <small class="text-muted d-block mb-3" style="margin-top:-6px">
                    Apni category nahi mili? <nuxt-link to="/seller/category-requests">Nayi category ki request bhejo</nuxt-link>.
                  </small>
                  <div class="mb-3">
                    <label>Chhota description <span class="text-muted">(card par dikhta hai)</span></label>
                    <input class="form-control" v-model.trim="f.small_description" maxlength="300" />
                  </div>
                  <div class="mb-1">
                    <label>Poora description</label>
                    <textarea class="form-control" rows="5" v-model="f.description" maxlength="5000" placeholder="Fabric, fitting, wash care, size info..."></textarea>
                  </div>
                </div>
              </div>

              <!-- ===== price & stock ===== -->
              <div class="card">
                <div class="card-header"><h3 class="card-title">3. Price &amp; stock</h3></div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label>MRP / asli price (&#8377;) *</label>
                      <input class="form-control" type="number" min="1" step="any" v-model="f.price" />
                    </div>
                    <div class="col-md-4 mb-3">
                      <label>Selling / offer price (&#8377;)</label>
                      <input class="form-control" type="number" min="1" step="any" v-model="f.offer_price" placeholder="khali = MRP par bikega" />
                    </div>
                    <div class="col-md-4 mb-3">
                      <label>Stock (kitne piece) *</label>
                      <input class="form-control" type="number" min="0" step="1" v-model="f.qty" />
                    </div>
                  </div>
                  <div v-if="discount > 0" class="alert alert-success py-2 mb-0">Customer ko <b>{{ discount }}% off</b> dikhega.</div>
                </div>
              </div>

              <!-- ===== shipping & other ===== -->
              <div class="card">
                <div class="card-header"><h3 class="card-title">4. Shipping &amp; extra</h3></div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-12 mb-2">
                      <div class="alert alert-light border" style="font-size:13px"><i class="fas fa-info-circle mr-1"></i>Courier parcel ke <b>size aur weight</b> se charge lagata hai, isliye yeh dena zaroori hai. Packing ke saath ka weight likhiye.</div>
                    </div>
                    <div class="col-md-4 mb-3"><label>Packing type</label>
                      <select class="form-control custom-select" v-model="pkg" @change="applyPkg">
                        <option v-for="p in pkgs" :key="p.k" :value="p.k">{{ p.t }}</option>
                      </select>
                    </div>
                    <div class="col-md-2 mb-3"><label>Weight (gram) *</label><input class="form-control" type="number" min="10" step="any" v-model="f.weight" /></div>
                    <div class="col-md-2 mb-3"><label>Length (cm) *</label><input class="form-control" type="number" min="1" step="any" v-model="f.length" @input="pkg = 'custom'" /></div>
                    <div class="col-md-2 mb-3"><label>Breadth (cm) *</label><input class="form-control" type="number" min="1" step="any" v-model="f.breadth" @input="pkg = 'custom'" /></div>
                    <div class="col-md-2 mb-3"><label>Height (cm) *</label><input class="form-control" type="number" min="1" step="any" v-model="f.height" @input="pkg = 'custom'" /></div>
                    <div class="col-12 mb-3" v-if="billable"><small class="text-muted">Courier ke hisaab se billable weight: <b>{{ billable }} g</b> (volumetric {{ volG }} g, asli {{ Number(f.weight) || 0 }} g)</small></div>
                    <div class="col-md-4 mb-3"><label>Return window (din)</label><input class="form-control" type="number" min="0" max="30" v-model="f.return_days" /></div>
                    <div class="col-md-4 mb-3"><label>HSN code</label><input class="form-control" v-model.trim="f.hsn_code" maxlength="20" /></div>
                    <div class="col-md-4 mb-3" v-if="units.length">
                      <label>Unit</label>
                      <select class="form-control custom-select" v-model="f.unit_id"><option value="">-</option><option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option></select>
                    </div>
                  </div>
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="frag" v-model="f.is_fragile" />
                    <label class="custom-control-label" for="frag">Fragile hai (nazuk saamaan)</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- ===== side: preview + submit ===== -->
            <div class="col-xl-4">
              <div class="card ap-sticky">
                <div class="card-header"><h3 class="card-title">Customer ko aisa dikhega</h3></div>
                <div class="card-body">
                  <div class="ap-card">
                    <div class="ap-card-img">
                      <img v-if="images.length" :src="images[0].url" alt="" />
                      <i v-else class="far fa-image"></i>
                    </div>
                    <div class="ap-card-body">
                      <div class="ap-card-name">{{ f.name || "Product ka naam" }}</div>
                      <div>
                        <b style="font-size:17px">{{ sell ? money(sell) : "₹0" }}</b>
                        <span v-if="discount > 0" class="text-muted ml-1"><s>{{ money(f.price) }}</s></span>
                        <span v-if="discount > 0" class="ml-1" style="color:#12794a;font-weight:700">{{ discount }}% off</span>
                      </div>
                      <div class="text-muted" style="font-size:12px">{{ Number(f.qty) > 0 ? "In stock" : "Out of stock" }}</div>
                    </div>
                  </div>

                  <ul class="ap-check mt-3">
                    <li :class="{ ok: images.length }"><i class="fas" :class="images.length ? 'fa-check-circle' : 'fa-circle'"></i> Photo</li>
                    <li :class="{ ok: f.name }"><i class="fas" :class="f.name ? 'fa-check-circle' : 'fa-circle'"></i> Naam</li>
                    <li :class="{ ok: f.category_id }"><i class="fas" :class="f.category_id ? 'fa-check-circle' : 'fa-circle'"></i> Category</li>
                    <li :class="{ ok: Number(f.price) > 0 }"><i class="fas" :class="Number(f.price) > 0 ? 'fa-check-circle' : 'fa-circle'"></i> Price</li>
                    <li :class="{ ok: f.qty !== '' }"><i class="fas" :class="f.qty !== '' ? 'fa-check-circle' : 'fa-circle'"></i> Stock</li>
                  </ul>

                  <button class="btn btn-primary btn-block btn-lg" :disabled="saving" @click="submit">
                    <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                    {{ saving ? "Bhej raha hu..." : isSuper ? "Product publish karo" : "Review ke liye bhejo" }}
                  </button>
                  <small class="text-muted d-block mt-2" v-if="!isSuper">Approve hone me aam taur par kuch ghante lagte hain. Status "My Products" me dikhega.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
function blank() {
  return {
    name: "", category_id: "", sub_category_id: "", sub_2_category_id: "", small_description: "", description: "",
    price: "", offer_price: "", qty: "", unit_id: "", weight: "", length: "", breadth: "", height: "",
    return_days: 7, hsn_code: "", is_fragile: false,
  };
}

export default {
  name: "AddProduct",
  data() {
    return {
      pkg: "custom",
      pkgs: [
        { k: "custom", t: "Custom (khud likhunga)" },
        { k: "pb_s", t: "Poly bag chhota (25x20x3)", l: 25, b: 20, h: 3 },
        { k: "pb_m", t: "Poly bag medium (35x28x5)", l: 35, b: 28, h: 5 },
        { k: "box_s", t: "Box chhota (20x15x10)", l: 20, b: 15, h: 10 },
        { k: "box_m", t: "Box medium (30x25x15)", l: 30, b: 25, h: 15 },
        { k: "box_l", t: "Box bada (45x35x25)", l: 45, b: 35, h: 25 },
      ],
      f: blank(),
      images: [], // { file, url }
      categories: [], subCategories: [], sub2Categories: [], units: [],
      maxImages: 6,
      saving: false,
      error: "",
      done: null,
    };
  },
  computed: {
    volG() {
      const f = this.f;
      return Math.round(((Number(f.length) || 0) * (Number(f.breadth) || 0) * (Number(f.height) || 0)) / 5000 * 1000);
    },
    billable() {
      const w = Math.max(Number(this.f.weight) || 0, this.volG);
      return w > 0 ? Math.ceil(w / 500) * 500 : 0;
    },
    isSuper() {
      const u = this.$auth.user;
      return !!(u && u.roles && u.roles.some((r) => r.id === 1));
    },
    org() {
      return this.$store.getters["settings/organization"];
    },
    productsLink() {
      const id = this.org && this.org.value;
      return id ? `/organizations/${id}/products` : "";
    },
    subs() {
      return this.subCategories.filter((s) => String(s.category_id) === String(this.f.category_id));
    },
    subs2() {
      return this.sub2Categories.filter((s) => String(s.sub_category_id) === String(this.f.sub_category_id));
    },
    sell() {
      const p = Number(this.f.price), o = Number(this.f.offer_price);
      if (o > 0 && o < p) return o;
      return p > 0 ? p : 0;
    },
    discount() {
      const p = Number(this.f.price);
      return this.sell > 0 && p > this.sell ? Math.round((1 - this.sell / p) * 100) : 0;
    },
  },
  mounted() {
    this.$axios
      .get("seller_catalog/form_data")
      .then((r) => {
        this.categories = r.data.categories || [];
        this.subCategories = r.data.sub_categories || [];
        this.sub2Categories = r.data.sub_2_categories || [];
        this.units = r.data.units || [];
        this.maxImages = r.data.max_images || 6;
      })
      .catch((e) => (this.error = this.msg(e, "Categories load nahi hui.")));
  },
  beforeDestroy() {
    this.images.forEach((i) => URL.revokeObjectURL(i.url));
  },
  methods: {
    applyPkg() {
      const p = this.pkgs.find((x) => x.k === this.pkg);
      if (p && p.l) { this.f.length = p.l; this.f.breadth = p.b; this.f.height = p.h; }
    },
    money(n) {
      return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    },
    msg(e, fb) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fb;
    },
    pickImages(ev) {
      const files = Array.from(ev.target.files || []);
      ev.target.value = "";
      for (const file of files) {
        if (this.images.length >= this.maxImages) break;
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
          this.error = `"${file.name}" photo nahi hai (sirf JPG / PNG / WEBP).`;
          continue;
        }
        if (file.size > 4 * 1024 * 1024) {
          this.error = `"${file.name}" 4 MB se badi hai.`;
          continue;
        }
        this.images.push({ file, url: URL.createObjectURL(file) });
      }
    },
    removeImage(i) {
      URL.revokeObjectURL(this.images[i].url);
      this.images.splice(i, 1);
    },
    makeCover(i) {
      const [im] = this.images.splice(i, 1);
      this.images.unshift(im);
    },
    validate() {
      const f = this.f;
      if (!this.images.length) return "Kam se kam 1 photo daaliye.";
      if (!f.name) return "Product ka naam likhiye.";
      if (!f.category_id) return "Category chuniye.";
      if (!(Number(f.price) > 0)) return "MRP / price daaliye.";
      if (f.offer_price !== "" && !(Number(f.offer_price) < Number(f.price))) return "Offer price MRP se kam hona chahiye.";
      if (f.qty === "" || Number(f.qty) < 0) return "Stock daaliye (0 bhi chalega).";
      if (!(Number(f.weight) >= 10)) return "Weight (gram) daaliye, kam se kam 10 g.";
      if (!(Number(f.length) >= 1 && Number(f.breadth) >= 1 && Number(f.height) >= 1)) return "Parcel ki length, breadth, height (cm) daaliye.";
      return "";
    },
    async submit() {
      this.error = this.validate();
      if (this.error) {
        if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const fd = new FormData();
      const f = this.f;
      Object.keys(f).forEach((k) => {
        if (k === "is_fragile") return fd.append(k, f[k] ? "1" : "0");
        if (f[k] !== "" && f[k] !== null) fd.append(k, f[k]);
      });
      this.images.forEach((im) => fd.append("images[]", im.file));
      this.saving = true;
      try {
        const r = await this.$axios.post("seller_catalog/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        this.done = r.data;
      } catch (e) {
        this.error = this.msg(e, "Save nahi ho saka.");
        if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
      } finally {
        this.saving = false;
      }
    },
    reset() {
      this.images.forEach((i) => URL.revokeObjectURL(i.url));
      this.images = [];
      this.f = blank();
      this.error = "";
      this.done = null;
    },
  },
};
</script>

<style scoped>
.ap-photos { display: flex; flex-wrap: wrap; gap: 12px; }
.ap-ph, .ap-add { width: 120px; height: 120px; border-radius: 10px; position: relative; overflow: hidden; }
.ap-ph { border: 1px solid #e3e8e5; background: #f6f8f7; }
.ap-ph img { width: 100%; height: 100%; object-fit: cover; }
.ap-cover { position: absolute; left: 6px; top: 6px; background: #0b5d3b; color: #fff; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
.ap-ph-actions { position: absolute; right: 4px; bottom: 4px; display: flex; gap: 4px; }
.ap-ph-actions button { border: 0; width: 26px; height: 26px; border-radius: 50%; background: rgba(0, 0, 0, 0.62); color: #fff; font-size: 11px; cursor: pointer; }
.ap-add { border: 2px dashed #b9c7bf; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #0b5d3b; cursor: pointer; margin: 0; font-weight: 600; font-size: 12.5px; }
.ap-add i { font-size: 24px; margin-bottom: 4px; }
.ap-add input { display: none; }
.ap-add:hover { background: #f1f7f3; }
.ap-sticky { position: sticky; top: 76px; }
.ap-card { border: 1px solid #e3e8e5; border-radius: 12px; overflow: hidden; }
.ap-card-img { height: 200px; background: #f1f4f2; display: flex; align-items: center; justify-content: center; color: #b3bfb8; font-size: 40px; }
.ap-card-img img { width: 100%; height: 100%; object-fit: cover; }
.ap-card-body { padding: 10px 12px; }
.ap-card-name { font-weight: 600; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ap-check { list-style: none; padding: 0; margin: 0 0 14px; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 13px; color: #8a978f; }
.ap-check li.ok { color: #12794a; font-weight: 600; }
</style>
