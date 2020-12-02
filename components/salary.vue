<template>
  <section>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Your Salary Till Now For {{ month }} : Rs. ******</h3>
        </div>
      </v-card-title>

      <v-card-actions>
        <no-ssr>
          <download-excel
            class   = "btn btn-default"
            :data   = "monthly_user_attendances"
            :fields = "json_fields"
            worksheet = "My Worksheet"
            name    = "MonthlyReport.xls"
          >
            <a href="#" class="download">export to excel</a>
          </download-excel>
        </no-ssr>
      </v-card-actions>
    </v-card>
  </section>
</template>

<script type="text/javascript">
import Vue from 'vue'
import moment from 'moment'
import moment_timezone from 'moment-timezone'

export default {
  data:() => ({
    monthly_user_attendances: [],
    month: '',
    json_fields: {
      'Date': 'date',
      'Login Time': 'login_time',
      'Break Details': 'breaks',
      'Logout Time': 'logout_time'
    },
    json_meta: [
      [
        {
          'key': 'charset',
          'value': 'utf-8'
        }
      ]
    ],
  }),
  async created() {
    let month = moment().format("MM")
    this.month = moment().format("MMMM")
    let attendances = await this.$axios.get(`user_attendances?month=${month}`)
    console.log(attendances.data.data)
    attendances.data.data.forEach((attendance) => {
      this.monthly_user_attendances.push({
        'date': attendance.date,
        'login_time': attendance.login_time,
        'logout_time': attendance.logout_time,
        'breaks': (attendance.user_attendance_breaks.length ? 
          attendance.user_attendance_breaks.map((br) => {
            return '<br>' + br.break_type.name + '<br>' + br.start_time + '-' + br.end_time
          }) : '')
      })
    })
  }
}

</script>