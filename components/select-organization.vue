<template>
  <section>
    <select class="form-control custom-select"
      v-model="organizationId"
      @change="updateDetails"
    >
      <option value="">Select Organization</option>
      <option v-for="org in organizations" :key="`'org'${org.id}`" :value="org.value">{{ org.text }}</option>
    </select>
    <span style="display: none">{{ org.text }}</span>
  </section>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'AdminSettings',
  data: () => ({
    organizations: [],
    organizationId: '',
  }),
  computed: {
    org() {
      this.organizationId = this.$store.getters['settings/organization'].value
      return this.$store.getters['settings/organization']
    }
  },
  mounted() {
    this.getOrganizations()
    this.organizationId = this.$store.getters['settings/organization'].value
  },
  methods: {
    async getOrganizations() {
      let organizations = await this.$axios.get('/companies');
      organizations = organizations.data.data.map(organization => ({
        'text': organization.name,
        'value': organization.id,
        'time_zone': organization.time_zone ? organization.time_zone : 'Asia/Calcutta',
        logo_path: organization.logo_path
      }));
      this.organizations = organizations
    },
    updateDetails() {
      if(this.organizationId){
        let organization = this.organizations.filter(o => o.value == this.organizationId)
        if(organization.length) {
          this.$store.dispatch('settings/setOrganization', organization[0])
          // alert("Details Updated")
          this.$router.push('/organizations')
        }
      } else {
        alert("Please select the organization")
      }
    }
  }
}
</script> 