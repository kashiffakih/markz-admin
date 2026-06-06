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

              <h1 class="m-0 text-dark">Conversions</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Conversions</li>
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
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">
                    Add Conversions for {{ inventory.name }}
                  </h3>
                  &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <div class="container">
                    <br />
                    <div class="card">
                      <div class="card-header">
                        <h6>
                          1 {{ inventory.unit.name }} of {{ inventory.name }} is
                          equal to
                          <input
                            type="number"
                            v-model="form.value"
                            placeholder="Enter  value"
                          />&nbsp;&nbsp;
                          <select v-model="form.unit_id">
                            <option
                              v-for="(unit, u) in units"
                              :key="`unit${u}`"
                              :value="unit.code"
                            >
                              {{ unit.label }}
                            </option></select
                          >&nbsp;&nbsp; of {{ inventory.name }}.
                        </h6>
                        <!-- <input type="checkbox"
                          v-model="form.is_default"
                        > &nbsp; Is this default unit to be displayed on the website -->
                        <span class="help-block" v-if="errors.value">{{
                          errors.value[0]
                        }}</span>
                        <span class="help-block" v-if="errors.unit_id"
                          ><br />{{ errors.unit_id[0] }}</span
                        >
                        <br />
                        <button
                          class="btn btn-primary"
                          @click="update"
                          v-if="form.id"
                        >
                          {{ loading ? "Saving..." : "Update Conversion" }}
                        </button>
                        <button class="btn btn-primary" @click="store" v-else>
                          {{ loading ? "Saving..." : "Add Conversion" }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
            </div>
          </div>
          <!-- /.row -->
        </div>
      </section>
      <!-- /.content -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Conversions</h3>
                  &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="13">Loading...</td>
                      </tr>
                      <tr
                        v-for="(conversion, i) in conversions"
                        :key="`conversion${i}`"
                      >
                        <div class="container">
                          <br />
                          <div class="card">
                            <div class="card-header">
                              <h6>
                                1 {{ inventory.unit.name }} of
                                {{ inventory.name }} is equal to
                                {{ conversion.value }}
                                {{ conversion.unit.name }} of
                                {{ inventory.name }}.
                                <nuxt-link
                                  title="Delete Conversion"
                                  class="icon"
                                  to=""
                                >
                                  <span @click="edit(conversion.id)">
                                    <i class="fa fa-edit"></i>
                                  </span> </nuxt-link
                                >&nbsp;&nbsp;
                                <nuxt-link
                                  title="Delete Conversion"
                                  class="icon"
                                  to=""
                                >
                                  <span @click="del(conversion.id)">
                                    <i class="fa fa-trash"></i>
                                  </span>
                                </nuxt-link>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
            </div>
          </div>
          <!-- /.row -->
        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
export default {
  name: "ManageConversions",
  components: {
    BackButton,
  },
  async asyncData({ $axios, params }) {
    let u = await $axios.get(`/units`);
    u = u.data.data;
    let units = [];
    units.push({
      label: "Select Unit",
      code: "",
    });
    u.forEach((role) => {
      units.push({
        label: role.name,
        code: role.id,
      });
    });
    let inventory = await $axios.get(`/inventories/${params.inventoryId}`);
    return {
      units: units,
      inventory: inventory.data.data,
    };
  },
  data: () => ({
    items: [],
    loading: false,
    form: {
      unit_id: "",
      is_default: false,
    },
  }),
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.items = [];
      this.loading = true;
      let conversions = await this.$axios.get(
        `/inventories/${this.$route.params.inventoryId}/inventory_unit_conversions`
      );
      this.conversions = conversions.data.data;
      this.loading = false;
    },
    async store() {
      this.loading = true;
      try {
        let admin = await this.$axios.post(
          `/inventories/${this.inventory.id}/inventory_unit_conversions`,
          this.form
        );
        this.loading = false;
        this.emptyForm();
        this.getData();
      } catch (e) {
        this.loading = false;
      }
    },
    async edit(id) {
      let form = await this.$axios.get(
        `/inventories/${this.inventory.id}/inventory_unit_conversions/${id}`
      );
      this.form = form.data.data;
    },
    async update() {
      this.loading = true;
      try {
        let admin = await this.$axios.patch(
          `/inventories/${this.inventory.id}/inventory_unit_conversions/${this.form.id}`,
          this.form
        );
        this.loading = false;
        this.emptyForm();
        this.getData();
      } catch (e) {
        this.loading = false;
      }
    },
    async del(id) {
      if (
        await this.$root.confirm("Are you sure you want to delete the data?")
      ) {
        await this.$axios.delete(
          `/inventories/${this.inventory.id}/inventory_unit_conversions/${id}`
        );
        this.getData();
      }
    },
    emptyForm() {
      this.form = {
        unit_id: "",
        is_default: false,
      };
    },
  },
};
</script>
