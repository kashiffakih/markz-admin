<template>
  <section>
    <div class="alert alert-danger alert-dismissible fade show"
      v-for="(alert, a) in alerts"
      :key="`alert${a}`"
      v-if="visible"
    >
      <strong>{{ alert }}</strong>
      <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>
  </section>
</template>

<script type="text/javascript">
  
export default {
  data: () => ({
    onGoingJobs: [],
    alerts: [],
    visible: true,
  }), 
  mounted() {
    this.getOnGoingJobs()
  },
  methods: {
    async getOnGoingJobs() {
      let onGoingJobs = await this.$axios.get('jobs?type=ongoing')
      onGoingJobs = onGoingJobs.data.data
      this.onGoingJobs = onGoingJobs
      onGoingJobs.forEach(onGoingJob => {
        if(onGoingJob.informed_client == 0){
          this.alerts.push('Please inform the Client about Job: ' + onGoingJob.vessel_name + ' and its inspector')
          // setTimeout(
          //   this.visible = false
          // ,4000);
          // let r = confirm("Have you informed the client about the inspector")
        }
      })
    }
  } 
} 
</script>