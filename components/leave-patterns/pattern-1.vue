<template>
  <section>
    <v-toolbar flat color="white">
      <v-toolbar-title>{{ heading }}</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn
          slot="activator" 
          small
          fab
          :color="baseColor"
          title="Add New Batch"
          :dark="darkStatus"
        >
          <v-icon>
            add
          </v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.name" label="Leave Type"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.leaves" label="No. of Leaves"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="company_leaves"
      class="elevation-1"
      :loading="loading"
      hide-actions 
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1}}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.leaves }}</td>
        <td>
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">

export default {
  name: 'leave-pattern-1',
  props: ['heading'],
  async asyncData({$axios, params}) { 

  },
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Leave Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'No of Leaves', value: 'leaves' },
      { text: 'Action', value: '' }
    ],
    company_leaves: [],
    editedIndex: -1,
    editedItem: {
      leave_pattern_id: 1,
      name: '',
      leaves: ''
    },
    defaultItem: {
      leave_pattern_id: 1,
      name: '',
      leaves: ''
    },
    loading: true
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  async created() {
    this.updateLeaveTypes(this.form)
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {

    async updateLeaveTypes(newForm) {
      let company_leaves = await this.$axios.get(`company_leaves`);
      this.company_leaves = company_leaves.data.data.filter(leave => leave.leave_pattern_id == 1)
      this.loading = false
    },

    editItem (item) {
      this.editedIndex = this.company_leaves.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save () {
      if (this.editedIndex > -1) {
        await this.$axios.patch(`company_leaves/${this.editedItem.id}`, this.editedItem)
        Object.assign(this.company_leaves[this.editedIndex], this.editedItem)
      } else {
        await this.$axios.post(`/company_leaves`, this.editedItem)
        this.company_leaves.push(this.editedItem)
      }
      this.close()
    }
  } 
}
</script>