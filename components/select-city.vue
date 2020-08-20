<template>
  <section>
    <select class="form-control" v-model="city" @change="assignCity">
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
    city: 'Select City',
  }),
  props: ['cities'],
  methods: {
    assignCity() {
      if(this.city == 'Select City') {
        this.city = {
          id: '',
          name: '',
        }
      }
      this.$store.dispatch('settings/setCity', this.city)
      this.$router.push('/settings')
    }
  }
}
</script>