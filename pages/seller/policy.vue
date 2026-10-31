<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Delivery &amp; Returns Policy</h2>
              <p>Customer kitna delivery fee dega, return me galti kiski to paisa kaun bharega - sab yahin se tay hota hai.</p>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div v-if="!isSuper" class="alert alert-warning">Sirf Super Admin policy badal sakta hai.</div>
          <template v-else>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="ok" class="alert alert-success">{{ ok }}</div>

            <div class="row">
              <div class="col-lg-8">
                <div class="card">
                  <div class="card-header"><h3 class="card-title"><i class="fas fa-truck mr-2"></i>Customer delivery</h3></div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label>Is cart value se upar delivery FREE (&#8377;)</label>
                        <input class="form-control" type="number" min="0" v-model="p.customer_free_delivery_above" />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label>Is se kam par delivery fee (&#8377;)</label>
                        <input class="form-control" type="number" min="0" v-model="p.customer_delivery_fee" />
                      </div>
                    </div>
                    <small class="text-muted">Ye rule saare sellers par ek jaisa lagta hai (save karte hi sab sellers ki setting update ho jaati hai).</small>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header"><h3 class="card-title"><i class="fas fa-undo-alt mr-2"></i>Returns</h3></div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label>Return window (delivery ke baad kitne din)</label>
                        <input class="form-control" type="number" min="0" max="60" v-model="p.return_window_days" />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label>Customer ki galti par return fee (&#8377;)</label>
                        <input class="form-control" type="number" min="0" v-model="p.customer_return_fee" />
                      </div>
                    </div>
                    <small class="text-muted">Size / mann badalne jaise reason par customer ke refund se delivery fee + ye return fee kat-ti hai.</small>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header"><h3 class="card-title"><i class="fas fa-store mr-2"></i>Seller charges</h3></div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label>Shipping fee per order (&#8377;)</label>
                        <input class="form-control" type="number" min="0" v-model="p.seller_shipping_fee" />
                        <small class="text-muted">Har delivered order par seller ke payout se kat-ta hai (commission ke alawa).</small>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label>Seller ki galti par return shipping (&#8377;)</label>
                        <input class="form-control" type="number" min="0" v-model="p.seller_return_shipping_fee" />
                        <small class="text-muted">Galat / kharab product ka return aaye to seller ko ye dena padta hai.</small>
                      </div>
                    </div>
                    <hr />
                    <h6 style="font-weight:800">Weight ke hisaab se shipping</h6>
                    <p class="text-muted" style="font-size:13px">Courier <b>volumetric weight</b> (L x B x H / divisor) aur asli weight me se jo zyada ho wahi lagata hai, aur 500 g ke slab me. Upar wali fee pehle 500 g ki hai, uske baad:</p>
                    <div class="row">
                      <div class="col-md-4 mb-3"><label>501 g - 1 kg (&#8377;)</label><input class="form-control" type="number" min="0" v-model="p.seller_ship_1000" /></div>
                      <div class="col-md-4 mb-3"><label>1 kg - 2 kg (&#8377;)</label><input class="form-control" type="number" min="0" v-model="p.seller_ship_2000" /></div>
                      <div class="col-md-4 mb-3"><label>2 kg ke baad har +500 g (&#8377;)</label><input class="form-control" type="number" min="0" v-model="p.seller_ship_extra_500" /></div>
                      <div class="col-md-4 mb-3"><label>Volumetric divisor</label><input class="form-control" type="number" min="1000" v-model="p.volumetric_divisor" /><small class="text-muted">Courier ka 5000 hota hai.</small></div>
                      <div class="col-md-4 mb-3"><label>Weight na ho to default (g)</label><input class="form-control" type="number" min="10" v-model="p.default_weight_g" /></div>
                      <div class="col-md-4 mb-3"><label>Pickup late (ghante)</label><input class="form-control" type="number" min="1" v-model="p.pickup_late_hours" /><small class="text-muted">Itne ghante baad Pickups me laal.</small></div>
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary btn-lg" :disabled="saving" @click="save">
                  <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-check'"></i> Policy save karo
                </button>
              </div>

              <!-- explainer -->
              <div class="col-lg-4">
                <div class="card ap-sticky">
                  <div class="card-header"><h3 class="card-title">Kaun kitna bharta hai</h3></div>
                  <div class="card-body" style="font-size:13.5px;line-height:1.65">
                    <div class="mb-2"><b>Example: &#8377;{{ ex }} ka order, delivery fee &#8377;{{ exDelivery }}</b></div>
                    <table class="table table-sm mb-2">
                      <thead><tr><th>Return reason</th><th class="text-right">Customer ko</th><th class="text-right">Seller se</th></tr></thead>
                      <tbody>
                        <tr><td><span class="badge badge-danger">Seller ki galti</span><br /><small>galat / kharab / alag</small></td><td class="text-right">&#8377;{{ ex + exDelivery }}</td><td class="text-right">&minus;&#8377;{{ n(p.seller_return_shipping_fee) }}</td></tr>
                        <tr><td><span class="badge badge-info">Customer ki galti</span><br /><small>size / mann badla</small></td><td class="text-right">&#8377;{{ custRefund }}</td><td class="text-right">&#8377;0</td></tr>
                        <tr><td><span class="badge badge-warning">Courier / Markz</span><br /><small>kho gaya / toota</small></td><td class="text-right">&#8377;{{ ex + exDelivery }}</td><td class="text-right">&#8377;0</td></tr>
                      </tbody>
                    </table>
                    <div class="text-muted">Seller ko jo order ka paisa mil chuka ho, wo bhi refund par agle payout se wapas kat jaata hai.</div>
                    <hr />
                    <div><b>Return reasons (customer ko ye dikhte hain)</b></div>
                    <div v-for="r in reasons" :key="r.code" class="d-flex justify-content-between">
                      <span>{{ r.label }}</span>
                      <span class="badge" :class="r.fault === 'seller' ? 'badge-danger' : r.fault === 'customer' ? 'badge-info' : 'badge-warning'">{{ r.fault }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "MarkzPolicy",
  data() {
    return {
      p: {
        customer_free_delivery_above: 499, customer_delivery_fee: 40, return_window_days: 7,
        customer_return_fee: 50, seller_shipping_fee: 45, seller_return_shipping_fee: 60,
        seller_ship_1000: 70, seller_ship_2000: 110, seller_ship_extra_500: 30, volumetric_divisor: 5000, default_weight_g: 500, pickup_late_hours: 24,
      },
      reasons: [],
      ex: 800,
      saving: false,
      error: "",
      ok: "",
    };
  },
  computed: {
    isSuper() {
      const u = this.$auth.user;
      return !!(u && u.roles && u.roles.some((r) => r.id === 1));
    },
    exDelivery() {
      return this.ex >= Number(this.p.customer_free_delivery_above) ? 0 : Number(this.p.customer_delivery_fee) || 0;
    },
    custRefund() {
      return Math.max(0, this.ex + this.exDelivery - this.exDelivery - this.n(this.p.customer_return_fee));
    },
  },
  mounted() {
    if (!this.isSuper) return;
    this.$axios.get("policy").then((r) => {
      this.p = Object.assign({}, this.p, r.data.data);
      this.reasons = r.data.reasons || [];
    }).catch((e) => (this.error = this.msg(e, "Policy load nahi hui.")));
  },
  methods: {
    n(v) {
      return Number(v) || 0;
    },
    msg(e, fb) {
      const d = e && e.response && e.response.data;
      if (d && d.errors) return Object.values(d.errors)[0][0];
      return (d && d.message) || fb;
    },
    async save() {
      this.error = "";
      this.ok = "";
      this.saving = true;
      try {
        const r = await this.$axios.put("policy", this.p);
        this.p = Object.assign({}, this.p, r.data.data);
        this.ok = `Save ho gayi. ${r.data.sellers_updated} sellers par delivery rule lag gaya.`;
      } catch (e) {
        this.error = this.msg(e, "Save nahi ho saka.");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.ap-sticky { position: sticky; top: 76px; }
</style>
