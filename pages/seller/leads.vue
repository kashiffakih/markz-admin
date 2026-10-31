<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="pn-hello">
            <div>
              <h2>Sign-up Leads</h2>
              <p>Jisne bhi register page par mobile number daala, woh yahan save hota hai, chahe usne registration poora kiya ho ya nahi. "Adhoora" wale ko call karke wapas laayein.</p>
            </div>
            <button class="btn btn-default" @click="load(1)"><i class="fas fa-sync-alt mr-1"></i> Refresh</button>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <div class="d-flex flex-wrap align-items-center mb-3" style="gap:10px">
            <div class="pn-seg" style="max-width:100%;overflow:auto">
              <button :class="{ on: status === '' }" @click="setStatus('')">Sab <span class="pm-count">{{ counts.all || 0 }}</span></button>
              <button :class="{ on: status === 'open' }" @click="setStatus('open')">Adhoora <span class="pm-count">{{ counts.open || 0 }}</span></button>
              <button :class="{ on: status === 'done' }" @click="setStatus('done')">Register ho gaya <span class="pm-count">{{ counts.done || 0 }}</span></button>
            </div>
            <input class="form-control" style="max-width:260px" v-model="search" placeholder="Mobile / email / naam" @keyup.enter="load(1)" />
          </div>

          <div class="card">
            <div class="card-body p-0 table-responsive">
              <table class="table">
                <thead><tr><th>Mobile</th><th>Email</th><th>Naam</th><th>Type</th><th>Status</th><th>Kab</th><th class="text-right">Contact</th></tr></thead>
                <tbody>
                  <tr v-for="l in rows" :key="l.id">
                    <td><b>{{ l.phone }}</b></td>
                    <td>{{ l.email || "-" }}</td>
                    <td>{{ [l.first_name, l.last_name].filter(Boolean).join(" ") || "-" }}</td>
                    <td>{{ roleText(l.role) }}</td>
                    <td>
                      <span class="pm-st" :class="l.step === 2 ? 'st-paid' : 'st-in_payout'">{{ l.step === 2 ? "Register ho gaya" : "Adhoora" }}</span>
                    </td>
                    <td class="text-muted" style="font-size:12.5px">{{ fmt(l.updated_at) }}</td>
                    <td class="text-right" style="white-space:nowrap">
                      <a :href="'tel:' + l.phone" class="btn btn-sm btn-outline-primary" title="Call"><i class="fas fa-phone"></i></a>
                      <a :href="wa(l)" target="_blank" rel="noopener" class="btn btn-sm btn-outline-success" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </td>
                  </tr>
                  <tr v-if="!rows.length && !loading"><td colspan="7"><div class="pn-empty"><i class="fas fa-address-book"></i>Abhi koi lead nahi</div></td></tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center" v-if="last > 1">
              <button class="btn btn-sm btn-default" :disabled="page <= 1" @click="load(page - 1)">Prev</button>
              <span class="text-muted">Page {{ page }} / {{ last }}</span>
              <button class="btn btn-sm btn-default" :disabled="page >= last" @click="load(page + 1)">Next</button>
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
  name: "SignupLeads",
  data() {
    return { rows: [], counts: {}, status: "", search: "", page: 1, last: 1, loading: false, error: "" };
  },
  mounted() {
    this.load(1);
  },
  methods: {
    fmt(d) {
      return d ? moment(d).format("DD MMM, hh:mm A") : "";
    },
    roleText(r) {
      return r === "Distributor" ? "Distributor" : r === "Seller" ? "Seller" : "Customer";
    },
    wa(l) {
      const t = l.step === 2
        ? "Namaste, Markz me register karne ke liye dhanyavaad!"
        : "Namaste, aapne Markz par register karna shuru kiya tha. Kya main registration poora karne me madad kar sakta hu?";
      return `https://wa.me/91${l.phone}?text=${encodeURIComponent(t)}`;
    },
    setStatus(s) {
      this.status = s;
      this.load(1);
    },
    async load(page) {
      this.loading = true;
      this.error = "";
      try {
        const r = await this.$axios.get("signup_leads", { params: { page, status: this.status || undefined, search: this.search || undefined } });
        this.rows = r.data.data || [];
        this.counts = r.data.counts || {};
        this.page = r.data.current_page || 1;
        this.last = r.data.last_page || 1;
      } catch (e) {
        this.rows = [];
        this.error = (e.response && e.response.data && e.response.data.message) || "Leads load nahi hui (sirf Super Admin).";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.pm-st { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.st-paid { background: #e1f5ea; color: #12794a; }
.st-in_payout { background: #fdf1da; color: #9a6205; }
.pm-count { display: inline-block; min-width: 20px; padding: 0 6px; margin-left: 6px; border-radius: 999px; background: #c99a2e; color: #fff; font-size: 11px; font-weight: 800; }
</style>
