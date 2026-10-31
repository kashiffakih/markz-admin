<template>
  <section>
    <select class="form-control" v-model="selectedCity" @change="assignCity">
      <option>Select City</option>
      <option
        v-for="(city, c) in cities"
        :key="`city${c}`"
        :value="city"
      >
        {{ city.name }}
      </option>
    </select>
  </section>
</template>

<script type="text/javascript">
export default {
  data: () => ({
    selectedCity: 'Select City',
  }),
  props: ['cities'],
  methods: {
    assignCity() {
      if(this.selectedCity == 'Select City') {
        this.selectedCity = {
          id: '',
          name: '',
        }
      }
      this.$store.dispatch('settings/setCity', this.selectedCity)
      this.$router.push('/settings')
    }
  }
}
</script>