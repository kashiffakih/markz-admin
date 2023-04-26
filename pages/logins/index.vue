<template>
  <section>
    <span class="title">Manage Logins</span>
    <br><br>
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.organizations[0].name }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">{{ !props.item.roles || props.item.roles[0].name  }}</td>
        <td class="text-xs-left">
          <span v-if="props.item.active == 0" style="color: red;">Inactive</span>
          <span v-else style="color: green">Active</span>
        </td>
        <td class="text-xs-left">
          <nuxt-link :to="`/logins/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageLogins',
  async asyncData({$axios}) { 
    let users = await $axios.get('/users?search=all');
    return {
      users: users.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Organization', value: 'organization' },
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phone' },
      { text: 'Role', value: 'role' },
      { text: 'Status', value: 'status' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>