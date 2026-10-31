<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Back Button -->
      <div class="container-fluid" style="padding: 10px 0;">
        <back-button />
      </div>
    <v-layout row wrap>
      <v-flex xs6 px-4>
        <session></session>
        <br>
        <salary></salary>
      </v-flex>
      <v-flex xs6 px-4>
        <monthly-attendance-table></monthly-attendance-table>
      </v-flex>
    </v-layout>
    </div>
  <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
import BackButton from "@/components/BackButton.vue";
import Session from '@/components/session.vue'
import MonthlyAttendanceTable from '@/components/monthly-attendance-table.vue'
import Salary from '@/components/salary.vue'

import Vue from 'vue'

export default {
  // async asyncData({$axios}) {
  //   let timeStampJson = await $axios.get('http://worldclockapi.com/api/json/utc/now')
  //   return {
  //     currentTimeStamp: timeStampJson.data.currentDateTime
  //   }
  // },
  components: {
    BackButton,
    Session, MonthlyAttendanceTable, Salary
  },
  created() {
    if(this.user.roles[0].name == 'Admin')
      this.$router.push('/')
  }
}
</script>