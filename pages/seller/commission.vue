<template>
  <section>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <back-button />
              <h1 class="m-0 text-dark">Commission Settings</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/">Home</nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/seller/dashboard">Marketplace</nuxt-link></li>
                <li class="breadcrumb-item active">Commission</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">

          <!-- Tab Navigation -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'rules' }" href="#" @click.prevent="activeTab = 'rules'">
                <i class="fas fa-cog mr-1"></i> Commission Rules
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'sellers' }" href="#" @click.prevent="activeTab = 'sellers'">
                <i class="fas fa-store mr-1"></i> Seller Commission
              </a>
            </li>
          </ul>

          <!-- Tab 1: Commission Rules -->
          <div v-show="activeTab === 'rules'">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title"><i class="fas fa-percentage mr-2"></i>Commission Rules</h3>
                <div class="card-tools">
                  <button class="btn btn-sm btn-primary" @click="openCreateModal">
                    <i class="fas fa-plus mr-1"></i> Add Rule
                  </button>
                </div>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th class="text-right">Value</th>
                      <th>Category</th>
                      <th class="text-right">Min</th>
                      <th class="text-right">Max</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingRules">
                      <td colspan="8" class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</td>
                    </tr>
                    <tr v-else-if="rules.length === 0">
                      <td colspan="8" class="text-center py-4 text-muted">No commission rules. Click "Add Rule" to create one.</td>
                    </tr>
                    <tr v-for="rule in rules" :key="rule.id">
                      <td><strong>{{ rule.name }}</strong></td>
                      <td>
                        <span class="badge" :class="rule.type === 'percentage' ? 'badge-primary' : 'badge-info'">
                          {{ rule.type }}
                        </span>
                      </td>
                      <td class="text-right">
                        {{ rule.type === 'percentage' ? rule.value + '%' : '₹' + parseFloat(rule.value).toFixed(2) }}
                      </td>
                      <td>{{ rule.category ? rule.category.name : 'All Categories' }}</td>
                      <td class="text-right">₹{{ parseFloat(rule.min_commission || 0).toFixed(2) }}</td>
                      <td class="text-right">{{ rule.max_commission ? '₹' + parseFloat(rule.max_commission).toFixed(2) : 'No cap' }}</td>
                      <td>
                        <span class="badge" :class="rule.is_active ? 'badge-success' : 'badge-secondary'">
                          {{ rule.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-info btn-sm" @click="editRule(rule)" title="Edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-danger btn-sm" @click="deleteRule(rule)" title="Delete">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Tab 2: Seller Commission -->
          <div v-show="activeTab === 'sellers'">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title"><i class="fas fa-store mr-2"></i>Per-Seller Commission</h3>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Seller</th>
                      <th>Commission Type</th>
                      <th class="text-right">Commission Value</th>
                      <th>Approved</th>
                      <th>Enabled</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingSellers">
                      <td colspan="6" class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</td>
                    </tr>
                    <tr v-else-if="sellerCommissions.length === 0">
                      <td colspan="6" class="text-center py-4 text-muted">No sellers found</td>
                    </tr>
                    <tr v-for="seller in sellerCommissions" :key="seller.id">
                      <td><strong>{{ seller.name }}</strong></td>
                      <td>
                        <span class="badge" :class="isPercent(seller.comission_type) ? 'badge-primary' : 'badge-info'">
                          {{ seller.comission_type || 'Not set' }}
                        </span>
                      </td>
                      <td class="text-right">
                        <template v-if="seller.comission_value">
                          {{ isPercent(seller.comission_type) ? seller.comission_value + '%' : '₹' + parseFloat(seller.comission_value).toFixed(2) }}
                        </template>
                        <span v-else class="text-muted">Not set</span>
                      </td>
                      <td>
                        <span class="badge" :class="seller.is_approved ? 'badge-success' : 'badge-warning'">
                          {{ seller.is_approved ? 'Yes' : 'No' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" :class="seller.is_enabled ? 'badge-success' : 'badge-secondary'">
                          {{ seller.is_enabled ? 'Yes' : 'No' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-info btn-sm" @click="openSellerEditModal(seller)" title="Edit Commission">
                          <i class="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Create/Edit Rule Modal -->
    <v-dialog v-model="showRuleModal" max-width="500">
      <v-card>
        <v-card-title class="headline">{{ editingRule ? 'Edit' : 'Create' }} Commission Rule</v-card-title>
        <v-card-text>
          <v-text-field v-model="ruleForm.name" label="Rule Name" outline></v-text-field>
          <v-select v-model="ruleForm.type" :items="[{text:'Percentage', value:'percentage'}, {text:'Fixed Amount', value:'fixed'}]" label="Type" outline></v-select>
          <v-text-field v-model="ruleForm.value" :label="ruleForm.type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (₹)'" type="number" step="0.01" outline></v-text-field>
          <v-select v-model="ruleForm.category_id" :items="categoryOptions" label="Category (optional — blank = all)" outline clearable></v-select>
          <v-text-field v-model="ruleForm.min_commission" label="Minimum Commission (₹)" type="number" step="0.01" outline></v-text-field>
          <v-text-field v-model="ruleForm.max_commission" label="Maximum Commission Cap (₹, optional)" type="number" step="0.01" outline></v-text-field>
          <v-textarea v-model="ruleForm.description" label="Description (optional)" rows="2" outline></v-textarea>
          <v-checkbox v-model="ruleForm.is_active" label="Active"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showRuleModal = false">Cancel</v-btn>
          <v-btn color="primary" :loading="actionLoading" @click="saveRule">{{ editingRule ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Seller Commission Modal -->
    <v-dialog v-model="showSellerModal" max-width="400">
      <v-card>
        <v-card-title class="headline">Edit Seller Commission</v-card-title>
        <v-card-text v-if="editingSeller">
          <p><strong>Seller:</strong> {{ editingSeller.name }}</p>
          <v-select v-model="sellerForm.comission_type" :items="[{text:'Percentage', value:'Percent'}, {text:'Fixed', value:'Flat'}]" label="Commission Type" outline></v-select>
          <v-text-field v-model="sellerForm.comission_value" :label="isPercent(sellerForm.comission_type) ? 'Percentage (%)' : 'Fixed Amount (₹)'" type="number" step="0.01" outline></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="showSellerModal = false">Cancel</v-btn>
          <v-btn color="primary" :loading="actionLoading" @click="updateSellerCommission">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import BackButton from "~/components/BackButton";

export default {
  components: { BackButton },
  data() {
    return {
      activeTab: "rules",
      rules: [],
      sellerCommissions: [],
      categories: [],
      loadingRules: false,
      loadingSellers: false,
      actionLoading: false,
      showRuleModal: false,
      showSellerModal: false,
      editingRule: null,
      editingSeller: null,
      ruleForm: {
        name: "", type: "percentage", value: 0, category_id: null,
        min_commission: 0, max_commission: null, description: "", is_active: true,
      },
      sellerForm: { comission_type: "Percent", comission_value: 0 },
    };
  },
  computed: {
    categoryOptions() {
      return this.categories.map((c) => ({ text: c.name, value: c.id }));
    },
  },
  mounted() {
    this.fetchRules();
    this.fetchSellerCommissions();
    this.fetchCategories();
  },
  methods: {
    isPercent(t) {
      const x = String(t || "").toLowerCase();
      return x === "percent" || x === "percentage";
    },
    async fetchRules() {
      this.loadingRules = true;
      try {
        const res = await this.$axios.get("commission_settings");
        this.rules = res.data.data || [];
      } catch (e) { this.rules = []; }
      this.loadingRules = false;
    },
    async fetchSellerCommissions() {
      this.loadingSellers = true;
      try {
        const res = await this.$axios.get("commission_settings/seller_commissions");
        this.sellerCommissions = res.data.data || [];
      } catch (e) { this.sellerCommissions = []; }
      this.loadingSellers = false;
    },
    async fetchCategories() {
      try {
        const res = await this.$axios.get("categories");
        this.categories = res.data.data || res.data.categories || [];
      } catch (e) { this.categories = []; }
    },
    openCreateModal() {
      this.editingRule = null;
      this.ruleForm = {
        name: "", type: "percentage", value: 0, category_id: null,
        min_commission: 0, max_commission: null, description: "", is_active: true,
      };
      this.showRuleModal = true;
    },
    editRule(rule) {
      this.editingRule = rule;
      this.ruleForm = { ...rule };
      this.showRuleModal = true;
    },
    async saveRule() {
      if (!this.ruleForm.name) {
        this.$toast.error("Rule name is required");
        return;
      }
      this.actionLoading = true;
      try {
        if (this.editingRule) {
          await this.$axios.put(`commission_settings/${this.editingRule.id}`, this.ruleForm);
          this.$toast.success("Rule updated");
        } else {
          await this.$axios.post("commission_settings", this.ruleForm);
          this.$toast.success("Rule created");
        }
        this.showRuleModal = false;
        this.fetchRules();
      } catch (e) {
        this.$toast.error("Failed to save rule");
      }
      this.actionLoading = false;
    },
    async deleteRule(rule) {
      if (!confirm(`Delete "${rule.name}"?`)) return;
      try {
        await this.$axios.delete(`commission_settings/${rule.id}`);
        this.$toast.success("Rule deleted");
        this.fetchRules();
      } catch (e) {
        this.$toast.error("Failed to delete rule");
      }
    },
    openSellerEditModal(seller) {
      this.editingSeller = seller;
      this.sellerForm = {
        comission_type: this.isPercent(seller.comission_type) || !seller.comission_type ? "Percent" : "Flat",
        comission_value: seller.comission_value || 0,
      };
      this.showSellerModal = true;
    },
    async updateSellerCommission() {
      this.actionLoading = true;
      try {
        await this.$axios.put(`commission_settings/seller/${this.editingSeller.id}`, this.sellerForm);
        this.$toast.success("Seller commission updated");
        this.showSellerModal = false;
        this.fetchSellerCommissions();
      } catch (e) {
        this.$toast.error("Failed to update seller commission");
      }
      this.actionLoading = false;
    },
  },
};
</script>

<style scoped>
.badge { text-transform: capitalize; font-size: 12px; padding: 4px 8px; }
.nav-tabs .nav-link.active { font-weight: bold; border-bottom: 2px solid #007bff; }
</style>
