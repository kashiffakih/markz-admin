<template>
  <section>
    <select class="form-control custom-select"
      v-model="organizationId"
      @change="updateDetails"
    >
      <option value="">Select Organization</option>
      <option v-for="(org, i) in organizations" :key="`org'${i}`" :value="org.value">{{ org.text }} - {{ org.category ? org.category.name : '' }}</option>
    </select>
    <span style="display: none">{{ org.text }}</span>
  </section>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'AdminSettings',
  data: () => ({
    orgs: [],
    organizationId: '',
  }),
  computed: {
    org() {
      this.organizationId = this.$store.getters['settings/organization'].value
      return this.$store.getters['settings/organization']
    },
    organizations() {
      console.log(this.orgs)
      let organizations = []
      if(this.city.id)
       organizations = this.orgs.filter(org => org.city_id == this.city.id)
      else
       organizations = this.orgs
      organizations = organizations.map(organization => ({
        'text': organization.name,
        'value': organization.id,
        'category': organization.category,
        'time_zone': organization.time_zone ? organization.time_zone : 'Asia/Calcutta',
        logo_path: organization.logo_path
      }));
      return organizations
    }
  },
  asyncComputed: {
  },
  mounted() {
    this.getOrganizations()
    this.organizationId = this.$store.getters['settings/organization'].value
  },
  methods: {
    async getOrganizations() {
      let organizations = await this.$axios.get('/companies');
      this.orgs = organizations.data.data
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