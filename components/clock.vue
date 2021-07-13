<template>
  <span>
    {{displayContent}} {{ display }}
  </span>
</template>

<script type="text/javascript">

import moment from 'moment'

export default {
  data: () => ({
    formattedTime: '',
    timer: '',
  }),
  props: ['time', 'content'],
  watch: {
    time: 'updateTimer'
  },
  computed: {
    display() {
      if(this.timer != 'Invalid date')
        return this.timer
      return null
    },
    displayContent() {
      if(this.timer != 'Invalid date')
        return this.content
      return null
    }
  },
  mounted() {
    this.formattedTime = moment(this.time, 'HH:mm:ss')

    setInterval(() => {
      this.formattedTime.add(1, 'seconds')
      this.timer = moment(this.formattedTime).format('HH:mm:ss')
    }, 1000)
  },
  methods: {
    updateTimer(newValue) {
      this.formattedTime = moment(newValue, 'HH:mm:ss')
      this.timer = moment(this.formattedTime).format('HH:mm:ss')
    }
  }
}  
</script>