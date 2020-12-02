<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Staffs"
      link="/logins"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Edit Login details</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="person" 
                name="name" 
                label="Name"
                v-model="form.name" 
                type="text"></v-text-field>
              <v-text-field 
                disabled
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.phone"
                prepend-icon="phone" 
                name="phone" 
                label="Phone" 
                v-model="form.phone"
                type="number"></v-text-field>
              <v-select
                :error-messages="errors.active"
                v-model="form.active"
                :items="status"
                label="Status"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'EditStaff',
  async asyncData({$axios, params}) {
    let staff = await $axios.get(`/users/${params.id}`)
    staff = staff.data.data
    staff.role_id = staff.roles ?  staff.roles[0].id : ''
    return {
      form: staff
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      role_id: ''
    },
    status: [
      {text: 'Approved', value: '1'},
      {text: 'Not Approved', value: '0'}
    ]
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
      let staff = await this.$axios.patch(`/users/${this.$route.params.id}`, this.form)
      this.$router.push('/logins')
    }
  }
}
</script>